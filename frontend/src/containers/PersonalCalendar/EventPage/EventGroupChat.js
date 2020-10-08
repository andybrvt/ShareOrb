import React from 'react';
import moment from 'moment';
import { Comment, Tooltip, List, Avatar, Input, Form, Button } from 'antd';
import { SendOutlined  } from '@ant-design/icons';
import './EventPage.css';

class EventGroupChat extends React.Component{


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

    return(
      <div className = 'eventGroupChatContainer'>
      <div className = 'messageList'>
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
        />      </div>
      <div className = 'inputForm'>

      <Form>
        <Input />

      </Form>
      </div>

      </div>

    )
  }
}

export default EventGroupChat;
