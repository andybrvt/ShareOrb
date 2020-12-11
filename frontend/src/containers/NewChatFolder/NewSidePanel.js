import React from 'react';
import { List, Avatar } from 'antd';



class NewSidePanel extends React.Component{
  // This file will hold the side panel of the chats. It will include
  // a list of people that you are chatting with. It will also inlude a way
  // to make a new chat. and search for people

  render(){

    console.log(this.props)

    let chatList = []

    if(this.props.chatList){
      chatList = this.props.chatList
    }

    const data = [
      {
        title: 'Ant Design Title 1',
      },
      {
        title: 'Ant Design Title 2',
      },
      {
        title: 'Ant Design Title 3',
      },
      {
        title: 'Ant Design Title 4',
      },
    ];

    return(
      <div className = "newSidePanel">
      <List
        itemLayout="horizontal"
        dataSource={chatList}
        renderItem={item => (

          item.participants.length === 2 ?
          <List className = "chatItem">
            <div>
            <Avatar src = {'http://127.0.0.1:8000'+item.participants[1].profile_picture} />
            <div>
              <p>{item.participants[1].first_name} {item.participants[1].last_name}</p>
              <p> This is the description of the text </p>
            </div>

            </div>
          </List>

          :

          <div>

          </div>
        )}
      />
      </div>
    )

  }
}

export default NewSidePanel;
