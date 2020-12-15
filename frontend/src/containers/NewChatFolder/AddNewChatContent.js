import React from 'react';
import { Input, List, Avatar, Spin} from 'antd';
import './NewChat.css';
// This fucntion will be the search function and add function
// when you are trying to add new chats or make new chats

class AddNewChatContent extends React.Component{


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
      <div className ="addNewChatContainer">
        <div className = "searchFormBox">
          <form>
            <Input />
          </form>
        </div>

      <div className = "searchChatContent">
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


      <div className = "searchChatInput">
        <form>
          <div className = "searchChatInputBox">
          <Input
          className = "chatInput"
           />
          </div>
        </form>
      </div>
      </div>

    )

  }
}

export default AddNewChatContent;
