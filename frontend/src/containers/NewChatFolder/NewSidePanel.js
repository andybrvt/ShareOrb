import React from 'react';
import { List, Avatar } from 'antd';
import { NavLink } from 'react-router-dom';
import * as dateFns from 'date-fns';



class NewSidePanel extends React.Component{
  // This file will hold the side panel of the chats. It will include
  // a list of people that you are chatting with. It will also inlude a way
  // to make a new chat. and search for people
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
    return name;

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

  chatDescription (str, senderObj, recentTime){
    // This fucntion will take in a string and check how long it is, if it is
    // passed a certain lenght you would just put ... at the end of it
    let finalStr = str
    console.log(recentTime)
    if(str.length > 20){
      finalStr = finalStr.substring(0,20)
      finalStr = finalStr+"..."
    }
    if(senderObj.id === this.props.curId){
      // This is if you sent the message
      finalStr = "You: "+finalStr
    } else {
      finalStr = finalStr
    }

    const timeStamp = this.renderTimestamp(recentTime)
    finalStr = finalStr +" - "+timeStamp
    return this.capitalize(finalStr)
  }

  renderTimestamp = timestamp =>{
    console.log(timestamp)
    let prefix = '';
    console.log(new Date().getTime())
    console.log(new Date(timestamp).getTime())
    const timeDiff = Math.round((new Date().getTime() - new Date(timestamp).getTime())/60000)
    console.log(timeDiff)
    if (timeDiff < 1 ) {
      prefix = `now`;
    } else if (timeDiff < 60 && timeDiff >= 1 ) {
      prefix = `${timeDiff} min`;
    }else if (timeDiff < 24*60 && timeDiff > 60) {
      prefix = `${Math.round(timeDiff/60)}h`;
    } else if (timeDiff < 31*24*60 && timeDiff > 24*60) {
      prefix = `${Math.round(timeDiff/(60*24))}d`;
    } else {
        prefix = `${dateFns.format(new Date(timestamp), "MMMM d, yyyy")}`;
    }

    return prefix;
  }

  render(){

    console.log(this.props)

    let chatList = []
    let seenList = []

    if(this.props.chatList){
      chatList = this.props.chatList

    }

    return(
      <div className = "newSidePanel">
      <List
        locale={{emptyText:<span/>}}
        itemLayout="horizontal"
        dataSource={chatList}
        renderItem={item => (

          item.participants.length === 2 ?
          <NavLink
          to = {''+item.id}
          >
          <List.Item className = {`chatItem ${item.id === parseInt(this.props.param.id) ? "current": ""}`}>
            <div className = "chatWrap">

            <div className="chatAva">
              <div class="centerChatItem">
              <Avatar size = {40}
               src = {`${global.IMAGE_ENDPOINT}`+this.getChatUserProfile(item.participants)} />
             </div>
            </div>
           <div className = "centerChatWrapContent">

             <div class="centerChatItem">
              <div class="chatHeader">
                <div className = "chatName">
                  {this.getChatUserName(item.participants)}
                </div>
                <div class="chaHeaderUserName">
                  {"@"+item.participants[1].username}
                </div>
              </div>
              <div className = {`chatDescription ${item.seen.includes(this.props.username) ? "" : "active"}`}>
                  <b>
                    {this.chatDescription(item.recentMessage,
                      item.recentSender,
                      item.recentTime
                    )}
                  </b>
              </div>
            </div>
          </div>


            </div>
          </List.Item>
          </NavLink>

          :

          <NavLink
          to = {''+item.id}
          >
          {/*This is for the group chats*/}
          <List.Item className = {`chatItem ${item.id === parseInt(this.props.param.id) ? "current": ""}`}>
            <div className = "chatWrap">
              <div className = "chatGroupAva">
              <i
              style = {{
                position: "relative",
                // left: "40%",
                // tranform: "translateX(-50%)"
              }}
              class="fas fa-user-friends"></i>
              </div>

              <div className = "chatText">
              <div className = "chatName">{this.getGroupChatName(item.participants)}</div>
              <div className = {`chatDescription ${item.seen.includes(this.props.username) ? "" : "active"}`}>
                <b>
                  {this.chatDescription(item.recentMessage,
                  item.recentSender,
                  item.recentTime
                  )}
                </b>

            </div>
            </div>

            </div>
          </List.Item>
          </NavLink>

        )}
      />
      </div>
    )

  }
}

export default NewSidePanel;
