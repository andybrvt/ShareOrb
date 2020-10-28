import React from 'react';
import {Button, Progress, Avatar, Modal, message, notification} from 'antd';
import * as dateFns from 'date-fns';
import EditSocialEventForm from './EditSocialEventForm';
import {PictureOutlined} from '@ant-design/icons';


class SocialEventInfo extends React.Component{

  constructor(props){
    super(props);
  }

  state = {
    edit: false,
    changeBackgroundView: false
  }

  capitalize (str) {
    if(str){
        return str.charAt(0).toUpperCase() + str.slice(1)
    }

  }

  onChangeBackgroundOpen = () => {
    // This is to open the modal for changing the background picture
    console.log('open')
  }

  onChangeBackgroundClose = () => {
    // This is to close the modal for changing the background picture
    console.log('close')
  }

  onEditClick = () => {
    // This will show the function to edit events
    this.setState({
      edit: true
    })
  }

  onCancelEventClick = () => {
    this.setState({
      edit: false
    })
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

  getInitialValue = () => {
    //This will be passed into
    if(this.props.info){
      let title = "";
      let content = "";
      const start_time = this.timeFormater(this.props.info.start_time)
      const end_time = this.timeFormater(this.props.info.end_time)
      if(this.props.info.title){
        title = this.props.info.title
      }

      if(this.props.info.content){
        content = this.props.info.content
      }


      return {
        title: this.capitalize(title),
        content: this.capitalize(content),
        startTime: start_time,
        endTime: end_time,
        location: this.props.info.location,
      }

    }


  }


  render() {
    console.log(this.props)

    let username = ''
    let eventHostId = ''

    let title = '';
    let content = '';
    let date = ''
    let start_time = ''
    let end_time = ''
    let eventBackgroundPic = "";
    let location = '';
    let month = "";
    let day = "";
    let persons = [];
    let host = "";

    if(this.props.info){
      if(this.props.info.host){
        username = this.props.info.host.username
        eventHostId = this.props.info.host.id
      }
      if(this.props.info.title){
        title = this.props.info.title
      }
      if(this.props.info.content){
        content = this.props.info.content
      }
      if(this.props.info.start_time){
        console.log(dateFns.addHours(new Date(this.props.info.event_day), 7))
        start_time = this.timeFormater(this.props.info.start_time)
        date = dateFns.format(dateFns.addHours(new Date(this.props.info.event_day), 7), 'iii, MMMM dd, yyyy ')
        // console.log(dateFns.format(new Date(this.props.info.start_time), 'HH:mm'))
        month = dateFns.format(dateFns.addHours(new Date(this.props.info.event_day), 7), 'MMM')
        day = dateFns.format(dateFns.addHours(new Date(this.props.info.event_day),7), 'dd')
      }

      if(this.props.info.end_time){
        end_time = this.timeFormater(this.props.info.end_time)
      }

      if(this.props.info.location){
        location = this.props.info.location
      }
      if(this.props.info.host){
        host = this.props.info.host
      }
      if(this.props.info.backgroundImg){
        eventBackgroundPic = this.props.info.backgroundImg

      }
      if(this.props.info.persons){
        persons = this.props.info.persons
      }

    }

    return (
      <div className = "socialEventInfoContainer">

      {
        this.state.edit ?

        <div>
        <EditSocialEventForm
        {...this.props}
        initialValues = {this.getInitialValue()}
         />


        <div
        className = "editEventBackButtonContainer "
        onClick = {() => this.onCancelEventClick()}>

        <i class="fas fa-arrow-left"></i>

        </div>
        </div>

        :

        <div className = "eventInfoView">

        <div className = "topSectContainier">

          {
            eventBackgroundPic === "" ?
            <div
            className = 'eventBackgroundPic'>
            <div className = "pictureFrame">
                <PictureOutlined />
                <br />
                <span> No background </span>
            </div>
            </div>

            :

            <div
            className = 'eventBackgroundWPic'>
            {/*
              <div className ="pictureFrame">

              <PictureOutlined />
              <br />
              <span> No background </span>
                </div>
              */}
              <img
              src = {'http://127.0.0.1:8000'+eventBackgroundPic}
              className = 'eventBackgroundImg'
               />
            </div>


          }

          <div className = "eventTopSide">
            <div
              className = "dateCircle"
              style = {{
                backgroundColor: "blue"
              }}
            >
            <div
            style = {{
              color: "white",
              fontSize: "20px"
            }}
            clasName = "month" > {month}</div>
            <div className = "day"> {day} </div>
            </div>

            <div className = 'eventTitle'> {this.capitalize(title)} </div>
            <div className = "eventDate"> {date} </div>
            <div className = "eventTime">{start_time}-{end_time}</div>

            <div className = "eventHost">
              <Avatar
              src = {"http://127.0.0.1:8000"+host.profile_picture}
              />
              <span> {this.capitalize(host.first_name)} {this.capitalize(host.last_name)}</span>
            </div>

            <div className = "invitedNum"> {persons.length} Going </div>

          </div>

          </div>

          <div className = "eventInfo">
            <div className = "aboutEvent"> About the Event </div>
            {
              content === "" ?

              <div className = "contentEventEmpty"> No info... </div>
              :
              <div className = "contentEvent"> {content} </div>


            }

            <div className = "locationEventWord"> Location</div>
            {
              location === "" ?
              <div className = "contentEventEmpty"> No info... </div>
              :
              <div> {this.capitalize(location)} </div>
            }

            <div className = "eventPeopleWord"> People </div>


            <div className = 'editEventButtonContainer'>
            {
              eventHostId === this.props.userId ?

              <div
              className = 'editEventButton'
              // onClick= {() => this.onEditClick()} /
              >
              <div
              onClick = {() => this.onChangeBackgroundOpen()}
              >
              <i class="far fa-image"></i>
              <div style = {{fontSize: "8px", marginBottom: "20px"}}>
              Change Background
              </div>
              </div>


              <div
              onClick={() => this.onEditClick()}
              >
              <i class="fas fa-pen" ></i>
              <div style = {{fontSize: "15px"}}>
              Edit Event
              </div>
              </div>

              <div>
              <i class="fas fa-chevron-down"></i>
              </div>
              </div>

              :

              <div></div>

            }

            </div>

          </div>

        </div>

      }






      </div>

    )
  }

}

export default SocialEventInfo;
