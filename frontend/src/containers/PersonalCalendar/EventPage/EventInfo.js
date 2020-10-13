import React from 'react';
import './EventPage.css';
import {Button} from 'antd';
import ReduxEditEventForm from '../EditCalEventForms/ReduxEditEventForm';
import * as dateFns from 'date-fns';


class EventInfo extends React.Component{

  constructor(props){
    super(props);


  }

  state = {
    edit: false
  }

  capitalize (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
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
    if(this.props.info){
      const date_start = new Date(this.props.info.start_time)

      const date_end = new Date(this.props.info.end_time)





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

    }

    return(
      <div className = 'eventInfoContainer'>
      {
        this.state.edit ?
        <div>
        <ReduxEditEventForm />

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


            <div
            style = {{
              backgroundColor: color
            }}
            className = 'eventBackgroundPic'>
            stuff here
            </div>

            <div className = 'eventTopSide'>
            Some container here
            </div>

          </div>


          <div className = 'eventInfo'>
            <div className = 'title'> {this.capitalize(title)} </div>

            <div> About the Event </div>
            <div> {content} </div>
            <div> {date} </div>
            <div>{start_time}-{end_time}</div>
            <div>Location</div>
            <div> {this.capitalize(location)} </div>
            <div> People </div>

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
