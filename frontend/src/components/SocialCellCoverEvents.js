import React from 'react';
import { List, Avatar } from 'antd';
import '../containers/Container_CSS/SocialCal.css';
import {ClockCircleOutlined } from '@ant-design/icons';
import * as dateFns from 'date-fns';
import clock from './images/clock.png';
import location from './images/pin.png';
import AvatarGroups from './AvatarGroups';
import userIcon from './images/user.png';
import ExploreWebSocketInstance from '../../src/exploreWebsocket';

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

  render() {
    console.log(this.props)
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
              <div>
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
                  <AvatarGroups />
                  </div>
                </div>

                {
                  this.checkUser(item.persons) ?
                    item.host.id === this.props.curId ?
                  <div className = 'alreadyJoinButtonCover'>
                    <span className = 'joinText'> Host </span>
                  </div>

                  :

                  <div className = ''>
                  <span className = 'joinText'> Leave </span>
                </div>



                     :

                     <div
                     onClick = {()=> this.sendJoinUserEvent(this.props.curId, item.id, this.props.socialCalCellId)}
                     className = ''>
                       <span className = 'joinText'> Join </span>
                     </div>

                }




                <div className = 'viewEventButtonCover'>
                  <span className = 'viewText'> View </span>
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
