import React from 'react';
import * as dateFns from 'date-fns';
import { List, Avatar } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import clock from '../../components/images/clock.png';
import location from '../../components/images/pin.png';
import AvatarGroups from '../../components/AvatarGroups';
import userIcon from '../../components/images/user.png';
import ExploreWebSocketInstance from '../../exploreWebsocket';
import SocialCalCellPageWebSocketInstance from '../../socialCalCellWebsocket';
import './SocialCalCSS/SocialCellPage.css';
import Liking from "../NewsfeedItems/Liking";



class SocialEventList extends React.Component{
  capitalize (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  timeFormater(time){
    // This will change the format of the time properly to the 1-12 hour
    console.log(time)
    const timeList = time.split(':')
    let hour = parseInt(timeList[0])
    let minutes = timeList[1]
    var suffix  = hour >= 12 ? "PM":"AM"

    console.log(11%12)
    hour = ((hour+11)%12+1)+':'+minutes+" "+ suffix
    return hour

  }

  checkUser = (personList) => {
    // This will check if a users exist in a list and will return true or false
    // The personList is a list of dictionary of users
    let personListId = []
    for (let i = 0; i<personList.length; i++){
      const userId = personList[i].id
      personListId.push(userId)
    }

    return personListId.includes(this.props.curId)
  }

  sendJoinUserEvent = (userId, eventId , socialCalCellId, cellDate)=> {
    // This will be used to send the userId and the event Id to the websocket
    console.log(userId, eventId, socialCalCellId)
    SocialCalCellPageWebSocketInstance.sendSocialEventJoin(userId, eventId, socialCalCellId, cellDate)
  }

  sendLeaveUserEvent = (userId, eventId, socialCalCellId, cellDate) => {
    // This willb e sued to sne dthe useId and the eventid to the websocket
    // so that you can remove some from an event because they want to leave

    console.log(userId, eventId)
    SocialCalCellPageWebSocketInstance.sendSocialEventLeave(userId, eventId, socialCalCellId, cellDate)
  }

  viewSocialEventPage = (eventId) => {
    console.log(eventId)
    this.props.history.push("/socialcal/event/"+eventId)
  }


  render(){

    console.log(this.props)
    // For events I don't think we will be needing channels because, when we move
    // between profiles and newsfeed, it kinda refershs each time so the events
    // just shows up, so for the evnets you can just make it and sent it to the redux
    // and maybe you don't need channels for when you post events... maybe notificaitons are
    // sent when you make an event --> this will direct the user to the event page
    console.log(dateFns.addHours(new Date(this.props.cellDate), 7))

    let itemList = []
    if(this.props.items !== []){
      itemList = this.props.items
    }

    console.log(itemList)

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


    return (
      <div className = 'socialListBox' >
      <List
       itemLayout="horizontal"
       dataSource={itemList}
       renderItem={item => (
         <List.Item className = 'socialListItem'>

           {/*
             <div className = 'socialListItemText'>

               <div className = 'socialEventTitleContainer'>
               <span className = 'socialEventTitle'>{this.capitalize(item.title)} </span>
               {
                 true ?

                 <div className = 'socialPublicTag'> Public </div>

                 :

                 <div className = 'socialPrivateTag'> Private </div>
               }
               </div>

               <span className = 'socialEventTime'>
               <img src = {clock} className = 'socialEventClock' />
               {this.timeFormater(item.start_time)}-
               {this.timeFormater(item.end_time)}
               </span>

               <span className = 'socialEventLocation'>
               <img src = {location} className = 'socialEventPin' />
               {this.capitalize(item.location)}
               </span>

               <br />

               <span className = 'socialEventCapcity'>
               <img src ={userIcon} className = 'socialUserIcon' />
               {item.persons.length}
               <div>
               <Liking like_people = {item.persons} />
               </div>
               </span>

               {dateFns.isAfter(dateFns.endOfDay(dateFns.addHours(new Date(this.props.cellDate), 7)), new Date()) ?
                 <div>
                 {
                   this.checkUser(item.persons) ?
                     item.host.id === this.props.curId ?
                     <div className = 'alreadyJoinButton'>
                     <span className = 'joinText'> Host </span>
                   </div>

                   :

                   <div
                   onClick = {() => this.sendLeaveUserEvent(
                     this.props.curId,
                     item.id,
                     this.props.socialCalCellId,
                     this.props.cellDate
                   )}
                   className = 'alreadyJoinButton'>
                   <span className = 'joinText'> Leave </span>
                 </div>



                      :

                      <div
                      onClick = {()=> this.sendJoinUserEvent(
                        this.props.curId,
                        item.id,
                        this.props.socialCalCellId,
                        this.props.cellDate
                      )}
                      className = 'joinEventButton'>
                        <span className = 'joinText'> Join </span>
                      </div>

                 }




                 <div
                 onClick = {() => this.viewSocialEventPage(item.id)}
                 className = 'viewEventButton'>
                   <span className = 'viewText'> View </span>
                 </div>

                 </div>


                 :

                 <div className = 'viewEventButtonPass'>

                 <span
                 onClick = {() => this.viewSocialEventPage(item.id)}
                 className = 'viewText'>View </span>
                 </div>

                }





             </div>
             */}

         </List.Item>
       )}
     />
     </div>
    )
  }
}

export default SocialEventList;
