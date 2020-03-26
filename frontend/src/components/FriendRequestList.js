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

x
  render(){
    console.log(this.state.friendrequestlist)
    return(

      <div>
        <h3 style={{ marginBottom: 16 }}>Default Size</h3>
        <List
          header={<div>Header</div>}
          footer={<div>Footer</div>}
          bordered
          renderItem={item => (
            <List.Item>
              <Typography.Text mark>[ITEM]</Typography.Text> {item}
            </List.Item>
          )}
        />
        <h3 style={{ margin: '16px 0' }}>Small Size</h3>
        <List
          size="small"
          header={<div>Header</div>}
          footer={<div>Footer</div>}
          bordered
          renderItem={item => <List.Item>{item}</List.Item>}
        />
        <h3 style={{ margin: '16px 0' }}>Large Size</h3>
        <List
          size="large"
          header={<div>Header</div>}
          footer={<div>Footer</div>}
          bordered
          renderItem={item => <List.Item>{item}</List.Item>}
        />
      </div>
  )
}
};

export default FriendRequestList;
