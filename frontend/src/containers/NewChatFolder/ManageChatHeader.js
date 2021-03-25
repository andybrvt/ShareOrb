import React from 'react';
import { Input, Divider} from 'antd';
import './NewChat.css';

class ManageChatHeader extends React.Component{

  onClickAddChats = () =>{
    // This will redirect to the right create chat area
    this.props.history.push("/chat/newchat")
  }

  onClickInput = () =>{

    // This onClick here will be in charge of showing the search list
    // when you click on the search

    console.log('click the input')
    this.props.openChatSearch()
  }

  onBackClick = () => {
    // This function will be used to close the on chat search
    this.props.closeChatSearch()
  }


  render(){
    return(
        <div className = "newManageChatHeader">
          {
            this.props.showChatSearch ?

            <div
              className = "searchChatBack"
              onClick = {() => this.onBackClick()}>
              <i class="fas fa-arrow-circle-left"></i>
            </div>

            :

            <div className = "searchChatBack">
            </div>


          }

          <div className = "manageChatForm">
              <Input
              className = "searchInput"
              placeholder = "Search chats..."
              onClick = {() => this.onClickInput()}
              />
          </div>
          <div class="addChatsButtonContainer">
              <i
                onClick = {() => this.onClickAddChats()}
                style={{color:'#1890ff', fontSize:'24px'}}
                class="addChatsButton fas fa-plus-circle"></i>
          </div>

        </div>

    )
  }
}

export default ManageChatHeader;
