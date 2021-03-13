import React from 'react';
import * as dateFns from 'date-fns';
import { List, Avatar } from 'antd';
import {ClockCircleOutlined } from '@ant-design/icons';
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
    ExploreWebSocketInstance.sendSocialEventLeave(userId, eventId, socialCalCellId)
  }

  onCoverViewClick = (eventId) => {
    console.log(eventId)
    this.props.history.push("/socialcal/event/"+eventId)
  }

  eventTitleLength = (title) => {
    // this fucntion will shortend the title if it is too long

    let newTitle = title;
    if(title.length > 12){
      newTitle = newTitle.substring(0, 12)+'...'
    }

    return newTitle;
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
            className = 'coverCellBoxItem'>

              <div className = 'coverCellEventText'>

                <div className = 'coverCellTextSide'>
                  <div className = "coverCellEventTitle">
                    {this.eventTitleLength(this.capitalize(item.title))} </div>
                  <div className = 'coverCellEventTime'>
                    <div>
                      <i class="far fa-clock"></i>
                    </div>
                    <div className = 'timeNum'>
                      {this.timeFormater(item.start_time)}
                    </div>

                  </div>
                  <div className = 'coverCellEventNum'>
                    <div className = 'profileIcon'>
                      <div className = "centerBox">
                        <i class="far fa-user"></i>
                        &nbsp;&nbsp;
                        {item.persons.length}
                      </div>
                    </div>
                      <div className = 'likingCon'>
                        <div className = "centerBox">
                          <Liking
                            specifySize={17.5}
                             like_people ={item.persons} />
                        </div>
                      </div>
                  </div>
                </div>

                <div className = "coverCellEventRightSide">

                {dateFns.isAfter(dateFns.endOfDay(new Date(this.props.cellDay)), new Date())?
                  <div className = "miniEventButtonHolder">

                      <div className = "miniButtonHolderTop">
                        {
                          this.checkUser(item.persons) ?
                            item.host.id === this.props.curId ?
                            <div>
                          {/*=<div className = 'alreadyJoinButtonCoverHost'>
                            <div className = 'joinText'> Host </div>
                          </div>
                          */}
                          </div>

                          :

                          <div
                          onClick = {() => this.sendLeaveUserEvent(this.props.curId, item.id, this.props.cellId)}
                          className = 'alreadyJoinButtonCover'>
                          <div className = 'leaveText'> Leave </div>
                        </div>



                             :

                             <div
                             onClick = {()=> this.sendJoinUserEvent(this.props.curId, item.id, this.props.cellId)}
                             className = 'joinEventButtonCover'>
                               <div className = 'joinText'> Join </div>
                             </div>

                        }

                      </div>

                      <div className = "miniButtonHolderBottom">
                        <div
                        onClick = {() => this.onCoverViewClick(item.id)}
                        className = 'viewEventButtonCover'>
                          <div className = 'viewText'> View </div>
                        </div>
                      </div>

                </div>

                :

                <div
                onClick = {() => this.onCoverViewClick(item.id)}
                className = 'alreadyViewButtonCoverPass'>
                  <div className = 'viewText'> View </div>
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

export default SocialCellCoverEvents;
