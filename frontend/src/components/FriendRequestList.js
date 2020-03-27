import { List, Typography, Avatar } from 'antd';
import React from 'react';
import { authAxios } from '../components/util';



class FriendRequestList extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    friendrequestlist: [],
  };

  componentDidMount(){
    authAxios.get('http://127.0.0.1:8000/userprofile/current-user/friends')
    .then(res =>{
      console.log(res)
      this.setState({
        friendrequestlist:res.data,
        })
      }
    )
  }
  render() {
    const friendrequestlist = this.state
    return(
      <List
        itemLayout="horizontal"
        dataSource={this.state.friendrequestlist}
        renderItem={item => (
      <List.Item>
        <List.Item.Meta
          avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
          title={<a href="https://ant.design">{item.from_user}</a>}
          description="Ant Design, a design language for background applications, is refined by Ant UED Team"
        />
      </List.Item>
    )}
     />
    )
  }
}



export default FriendRequestList;
