import React from 'react';
import './EventPage.css';
import {Button, Progress, Avatar} from 'antd';
import {PictureOutlined} from '@ant-design/icons';
import ReduxEditEventForm from '../EditCalEventForms/ReduxEditEventForm';
import DetailEditEventForm from './DetailEditEventForm';
import * as dateFns from 'date-fns';


class EventInfo extends React.Component{

  constructor(props){
    super(props);


  }

  state = {
    edit: false
  }

  capitalize (str) {
    if(str){
        return str.charAt(0).toUpperCase() + str.slice(1)
    }

  }

  onEditClick = () => {
    // This will activate the edit so that you can start editing events
    this.setState({
      edit: true
    })
  }

  onCancelEventClick = () => {
    this.setState({
      edit: false
    })
  }

  timeConvertFunction = (time) => {
    // This fucntion will take in a 1-24 hour time
    // and then returna  1-12 am/pm time
    // This fucntion will take in the time as a string in the 1-24 hour
    // time format

    console.log(time)
    if (time !== null){
      let hour = time.substring(0, 2)
      let min = time.substring(3, 5)
      let final_time = ''
      if (hour > 12 ){
        hour = hour - 12
        if (hour < 10){
            final_time = "0"+hour + ':'+min+' PM'
        } else {
            final_time = hour + ':'+min+' PM'
        }
      } else if(hour <= 12 ){
        if (hour == 0){
          final_time = '12:' + min + ' AM'
        } else if (hour == 12) {
          final_time = '12:' + min + ' PM'
        } else {
          final_time = hour +':'+ min+' AM'
        }
      }
      console.log(final_time)
      // MIGHT HAVE TO TAKE INTO CONSIDERATION THE 12AM AND 12 PM
      return final_time
    }


  }


  getInitialValue = () => {
    // This will pull the information form the event info so that it can be
    // displayed on the event when you wanna edit it
    // This will be presented somewhat similar to the getInitialValue in the
    // EditEventPopUp
    console.log(this.props.info)
    if(this.props.info){
      const date_start = new Date(this.props.info.start_time)
      const date_end = new Date(this.props.info.end_time)
      const start_time = this.timeConvertFunction(this.props.info.start_time)
      const end_time = this.timeConvertFunction(this.props.info.end_time)


    }
  }

  render(){
    console.log(this.props.info)
    let username = ''
    let eventHostId = ''
    let title = ''
    let content = ''
    let start_time = ''
    let end_time = ''
    let color = ''
    let date = ''
    let location = ''
    let accepted = []
    let decline = []
    let invited = []
    let eventBackgroundPic = ""
    let month = "";
    let day = "";
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
        start_time = dateFns.format(new Date(this.props.info.start_time),'HH:mm aaaa')
        date = dateFns.format(new Date(this.props.info.start_time), 'iii, MMMM dd, yyyy ')
        console.log(dateFns.format(new Date(this.props.info.start_time), 'HH:mm'))
        month = dateFns.format(new Date(this.props.info.start_time), 'MMM')
        day = dateFns.format(new Date(this.props.info.start_time), 'dd')

      }
      if(this.props.info.end_time){
        end_time = dateFns.format(new Date(this.props.info.end_time), 'HH:mm aaaa')
      }
      if(this.props.info.color){
        color = this.props.info.color
      }
      if(this.props.info.location){
        location = this.props.info.location
      }
      if(this.props.info.accepted){
        accepted = this.props.info.accepted
      }
      if(this.props.info.decline){
        decline = this.props.info.decline
      }
      if(this.props.info.invited){
        invited = this.props.info.invited
      }
      if(this.props.info.host){
        host = this.props.info.host
      }

    }

    return(
      <div className = 'eventInfoContainer'>
      {
        this.state.edit ?
        <div>
        <DetailEditEventForm
        {...this.props}
        initialValue = {this.getInitialValue()}
         />

          <div>
          <Button
          onClick = {() => this.onCancelEventClick()}
          >
            Cancel
          </Button>
          </div>
        </div>
        :

        <div className = 'eventInfoView' >
          <div className = 'topSectContainier'>


            {
              eventBackgroundPic !== "" ?
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
              className = 'eventBackgroundPic'>
              <div className ="pictureFrame">
                <PictureOutlined />
                <br />
                <span> No background </span>
              </div>
              </div>

            }

            <div className = 'eventTopSide'>
            <div
            className = "dateCircle"
            style = {{
              backgroundColor: color
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
              <span> {this.capitalize(host.first_name)} {this.capitalize(host.last_name)} </span>
            </div>


            <div className = "invitedNum"> {invited.length} Invited </div>
            </div>





          </div>


          <div className = 'eventInfo'>

            <div className = "aboutEvent"> About the Event </div>

            {
              content === "" ?

              <div className = "contentEventEmpty"> No info... </div>
              :
              <div className = "contentEvent"> {content} </div>


            }

            <div className = "locationEventWord">Location</div>
            {
              location === "" ?
              <div className = "contentEventEmpty"> No info... </div>
              :
              <div> {this.capitalize(location)} </div>
            }


            <div className = "eventPeopleWord"> People </div>


          <div className =  "percentagesBars">

          <div className = "percentage">

          <Progress type = "circle" percent={Math.floor(100*(((accepted.length-1)+decline.length)/invited.length))} size="small" status="active" gap/>
          <div className = "percentageTerm"> Responded </div>
          </div>

          <div className = 'percentage'>
          <Progress
          type = "circle"
          status = "success"
          percent={Math.floor(100*((accepted.length-1)/(invited.length)))} size="small" />

          <div className = "percentageTerm"> Accepted </div>
          </div>

          <div className = "percentage">
          {
            (Math.floor(100*(decline.length/invited.length))<100)?

             <Progress
             status="exception"
             type = "circle" percent={Math.floor(100*(decline.length/invited.length))} size="small"/>
            :
            <Progress
            status="exception"
            type ="circle" percent={Math.floor(100*(decline.length/invited.length))} size="small" status="exception" />
          }

          <div className = "percentageTerm" > Declined </div>
          </div>



          </div>





          </div>
          <div className = 'editEventButtonContainer'>
          {
            eventHostId === this.props.userId ?

            <Button
            className = 'editEventButton'
            onClick= {() => this.onEditClick()}
            >
            Edit
            </Button>

            :

            <div></div>

          }

          </div>
        </div>


      }





      </div>

    )
  }
}

export default EventInfo;
