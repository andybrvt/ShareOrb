import React from 'react';
import "./SocialEventPage.css";
import moment from 'moment';
import { Comment, Tooltip, List, Avatar, Input, Form, Button } from 'antd';


class SocialEventGroupChat extends React.Component{
// This class is to hold the information for the group chats in
// the socialEventgroupchat

  render(){

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
    return (
      <div className = "socialEventGroupChat">
         <div className = "messageList">
         <List
             itemLayout="horizontal"
             dataSource={data}
             renderItem={item => (
               <List.Item>
                 <List.Item.Meta
                   avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                   title={<a href="https://ant.design">{item.title}</a>}
                   description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                 />
               </List.Item>
             )}
           />
        </div>


        <div className = "inputForm">
          <Form>
            <Input
            className = "socialEventChatInput"
            placeholder = "Write a message..."
            />
          </Form>

        </div>

      </div>
    )
  }
}


export default SocialEventGroupChat;
