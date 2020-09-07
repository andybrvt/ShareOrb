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
            <List.Item>
              <div>
                <span> {this.capitalize(item.title)} </span>
                <span className = 'socialEventTime'>
                <br />
                <img src = {clock} className = 'socialEventClock' />
                {this.timeFormater(item.start_time)}-
                {this.timeFormater(item.end_time)}
                </span>
                <br />
                <span className = 'socialEventCapcity'>
                <img src ={userIcon} className = 'socialUserIcon' />
                {item.persons.length}
                <AvatarGroups />
                </span>
              </div>
            </List.Item>
          )}
        />
        </div>

    )
  }
}

export default SocialCellCoverEvents;
