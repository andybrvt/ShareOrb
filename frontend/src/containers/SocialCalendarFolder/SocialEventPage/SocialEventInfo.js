import React from 'react';
import {Button, Progress, Avatar, Modal, message, notification, Divider, Statistic} from 'antd';
import * as dateFns from 'date-fns';
import EditSocialEventForm from './EditSocialEventForm';
import {PictureOutlined} from '@ant-design/icons';
import SocialEventPageWebSocketInstance from '../../../socialEventPageWebsocket';
import ChangeBackgroundModal from '../../PersonalCalendar/EventPage/ChangeBackgroundModal';
import { authAxios } from '../../../components/util';
import * as socialActions from '../../../store/actions/socialCalendar';
import { connect } from "react-redux";
import DeleteSocialEventModal from './DeleteSocialEventModal';
import { ReactBingmaps } from 'react-bingmaps';
import {Link, withRouter} from 'react-router-dom';
import DetailEditEventForm from '../../PersonalCalendar/EventPage/DetailEditEventForm';
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

  checkDay = (eventDay, eventTime) =>{
    // Checks if the event day and time has passed the current event date and
    // time. If it is then it will return true if it is not the it will retunr
    // false

    console.log(eventDay, eventTime)
    let eventDate = dateFns.addHours(new Date(eventDay), 7)
    const timeList = eventTime.split(":")
    eventDate = dateFns.addHours(eventDate, timeList[0])
    eventDate = dateFns.addMinutes(eventDate, timeList[1])
    console.log(eventDate)
    console.log(dateFns.isAfter(eventDate, new Date()))
    return dateFns.isAfter(eventDate, new Date())

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
    authAxios.put(`${global.API_ENDPOINT}/mySocialCal/socialEvent/updatebackground/`+eventId,
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
        <div className = 'closeSocialEvent'>
          <Link to={"/explore/admin"} >
          <i class="far fa-times-circle">  </i>
          </Link>
        </div>
        <div className = 'editPencilSocialEvent'>
          {
            eventHostId === this.props.userId ?

            <div>
              <div
              onClick={() => this.onEditClick()}
              >
              <i class="fas fa-pen" ></i>
              </div>
            </div>

            :

            <div></div>

          }

        </div>
      {
        this.state.edit ?

        <div>
          <DetailEditEventForm
          {...this.props}
          visible={this.state.edit}
          initialValues = {this.getInitialValue()}
          onSubmit = {this.onSaveEdit}
          onDelete = {this.onOpenDeleteSocialModal}
           />


        </div>

        :

        <div className = "eventInfoView">

        <div className = "topSectContainier">

          {
            eventBackgroundPic === "" ?
            <div
            className = 'eventBackgroundPic'
            onClick = {() => this.onChangeBackgroundOpen()}
            >
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
              // PICTURE URL
              src = {`${global.API_ENDPOINT}`+eventBackgroundPic}
              className = 'eventBackgroundImg'
               />
            </div>


          }

          <div className = "eventTopSide">
            <div
              className = "dateCircle"
              style = {{
                backgroundColor: "#1890ff"
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

            <div class="eventCard" style={{marginTop:'25px',width:'450px', height:'225px',padding:'50px'}}>
                <div
                  className = 'eventTitle'>
                  {this.capitalize(title)}
                </div>

                <br/>

                  <span
                    style={{display:'inline-block'}}>


                      <Button
                         type="primary" shape="round"
                         icon={<i  style={{marginRight:'10px'}} class="far fa-share-square"></i>}
                         style={{left:'0%', fontSize:'15px'}} size={'large'}>

                        Invite
                      </Button>

                   {
                     (persons.includes(this.props.username))?
                        <Button
                           shape="round"
                           icon={<i  style={{marginRight:'10px'}} class="fas fa-user-check"></i>}
                           style={{left:'5%', fontSize:'15px'}} size={'large'}>

                          Going
                        </Button>

                        :
                        <Button
                           shape="round" type="primary"
                           icon={<i  style={{marginRight:'10px'}} class="fas fa-user-check"></i>}
                           style={{left:'5%', fontSize:'15px'}} size={'large'}>

                          Going
                        </Button>

                  }


                    <Button
                       shape="round"
                       icon={<i  style={{marginRight:'10px'}} class="fas fa-user-times"></i>}
                       style={{left:'10%', fontSize:'15px'}} size={'large'} danger>
                       Delete
                    </Button>
                  </span>
              <div class="flex-container"
                style={{width:'250px', color:'#1890ff', padding:'10px', background:'white'}}

              >

                {/*if no one going , THEN show invited else just show invited
                <div className = "attendees flex-child">
                  <span style={{color:'black'}}> {invited.length} Invited </span>

                  <Liking like_people={invited}/>
                </div>
                */}

                </div>


              </div>



          </div>

          </div>

          <div className = "eventInfo outerContainer">
            <div style={{ marginLeft:'15px', fontSize:'20px',display:'inline-block', width:'500px' }}
              class="aboutEvent eventCard innerContainer">
              Event Details
              <Divider/>
              <div style={{fontSize:'16px'}}>
                <i style={{marginRight:'10px', color:'#1890ff'}} class="fas fa-globe"></i>
                Social Event
                <br/>
                <i style={{marginRight:'10px', color:'#1890ff'}} class="far fa-calendar-alt"></i>
                  {date} at {start_time} - {end_time}
                <br/>
                <i class="fas fa-user-friends" style={{marginRight:'10px', color:'#1890ff'}}></i>
                  {persons.length} Going
                <br/>
                <br/>
                <div className = "contentEvent"> {content} </div>

              </div>





            </div>
            <div className = 'eventInfo innerContainer' style={{float:'right'}}>
              <div style={{ marginLeft:'25px', marginTop:'-50px', width:'450px', height:'150px',
                }} class="eventCard">
                <div class="socialEventHeader" style={{float:'left'}}>
                  Host

                  <br/>
                  <span>
                    <Avatar
                    style={{right:'5px'}}
                    src = {`${global.API_ENDPOINT}`+host.profile_picture}
                    />
                    <span > {this.capitalize(host.first_name)} {this.capitalize(host.last_name)} </span>
                  </span>


              </div>

              <div class="socialEventHeader" style={{float:'right', marginRight:'50px'}}>

                Going

                <br/>
                <span style={{marginLeft:'10px', fontSize:"24px"}}>
                {persons.length}
                </span>


              </div>

              </div>

              {
                location === "" ?
                <div className = "contentEventEmpty"> </div>
                :
                <div style={{marginTop:'50px',}} class="mapEventCard">
                  <p style={{fontSize:'20px'}}
                    className="eventDetails"> Location </p>
                  <span>
                    <Divider style={{marginTop:'-1px'}}/>

                    <ReactBingmaps

                      bingmapKey = "AggkvHunW4I76E1LfWo-wnjlK9SS6yVeRWyeKu3ueSfgb1_wZqOfD1R87EJPAOqD"
                      center = {[32.2226, 110.9747]}
                      boundary = {
                      {
                        "search":"Fremont, California",
                        "option":{
                          entityType: 'PopulatedPlace'
                        },
                        "polygonStyle" :{
                          fillColor: 'rgba(161,224,255,0.4)',
                          strokeColor: '#a495b2',
                          strokeThickness: 2
                        }
                      }
                    }
                      >
                    </ReactBingmaps>

                     {/*Saving api calls don't worry about maps*/}
                    <Divider/>
                      <i style={{marginRight:'15px', color:'#1890ff',
                        fontSize:'16px'}} class="fas fa-map-marker-alt"></i>
                      <p style={{fontSize:'16px', color:'black',  display:'inline-block'}}>
                        {location}
                      </p>
                  </span>


                </div>

              }


            {/*





            */}



          </div>




          </div>

        </div>

      }




      <ChangeBackgroundModal
      visible = {this.state.changeBackgroundView}
      close = {this.onChangeBackgroundClose}
      onSubmit = {this.handleBackgroundPictureChange}
      pic = {eventBackgroundPic}
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
