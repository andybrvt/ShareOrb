import React from 'react';
import { List, Avatar } from 'antd';



class NewSidePanel extends React.Component{
  // This file will hold the side panel of the chats. It will include
  // a list of people that you are chatting with. It will also inlude a way
  // to make a new chat. and search for people

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
      <div className = "newSidePanel">
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
    )

  }
}

export default NewSidePanel;
