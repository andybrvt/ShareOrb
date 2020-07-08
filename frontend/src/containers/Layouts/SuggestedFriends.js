import { List, Avatar, Button, Skeleton } from 'antd';
import './SuggestedFriends.css';
import Icon from '@ant-design/icons';
import {
DownloadOutlined,
SearchOutlined
} from '@ant-design/icons';
import reqwest from 'reqwest';
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


  async componentDidMount(){

    await authAxios.get('http://127.0.0.1:8000/userprofile/suggestedFriends')
      .then(res=> {
        console.log(res)
        console.log(res.data)
        this.setState({
          list:res.data,
       });
     });
   }

    /*

  componentDidMount() {
    this.getData(res => {
      console.log(res)
      this.setState({
        initLoading: false,
        data: res.results,
        list: res,
      });
    });
  }

  getData = callback => {
    reqwest({
      url: 'http://127.0.0.1:8000/userprofile/suggestedFriends',
      type: 'json',
      method: 'get',
      contentType: 'application/json',
      success: res => {
        callback(res);
      },
    });
  };

  */



  onLoadMore = () => {
    this.setState({
      loading: true,
      list: this.state.data.concat([...new Array(count)].map(() => ({ loading: true, name: {} }))),
    });
    this.getData(res => {
      const data = this.state.data.concat(res.results);
      this.setState(
        {
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
      );
    });
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

    return (


      <div>
        <List
          className="demo-loadmore-list"

          itemLayout="horizontal"
          loadMore={loadMore}
          dataSource={list}
          renderItem={item => (

            <List.Item
              actions={[<a key="list-loadmore-edit">edit</a>, ]}
            >
              <Skeleton avatar title={false} loading={item.loading} active>
                <List.Item.Meta
                  avatar={
                    <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                  }
                  title={<a href="https://ant.design"> {item.username}</a>}
                  description="10 Followers"
                />

                  <Button id="follow-button"> + Follow </Button>

              </Skeleton>
            </List.Item>
          )}
        />
        <Button onClick={this.onLoadMore}>Explore</Button>
      </div>
    );
  }
}

export default SuggestedFriends;
