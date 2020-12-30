import React from 'react';
import { List, Avatar, Input, Divider } from 'antd';
import * as dateFns from 'date-fns';
import './ChatManager.css'
import userIcon from '../../../components/images/user.png';
import CreateShareEventChat from './CreateShareEventChat';

// This will be used to display the list and search of the events
// that you can share with the person that you are chatting with

class CurChatEventList extends React.Component{
  capitalize (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }


  getMemberIds = (memberList) => {
    // This function will turn the list into a list of ids
    let idList = []

    for(let i = 0; i< memberList.length; i++){
      idList.push(memberList[i].id)
    }

    return idList;
  }

  sharedMemberEvent = (participants) => {
    // This function is to see if the event is shared among all the participants
    // yet. return true if everyone in the chat is in the event
    // return false if

    console.log(participants)

    const memberListId = this.getMemberIds(this.props.memberList)
    const eventPartiId = participants

    console.log(memberListId, eventPartiId)
    for(let i = 0; i<memberListId.length; i++){
      if(!eventPartiId.includes(memberListId[i])){
        return false
      }
    }

    return true
  }


  handleCreateEvent = (eventObj) => {


    this.props.submitCreateEvent(eventObj)
  }



  render(){
    console.log(this.props)


    let eventList = []
    if(this.props.eventList){
      eventList = this.props.eventList
    }
    console.log(eventList)
      return(
        <div className = "chatEventShare">

        <div className = "chatEventShareLeft">
          <div className = "searchChatContainer">
            <form className = "searchForm">
              <Input
              placeHolder = "Search Events"
              className = "input"
               />
            </form>
          </div>

          <div className = "eventListContainer">
          <List
             itemLayout="horizontal"
             dataSource={eventList}
             renderItem={item => (
               <div
               style = {{
                 backgroundColor: item.color
               }}
               className = "chatEvent">

                <div className = "title">
                  {item.title}
                </div>

                <div className ="infoBox">
                  <div>
                    <div className = "date">
                      <i class="far fa-calendar"></i>
                      <span className = "text"> {dateFns.format(new Date(item.start_time), "MMM dd, yyyy")} </span>
                    </div>
                    <div className = "times">
                      <i class="far fa-clock"></i>
                      <span className = "text">{dateFns.format(new Date(item.start_time),'h:mm a')}-{dateFns.format(new Date(item.end_time),'h:mm a')}</span>
                    </div>
                  </div>
                    <div className = "numPeople">
                      <i class="far fa-user"></i>
                      <span className = "text">{item.person.length}</span>
                    </div>
                </div>
                {
                  this.sharedMemberEvent(item.person) ?

                  <div
                  className = "alreadyShareEventButton"
                  >
                  <i class="far fa-check-circle"></i>

                  </div>

                  :

                  <div
                  onClick = {() => {this.props.submitShareEvent(item.id, item)}}
                  className = "shareEventButton">
                    <i class="fas fa-user-plus"></i>
                  </div>

                }


               </div>



             )}
            />
            </div>
          </div>


          <Divider
          style = {{
            height: "500px",
            color: "black",

            marginLeft:"50px",
          }}
          type = "vertical"  />


          <div
          className = "chatEventButton"
          >
            <CreateShareEventChat
            submitCreateEvent = {this.handleCreateEvent}
            usernameList = {this.props.usernameList}
            />
          </div>

        </div>
      )
    }
  }

export default CurChatEventList;
