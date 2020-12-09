import React from 'react';
import "./NewChat.css";
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';


class NewChatHeader extends React.Component{

  // This class will take care of the header for the chat, including names
  // and such

  render(){

    return(
      <div className = 'newChatHeader'>
      <Avatar
      className = "avaHeader"
       size={50} icon={<UserOutlined />} />

       <span
       className = "nameHeader"
       > Put Name Here </span>

      </div>
    )
  }

}

export default NewChatHeader;
