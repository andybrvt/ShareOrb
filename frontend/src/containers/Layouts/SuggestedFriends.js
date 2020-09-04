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



class SuggestedFriends extends React.Component {
  state = {
    initLoading: true,
    loading: false,
    data: [],
    list: [],
    counter:2,

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
        list: res.data,
      });
    });


    authAxios.get('http://127.0.0.1:8000/userprofile/everyoneSuggested')
        .then(res=> {
          console.log(res)

          console.log(res.data)
          this.setState({
            data:res.data,
         });
       });
       console.log(this.state.data)
  }

  getData = callback => {
    authAxios.get('http://127.0.0.1:8000/userprofile/suggestedFriends')
        .then(res=> {

          this.setState({
            list:res.data,
         });
       });
       console.log(this.state.list)

  };





  onLoadMore = () => {
    console.log(this.state.counter)
    console.log(this.state.data)
    console.log(this.state.list)
    // this.setState({
    //   loading: true,
    //   // list: this.state.data.concat([...new Array(2)].map(() => ({ loading: true, get_followers:[]}))),
    //   counter:this.state.counter+1,
    // });


    console.log(this.state.counter)
          const data = this.state.list.concat(this.state.data.slice(this.state.counter+1, this.state.counter+3));
          console.log(this.state.data)
          this.setState({
            list: data,
            loading: false,
            counter: this.state.counter+2
         },
           () => {
             // Resetting window's offsetTop so as to display react-virtualized demo underfloor.
             // In real scene, you can using public method of react-virtualized:
             // https://stackoverflow.com/questions/46700726/how-to-use-public-method-updateposition-of-react-virtualized
             window.dispatchEvent(new Event('resize'));

             },
       )
       }


  render() {
    console.log(this.state.data)
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
                title={<a href={"http://localhost:3000/explore/"+item.username}> {item.username}</a>}
                description={item.get_followers.length +" followers"}
              />



                  <Button id="follow-button"> Follow </Button>

              </Skeleton>
            </List.Item>
          )}
        />
        <div style={{marginTop:'25px'}}>
        {((this.state.counter)>=8)?

          <Button href="http://localhost:3000/explore" type="primary">Explore Page</Button>

          :

            <Button onClick={this.onLoadMore}>Explore More</Button>
        }
        </div>

      </div>
    );
  }
}

export default SuggestedFriends;
