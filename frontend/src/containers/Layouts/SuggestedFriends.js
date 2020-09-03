import { List, Avatar, Button, Skeleton } from 'antd';
import './SuggestedFriends.css';
import Icon from '@ant-design/icons';
import {
DownloadOutlined,
SearchOutlined
} from '@ant-design/icons';
// import reqwest from 'reqwest';
import React from 'react';
import { authAxios } from '../../components/util';



const count = 4;
const fakeDataUrl = `https://randomuser.me/api/?results=${count}&inc=name,gender,email,nat&noinfo`;

class SuggestedFriends extends React.Component {
  state = {
    initLoading: true,
    loading: false,
    data: [],
    list: [],
  };


  // async componentDidMount(){
  //
  //   await authAxios.get('http://127.0.0.1:8000/userprofile/suggestedFriends')
  //     .then(res=> {
  //       console.log(res)
  //       console.log(res.data)
  //       this.setState({
  //         list:res.data,
  //         data:res.data,
  //      });
  //    });
  //  }



  componentDidMount() {
    console.log("made it")
    this.getData(res => {

      this.setState({
        initLoading: false,
        data: res.data,
        list: res.data,
      });
    });
  }

  getData = callback => {
    authAxios.get('http://127.0.0.1:8000/userprofile/suggestedFriends')
        .then(res=> {
          console.log(res)
          console.log(res.data)
          this.setState({
            list:res.data,
            data:res.data,
         });
       });
       console.log(this.state.list)
       console.log(this.state.data)
  };





  onLoadMore = () => {
    this.setState({
      loading: true,
      list: this.state.data.concat([...new Array(count)].map(() => ({ loading: true, get_followers:[]}))),
    });
    console.log(this.state.list)


    authAxios.get('http://127.0.0.1:8000/userprofile/suggestedFriends')
        .then(res=> {
          console.log(res)
          console.log(res.data)
          const data = this.state.data.concat(res.data);
          this.setState({
            data,
            list: data,
            loading: false,
         },
           () => {
             // Resetting window's offsetTop so as to display react-virtualized demo underfloor.
             // In real scene, you can using public method of react-virtualized:
             // https://stackoverflow.com/questions/46700726/how-to-use-public-method-updateposition-of-react-virtualized
             window.dispatchEvent(new Event('resize'));

             },
       )
       });



    console.log(this.state.list)
  };

  render() {
    const { initLoading, loading, list } = this.state;
    const loadMore =
       !initLoading && !loading ? (
         <div
           style={{
             textAlign: 'center',
             marginTop: 12,
             height: 32,
             lineHeight: '32px',
           }}
         >


        </div>
      ) : null;
      const ConsoleLog = ({ children }) => {
        console.log(children);
        return false;
      };
    return (


      <div>
        <List
          className="demo-loadmore-list scrollableFeature"

          itemLayout="horizontal"
          loadMore={loadMore}
          dataSource={list}
          renderItem={item => (

            <List.Item

            >

              <Skeleton avatar title={false} loading={item.loading} active>
    
              <List.Item.Meta
                avatar={
                  <Avatar src={item.profile_picture} />
                }
                title={<a href="https://ant.design"> {item.username}</a>}
                description={item.get_followers.length +" followers"}
              />



                  <Button id="follow-button"> + Follow </Button>

              </Skeleton>
            </List.Item>
          )}
        />
        <Button  id="follow-button" onClick={this.onLoadMore}>Explore More</Button>
      </div>
    );
  }
}

export default SuggestedFriends;
