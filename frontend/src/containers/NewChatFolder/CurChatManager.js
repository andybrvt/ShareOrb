import React from 'react';
import { Avatar, Button, Modal, List, Divider } from 'antd';
import CurChatEventList from './ChatManagerFolder/CurChatEventList';
import {CalendarOutlined} from '@ant-design/icons';
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

  getChatUserUsername(participantList){
    // This function will show the correct userProfile that you are chatting
    // with

    // There should jsut be 2 for here so not too much run time
    var names = []
    for(let i = 0; i<participantList.length; i++){
      if(participantList[i].id !== this.props.curId){
        names.push(
            participantList[i].username
        )

      }
    }

    return names;

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
            names = names+" , and "+noCurUserList[i]
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

  submitCreateEventConfig = (eventObj) => {
    const idList = this.getChatUserId(this.props.curChat.participants)
    this.props.submitCreateEvent(eventObj, idList)
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
    let usernameList = []
    if(this.props.curChat){
      if(this.props.curChat.participants){
        partiLen =this.props.curChat.participants.length
        memberList = this.getMemberList(this.props.curChat.participants)
        usernameList = this.getChatUserUsername(this.props.curChat.participants)
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
            size = {150}
            src = {`${global.IMAGE_ENDPOINT}`+profilePic}
            />

            <div
            className= 'mainChatUserName'
            >{chatUserName}</div>
          </div>

        }
        <Divider/>

        <div className ="" style={{marginTop:'40px'}} >

        <Button type="primary" shape="round" size="large"

          onClick = {() => this.onOpenEventModal()}
        >  Share Events </Button>

        </div>

        {
            partiLen > 2 ?
            <div className = "chatMemberList">
            <div className = "chatMemberText"> Group members </div>
            <List
                className = "groupMemberList"
               itemLayout="horizontal"
               dataSource={memberList}
               renderItem={item => (
                 <List.Item

                 onClick = {() => this.onProfileClick(item.username)}
                 >
                 <List.Item.Meta
                   avatar={<Avatar
                     src= {`${global.IMAGE_ENDPOINT}`+item.profile_picture} /> }
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
          centered
        visible = {this.state.showShareEvent}
        onCancel = {() => this.onCloseEventModal()}
        bodyStyle={{padding:'50px', height:'550px'}}
        footer= {null}
        width = {1050}
        >

        <CurChatEventList
        eventList = {eventList}
        submitShareEvent = {this.submitShareEventConfig}
        submitCreateEvent = {this.submitCreateEventConfig}
        memberList = {this.props.curChat.participants}
        usernameList = {usernameList}
        />

        </Modal>



      </div>
    )
  }
}

export default CurChatManager;
