import React from 'react';
import {Button, Progress, Avatar, Modal, message, notification} from 'antd';
import * as dateFns from 'date-fns';
import EditSocialEventForm from './EditSocialEventForm';
import {PictureOutlined} from '@ant-design/icons';
import SocialEventPageWebSocketInstance from '../../../socialEventPageWebsocket';
import ChangeBackgroundModal from '../../PersonalCalendar/EventPage/ChangeBackgroundModal';
import { authAxios } from '../../../components/util';
import * as socialActions from '../../../store/actions/socialCalendar';
import { connect } from "react-redux";
import DeleteSocialEventModal from './DeleteSocialEventModal';


class SocialEventInfo extends React.Component{

  constructor(props){
    super(props);
  }

  state = {
    edit: false,
    changeBackgroundView: false,
    showDeleteModal: false,
  }

  capitalize (str) {
    if(str){
        return str.charAt(0).toUpperCase() + str.slice(1)
    }

  }

  onChangeBackgroundOpen = () => {
    // This is to open the modal for changing the background picture
    console.log('open')
    this.setState({
      changeBackgroundView: true
    })
  }

  onChangeBackgroundClose = () => {
    // This is to close the modal for changing the background picture
    this.setState({
      changeBackgroundView: false
    })
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

  onSaveEdit = (values) => {
    // Social event is never gonna be a unshare event becuaes it social so its
    // doesn't have to deal with the single or shared event-

    // This function will be called when you want to save the newly edited event
    // within the EditSocialEventForm
    // The form is gonna take input information and then that information is gonna
    // get passed into this funciton. AFterwards it will be sent thorugh the soicaleventWebsocket
    // then it will go into the back end and change the exisitng event object then
    // sent through the channels
    console.log(values)
    const start_time = values.startTime
    const end_time = values.endTime
    const event_day = this.props.info.event_day

    let content = ""
    let location = ""
    // Reason for having these lets is because title and content are not required and
    // could be empty at times
    if(values.content){
      content = values.content
    }
    if(values.location){
      location = values.location
    }

    const editSocialEventObj = {
      eventId: this.props.info.id,
      title: values.title,
      content: content,
      location: location,
      start_time: start_time,
      end_time: end_time,
      event_day:event_day

    }

    SocialEventPageWebSocketInstance.sendEditSocialEvent(editSocialEventObj)

  }

  handleBackgroundPictureChange = value => {
    // This is responsible for changing the background picture fo the events
    // Unlike the eventPage, this one will alwasy be shared among all the members but since
    // the picture change will happen when people log back in it will be change
    // so no need to put channels on it

    console.log(value)
    const eventId = this.props.info.id
    var data = new FormData();

    data.append("backgroundImg", value)
    authAxios.put('http://127.0.0.1:8000/mySocialCal/socialEvent/updatebackground/'+eventId,
    data
  ).then(res => {
    // Now you will run the redux to replace the picture
    console.log(res.data)
    this.props.updateSocialEventBackground(res.data.backgroundImg.substring(21,))

  })

  }

  onDeleteSocialEvent = () =>{
    console.log(this.props.info.id)

    // This sendSocialEventDelete will send notifications of whoever is still in the
    // event room that the event has been delete so refresh... nothign you do matters
    SocialEventPageWebSocketInstance.sendSocialEventDelete(this.props.info.id)

    // authAxios.delete('http://127.0.0.1:8000/mySocialCal/socialEvent/delete/'+this.props.info.id)
    if(this.props.history){
      this.props.history.push('/current-user/')
    }
    this.setState({
      showDeleteModal: false,
    })
  }


  onOpenDeleteSocialModal = () => {
    this.setState({
      showDeleteModal: true
    })
  }

  onCloseDeleteSocialModal = () => {
    // This is to close teh dletesocialmodal
    this.setState({
      showDeleteModal: false
    })
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
      <div className = {`socialEventInfoContainerContainer ${this.props.active ? "" : "active"}` }>
      <div className = "socialEventInfoContainer" >

      {
        this.state.edit ?

        <div>
        <EditSocialEventForm
        {...this.props}
        initialValues = {this.getInitialValue()}
        onSubmit = {this.onSaveEdit}
        onDelete = {this.onOpenDeleteSocialModal}
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




      <ChangeBackgroundModal
      visible = {this.state.changeBackgroundView}
      close = {this.onChangeBackgroundClose}
      onSubmit = {this.handleBackgroundPictureChange}
      />

      <DeleteSocialEventModal
      visible = {this.state.showDeleteModal}
      onCancel = {this.onCloseDeleteSocialModal}
      eventId = {this.props.info.id}
      onDelete = {this.onDeleteSocialEvent}
      />


      </div>

    </div>
    )
  }

}


const mapDispatchToProps = dispatch => {
  return {
    updateSocialEventBackground: backgroundPic => dispatch(socialActions.updateSocialEventBackground(backgroundPic)),
  }
}

export default connect(null, mapDispatchToProps)(SocialEventInfo);
