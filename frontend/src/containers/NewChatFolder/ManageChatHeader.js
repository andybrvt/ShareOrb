import React from 'react';
import { Input, List, Avatar, Spin} from 'antd';
import './NewChat.css';

class ManageChatHeader extends React.Component{

  onClickAddChats = () =>{
    // This will redirect to the right create chat area
    this.props.history.push("/chat/newchat")
  }


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

        <i
          onClick = {() => this.onClickAddChats()}
          style={{color:'#1890ff', fontSize:'24px'}}
          class="fas fa-plus-circle"></i>
        </div>

        </div>
    )
  }
}

export default ManageChatHeader;
