import React from 'react';
import './UserEventList.css';
import {PictureOutlined } from '@ant-design/icons';
import * as dateFns from 'date-fns';



class UserEventList extends React.Component{

  capitalize (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  dateView(date) {
    // This will be presenting the calendar day on the modal
    // console.log(dateFns.format(new Date(date), ''))
    console.log(date)
    let month = ''
    // let day = ''
    if (date !== ''){
      month = dateFns.format(new Date(date), 'MMM d, yyyy')
    }

    // console.log(month)
    return (

      month


    )

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



  renderEventCells = () => {
    console.log(this.props)

    let socialEventList = []
    if(this.props.events){
      socialEventList = this.props.events
    }

    if(socialEventList.length !== 0){
      var boxes = []
      for(let i = 0; i< socialEventList.length; i++){
        boxes.push(
          <div className = "eventContainer">
          {
            socialEventList[i].backgroundImg === null ?
            <div className = 'noPicBox'>
            <PictureOutlined />
            <br />
              <span className = 'noPicWords'> No picture </span>
            </div>
            :
            <div className = 'picBox'>
              <img
              className = "picBoxPic"
              src = {'http://127.0.0.1:8000'+socialEventList[i].backgroundImg} />
            </div>
          }

          <div className = "eventBoxTitle">{this.capitalize(socialEventList[i].title)}</div>
          <div className = "eventBoxContent">Content: {socialEventList[i].content} </div>
          <div className = "eventBoxLocation">
          <i class="fas fa-map-marker-alt"></i> {socialEventList[i].location}</div>
          <div className = "eventBoxDay">
          <i class="far fa-calendar"></i> {this.dateView(socialEventList[i].event_day)}
          </div>
          <div className = "eventBoxTimes"><i class="far fa-clock"></i> {this.timeFormater(socialEventList[i].start_time)} - {this.timeFormater(socialEventList[i].end_time)}</div>

          <div className = "eventBoxHost "> Host: {socialEventList[i].host.username}</div>

          </div>
        )
      }


      return <div className = "eventListContainer"> {boxes} </div>
    } else {
      return <div> No Events </div>
    }
  }


  render(){
    console.log(this.props)
    return (
      <div className = "eventListTabContainer">

        {this.renderEventCells()}

      </div>
    )
  }
}

export default UserEventList;
