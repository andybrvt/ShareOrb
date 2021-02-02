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

  eventTitle = (eventTitle) => {
    let name = eventTitle
    if(name.length > 20 ){
      name = name.substring(0,20) +"..."
    }

    return name
  }

  eventLocation = (eventTitle) => {
    let name = eventTitle
    if(name.length > 40 ){
      name = name.substring(0,40) +"..."
    }

    return name
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

           <div className = "socialEventListText">


             <div className = "socialEventListTextFirst">
               <div className = 'socialEventTitleContainer'>
               <div className = 'socialEventTitle'>
                 {this.eventTitle(this.capitalize(item.title))}
               </div>
               {
                 true ?

                 <div className = 'socialPublicTag'> Public </div>

                 :

                 <div className = 'socialPrivateTag'> Private </div>
               }
               </div>
             </div>


             <div className = 'socialEventListTextSecond'>
               <div className = 'socialEventLocation'>
                 <div className = "socialEventPin">
                   <i class="fas fa-map-marker-alt"></i>
                 </div>

                 <div className = "socialEventLocationText">
                   {this.eventLocation(this.capitalize(item.location))}
                 </div>

              </div>
             </div>


             <div className = "socialEventListTextThird">
               <div className = 'socialEventTime'>
                <div className = "socialEventClock">
                  <i class="fas fa-clock"></i>
                </div>

                <div className = "socialEventTimeText">
                  {this.timeFormater(item.start_time)}-
                  {this.timeFormater(item.end_time)}
                </div>

             </div>
             </div>

             <div className = 'socialEventListTextFourth'>
               <div className = 'socialEventCapcity'>
              <div className = "socialEventUserIcon">
                <div>
                  <i class="fas fa-user"></i>
                </div>

                <div className = "socialEventLikingNum">
                   {item.persons.length}
                </div>

              </div>

               <div className = "socialEventLiking">
               <Liking like_people = {item.persons} />
               </div>
             </div>
             </div>

           </div>


           <div className = 'socialEventListButtons'>
             <div className = 'socialListItemText'>



               {dateFns.isAfter(dateFns.endOfDay(dateFns.addHours(new Date(this.props.cellDate), 7)), new Date()) ?
                 <div className = "socialCurDayEventButton">

                    <div className = "curDayEventTop">
                      {
                        this.checkUser(item.persons) ?
                          item.host.id === this.props.curId ?
                          <div className = 'alreadyJoinButton'>
                          <div className = 'joinText'> Host </div>
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
                        <div className = 'joinText'> Leave </div>
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
                             <div className = 'joinText'> Join </div>
                           </div>

                      }

                    </div>


                    <div className = "curDayEventBottom">
                      <div
                      onClick = {() => this.viewSocialEventPage(item.id)}
                      className = 'viewEventButton'>
                        <div className = 'viewText'> View </div>
                      </div>
                    </div>


                 </div>


                 :

                 <div className = 'viewEventButtonPass'>

                 <div
                 onClick = {() => this.viewSocialEventPage(item.id)}
                 className = 'viewText'>View </div>
                 </div>

                }





             </div>
           </div>

         </List.Item>
       )}
     />
     </div>
    )
  }
}

export default SocialEventList;
