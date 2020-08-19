import React from 'react';
import { List, Avatar } from 'antd';
import './labelCSS/SocialModal.css';
import {ClockCircleOutlined } from '@ant-design/icons';
import * as dateFns from 'date-fns';
import clock from './images/clock.png';
import location from './images/pin.png';
import AvatarGroups from './AvatarGroups';
import userIcon from './images/user.png';


class SocialEventList extends React.Component{
  capitalize (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  timeFormater(date){
    // This will format the dates by the time only because the events will
    // pretty much follow the day

    const newDate = dateFns.format(new Date(date), 'hh:mmaaaaa')
    return newDate

  }

  render(){

    console.log(this.props)

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
            10 people
            <AvatarGroups />
            </span>

            <div className = 'joinEventButton'>
              <span className = 'joinText'> Join </span>
            </div>
            <div className = 'viewEventButton'>
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

export default SocialEventList;
