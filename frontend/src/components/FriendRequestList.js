import { List, Typography, Avatar, Button} from 'antd';
import React from 'react';
import { authAxios } from '../components/util';



class FriendRequestList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      friendrequestlist: [],

    };


    // this.onClickAccept = this.onClickAccept.bind(this);
    // this.onClickDecline = this.onClickDecline.bind(this);
  }

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

  onClickAccept = (userID) => {
    const user = userID
    console.log(userID)
    authAxios.post('http://127.0.0.1:8000/userprofile/friend-request/accept/'+user)
    }

  onClickDecline = (userID) => {
    const user = userID
    console.log(userID)
    authAxios.post('http://127.0.0.1:8000/userprofile/friend-request/delete/'+user)
    }
// you do the {() => this.WHATEVER FUNCTION ()} this will allow you to add parameters into your function and
// allow you to do a onclick as well
  render() {
    const friendrequestlist = this.state
    console.log(this.state.friendrequestlist.from_user)
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

        <Button type="primary" onClick ={() =>this.onClickAccept(item.from_user)}>Accept</Button>
        <Button danger style={{ background: "white", color: "red" }} onClick ={() =>this.onClickDecline(item.from_user)}>Decline</Button>
      </List.Item>
    )}
     />
    )
  }
}



export default FriendRequestList;
