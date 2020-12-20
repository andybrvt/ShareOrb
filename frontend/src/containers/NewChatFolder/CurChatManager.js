import React from 'react';
import { Avatar, Button, Modal, List } from 'antd';
import CurChatEventList from './ChatManagerFolder/CurChatEventList';

// This will be the far right side of the chats that holds the
// user profile pic and actions such as event sync, event invite,
// share events etc
class CurChatManager extends React.Component{


  state = {
    showShareEvent: false,
    eventList: []
  }

  capitalize (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  getChatUserProfile(participantList){
    // This function will show the correct userProfile that you are chatting
    // with

    // There should jsut be 2 for here so not too much run time
    var profilePic = ""
    for(let i = 0; i<participantList.length; i++){
      if(participantList[i].id !== this.props.curId){
        profilePic = participantList[i].profile_picture
      }
    }

    return profilePic;

  }

  getChatUserId(participantList){
    // This function will show the correct userProfile that you are chatting
    // with

    // There should jsut be 2 for here so not too much run time
    var ids = []
    for(let i = 0; i<participantList.length; i++){
      if(participantList[i].id !== this.props.curId){
        ids.push(
            participantList[i].id
        )

      }
    }

    return ids;

  }

  getChatUserName(participantList){
    // This function will show the correct name of the user that you are chatting
    // with

    var name = ""
    for(let i = 0; i<participantList.length; i++){
      if(participantList[i].id !== this.props.curId){
        name = this.capitalize(participantList[i].first_name)+ ' '
        +this.capitalize(participantList[i].last_name)
      }
    }

    console.log(name)
    return name;

  }

  getMemberList(participantList){
    // This will get all the members that are not the current user
    var ids = []
    for(let i = 0; i<participantList.length; i++){
      if(participantList[i].id !== this.props.curId){
        ids.push(
            participantList[i]
        )

      }
    }

    return ids;
  }

  getGroupChatName(participantList){
    // This function will show the correct name of the group chats
    var names = ""
    let noCurUserList = []
    for(let i = 0; i < participantList.length; i++){
      console.log(participantList[i].first_name)
      if(participantList[i].id !== this.props.curId){
        const name = this.capitalize(participantList[i].first_name)+ ' '
        +this.capitalize(participantList[i].last_name)
        noCurUserList.push(name)
      }
    }

    if(noCurUserList.length <= 3){
      for (let i = 0; i < noCurUserList.length; i++){
        if(i === 0){
          names = names+noCurUserList[i]
        } else if(i === noCurUserList.length-1){
          if(noCurUserList.length === 2){
              names = names+" and "+noCurUserList[i]
          } else {
            names = names+" ,and "+noCurUserList[i]
          }
        } else {
          names = names + ", "+ noCurUserList[i]
        }

      }


    } else {
      for (let i = 0; i < 2; i++){
        if(i === 0){
          names = names+noCurUserList[i]
        } else {
          names = names + ", "+ noCurUserList[i]
        }

      }

      names = names +", and "+(noCurUserList.length-2)+ " others"

    }



    console.log(noCurUserList)


    return names;
  }

  onOpenEventModal = () => {
    this.setState({
      showShareEvent: true
    })
  }

  onCloseEventModal = () => {
    this.setState({
      showShareEvent: false
    })
  }

  submitShareEventConfig = (eventId, eventObj) => {

    const idList = this.getChatUserId(this.props.curChat.participants)
    this.props.submitShareEvent(eventId, idList, eventObj)
  }

  onProfileClick = (username) => {
    // This will redirec to the user profile page
    this.props.history.push("/explore/"+username)
  }


  render(){

    console.log(this.props)
    let profilePic = ""
    let partiLen = 0
    let chatUserName = ""
    let eventList = []
    let memberList = []
    if(this.props.curChat){
      if(this.props.curChat.participants){
        partiLen =this.props.curChat.participants.length
        memberList = this.getMemberList(this.props.curChat.participants)
        if(this.props.curChat.participants.length > 2){
          // This is for group chats
          chatUserName = this.getGroupChatName(this.props.curChat.participants)
        } else {
          profilePic = this.getChatUserProfile(this.props.curChat.participants)
          chatUserName = this.getChatUserName(this.props.curChat.participants)
        }
      }
    }

    if(this.props.eventList){
      eventList = this.props.eventList
    }


    return(
      <div className = "chatManagerContainer">
        {
          partiLen > 2 ?
          <div className = 'chatGroupBox'>
            <div className = "chatGroupAva">
            <i
            style = {{
              position: "relative",
              // left: "40%",
              // tranform: "translateX(-50%)"
            }}
            class="fas fa-user-friends"></i>
            </div>
            <div
            className = "chatName"
            >{chatUserName}</div>


          </div>

          :

          <div className = 'chatRightSideBox'>
          <Avatar
          size = {200}
          src = {"http://127.0.0.1:8000"+profilePic}
          />
          <div
          className= 'chatName'
          >{chatUserName}</div>
          </div>
        }

        <div className ="" >
        <Button
        onClick = {() => this.onOpenEventModal()}
        > Share Event </Button>
        </div>

        {
            partiLen > 2 ?
            <div className = "chatMemberList">
            <div className = "chatMemberText"> Group memebers </div>
            <List
                className = "groupMemberList"
               itemLayout="horizontal"
               dataSource={memberList}
               renderItem={item => (
                 <List.Item
                 onClick = {() => this.onProfileClick(item.username)}
                 >
                 <List.Item.Meta
                   avatar={<Avatar src= {'http://127.0.0.1:8000'+item.profile_picture} /> }
                   title={<span>{this.capitalize(item.first_name)} {this.capitalize(item.last_name)}</span>}
                   description= {<b>@{this.capitalize(item.username)}</b>}
                 />
                 </List.Item>
               )}
              />
            </div>

            :

            <div>
            </div>


        }

        <Modal
        visible = {this.state.showShareEvent}
        onCancel = {() => this.onCloseEventModal()}
        footer= {null}
        width = {800}
        >

        <CurChatEventList
        eventList = {eventList}
        submitShareEvent = {this.submitShareEventConfig}
        />

        </Modal>



      </div>
    )
  }
}

export default CurChatManager;
