import React from 'react';
import { Input, List, Avatar, Spin} from 'antd';
import './NewChat.css';

class ManageChatHeader extends React.Component{




  render(){
    return(
        <div className = "newManageChatHeader">
          <form
          className = "manageChatForm"

          >
            <Input
            className = "searchInput"
            placeholder = "Search chats..."
            />
          </form>
        <div
        className = "addChatsButton"
        >
          <i class="far fa-plus-square"></i>
        </div>

        </div>
    )
  }
}

export default ManageChatHeader;
