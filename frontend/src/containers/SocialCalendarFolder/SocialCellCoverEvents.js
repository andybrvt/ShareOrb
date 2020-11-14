import React from 'react';
import * as dateFns from 'date-fns';
import { List, Avatar } from 'antd';
import {ClockCircleOutlined } from '@ant-design/icons';
import clock from '../../components/images/clock.png';
import location from '../../components/images/pin.png';
import AvatarGroups from '../../components/AvatarGroups';
import userIcon from '../../components/images/user.png';
import ExploreWebSocketInstance from '../../exploreWebsocket';
import './SocialCalCSS/SocialCal.css';
import Liking from "../NewsfeedItems/Liking";


class SocialCellCoverEvents extends React.Component{
  // This will be the smaller events that are shown social cal if there are only
  // events

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

  sendJoinUserEvent = (userId, eventId, socialCalCellId )=> {
    // This will be used to send the userId and the event Id to the websocket
    console.log(userId, eventId)

    ExploreWebSocketInstance.sendSocialEventParticipate(userId, eventId, socialCalCellId)
  }


  sendLeaveUserEvent = (userId, eventId, socialCalCellId) => {
    // This willb e sued to sne dthe useId and the eventid to the websocket
    // so that you can remove some from an event because they want to leave

    console.log(userId, eventId)
    // ExploreWebSocketInstance.sendSocialEventLeave(userId, eventId, socialCalCellId)
  }

  onCoverViewClick = (eventId) => {
    console.log(eventId)
    this.props.history.push("/socialcal/event/"+eventId)
  }


  render() {
    console.log(this.props)
    console.log(new Date(this.props.cellDay))
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

        <div className = 'coverCellBox'>
        <List
          itemLayout="horizontal"
          dataSource={this.props.events}
          className = 'coverCellBoxList'
          renderItem={item => (
            <List.Item
            className = 'coverCellBoxItem'
            >
              <div className = 'coverCellEventText'>
                <span> {this.capitalize(item.title)} </span>
                <span className = 'socialEventTime'>
                <br />
                <img src = {clock} className = 'socialEventClock' />
                {this.timeFormater(item.start_time)}-
                {this.timeFormater(item.end_time)}
                </span>
                <br />
                <div className = 'coverEventCapacity'>
                <div className = 'coverEventNumber'>
                <img src ={userIcon} className = 'socialUserIcon' />
                {item.persons.length}
                </div>
                  <div className = 'avatarContainer'>
                  <Liking like_people ={item.persons} />
                  </div>
                </div>

                {dateFns.isAfter(dateFns.endOfDay(new Date(this.props.cellDay)), new Date())?
                  <div>
                  {
                    this.checkUser(item.persons) ?
                      item.host.id === this.props.curId ?
                    <div className = 'alreadyJoinButtonCoverHost'>
                      <span className = 'joinText'> Host </span>
                    </div>

                    :

                    <div
                    onClick = {() => this.sendLeaveUserEvent(this.props.curId, item.id, this.props.cellId)}
                    className = 'alreadyJoinButtonCover'>
                    <span className = 'leaveText'> Leave </span>
                  </div>



                       :

                       <div
                       onClick = {()=> this.sendJoinUserEvent(this.props.curId, item.id, this.props.cellId)}
                       className = 'joinEventButtonCover'>
                         <span className = 'joinText'> Join </span>
                       </div>

                  }




                  <div
                  onClick = {() => this.onCoverViewClick(item.id)}
                  className = 'viewEventButtonCover'>
                    <span className = 'viewText'> View </span>
                  </div>
                </div>

                :

                <div
                onClick = {() => this.onCoverViewClick(item.id)}
                className = 'alreadyViewButtonCoverPass'>
                  <span className = 'viewText'> View </span>
                </div>


                }




              </div>

            </List.Item>
          )}
        />
        </div>

    )
  }
}

export default SocialCellCoverEvents;
