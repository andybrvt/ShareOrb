import React from 'react';
import { List, Avatar } from 'antd';
import './labelCSS/SocialModal.css';
import {ClockCircleOutlined } from '@ant-design/icons';
import * as dateFns from 'date-fns';
import clock from './images/clock.png';
import location from './images/pin.png'


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
          <div className = ''>
          <span className = 'socialEventTitle'>{this.capitalize(item.title)} </span>
          <br />
          <span className = 'socialEventTime'>
          <img src = {clock} className = 'socialEventClock' />
          {this.timeFormater(item.start_time)}-
          {this.timeFormater(item.end_time)}
          </span>
          <span className = 'socialEventLocation'>
          <img src = {location} className = 'socialEventPin' />
          {this.capitalize(item.location)}
          </span>
          </div>
         </List.Item>
       )}
     />
     </div>
    )
  }
}

export default SocialEventList;
