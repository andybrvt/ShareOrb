import { List, Typography } from 'antd';
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
    this.setState({
      friendrequestlist:res.data,
      })
    }
  )
}

  render(){
    console.log(this.state.friendrequestlist)
    const friendrequestlist = this.state
    console.log(friendrequestlist)
    return(
      <div>
        <h3 style={{ marginBottom: 16 }}>Default Size</h3>
        <List
          header={<div>Header</div>}
          footer={<div>Footer</div>}
          bordered
          dataSource = {this.state.friendrequestlist}
          renderItem={item => (
            <List.Item>
               <div> hellow</div>
            </List.Item>
          )}
        />
      </div>
  )
}
};

export default FriendRequestList;
