import React from 'react';
import {Button, Progress, Avatar, Modal, message, notification, Divider, Statistic, List, Skeleton, Tabs} from 'antd';
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

const { TabPane } = Tabs;


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
    // NEED FIXING xxx

    // This will change the format of the time properly to the 1-12 hour
    // console.log(time)
    // const timeList = time.split(':')
    // let hour = parseInt(timeList[0])
    // let minutes = timeList[1]
    // var suffix  = hour >= 12 ? "PM":"AM"
    //
    // console.log(11%12)
    // hour = ((hour+11)%12+1)+':'+minutes+" "+ suffix
    // return hour

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


  back = e => {
    e.stopPropagation();
    this.props.history.goBack();

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


    // These are just place holders
    let list = []
    let accepted = [];
    let decline = [];
    let invited = [];

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

      <div className = 'eventInfoView'>

        <div className = "eventTopEntire">
          <div className = "topSectContainerLeft">
            {
              eventBackgroundPic === "" ?
              <div
              className = 'eventBackgroundPic hoverPic'
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
              onClick = {() => this.onChangeBackgroundOpen()}
              className = 'eventBackgroundWPic hoverPic'>
                <img
                src = {`${global.IMAGE_ENDPOINT}`+eventBackgroundPic}
                 />
              </div>
            }
          </div>

          <div className = "topSectContainerRight">
            <div className = "menuButtonHolder">
              <div className = "closeEvent">
                <i
                  onClick = {this.back}
                  class="far fa-times-circle">
                </i>
              </div>

              <div className = "editEvent">
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
            </div>

            <div
              className = "dateCircle"
              style = {{
                backgroundColor: "#1890ff"
              }}
            >
              <div clasName = "month" > {month}</div>
              <div className = "day"> {day} </div>
            </div>

            <div className = "titleCard">
              <div
                className = 'eventTitle'>
                {this.capitalize(title)}
              </div>
              <div className = "hostHolder">
                <div className = "attendees">
                  Host
                  <br />
                  <span>
                    <Avatar
                      src = {`${global.IMAGE_ENDPOINT}`+host.profile_picture}
                      />
                      <span class="highlightWord" > {this.capitalize(host.first_name)} {this.capitalize(host.last_name)} </span>
                  </span>
                </div>
              </div>


            </div>
          </div>
        </div>

        <div className = "middleCardContainer">
          <div className = "middleInviteCard">
            <div className = "goingHolder">
              <div className="goingTitle"> Going</div>
              <div className="goingInviteNumber">###</div>
                <div className = "">
                  {/*
                    <Liking
                    history = {this.props.history}
                    style={{display:'inline-block'}}
                    num={5}
                    like_people={accepted}/>
                    */}

                </div>
          </div>

          <div className = "invitedHolder">
            <div className="inviteTitle"> Invited</div>
            <div className="goingInviteNumber">###</div>
            <div className = "">
              {/*
                <Liking
                num={5}
                history = {this.props.history}
                style={{display:'inline-block'}}
                like_people={invited}/>
                */}

            </div>
          </div>

          <div className = "buttonHolder">
            <div className = "buttonsHolder">
              <Button
                 type="primary" shape="round"
                 icon={<i  style={{marginRight:'10px'}} class="far fa-share-square"></i>}
                 style={{marginRight:'1%'}}
                size={'large'}>

                Invite
              </Button>

               {
                 (persons.includes(this.props.username))?
                    <Button
                       shape="round"
                       icon={<i  style={{marginRight:'10px'}} class="fas fa-user-check"></i>}
                       style={{marginRight:'1%'}}
                      size={'large'}>

                      Going
                    </Button>

                    :
                    <Button
                       shape="round" type="primary"
                       icon={<i  style={{marginRight:'10px'}} class="fas fa-user-check"></i>}
                       style={{marginRight:'1%'}}
                       size={'large'}>

                      Going
                    </Button>

              }


            <Button
               shape="round"
               icon={<i  style={{marginRight:'10px'}} class="fas fa-user-times"></i>}
               style = {{marginRight: '3%'}}
               size={'large'} danger>
               Delete
            </Button>


            </div>
          </div>


          </div>
        </div>

        <div className = "eventBottomEntire">
          <div className = "eventBottomLeft">
            <div
              class="eventDetailCard">
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
          </div>

          <div className = 'eventBottomRight'>
            <div className = "inviteFriendsEventCard">
                Invite Friends
                <Divider/>
                <Tabs defaultActiveKey="1">
                  <TabPane tab="Suggested Friends" key="1">

                    <List
                        className="demo-loadmore-list scrollableFeature"
                        style={{marginTop:'-10px'}}
                        itemLayout="horizontal"
                        dataSource={list}
                        renderItem={item => (

                        <List.Item>

                          <Skeleton avatar title={false} loading={item.loading} active>

                            <List.Item.Meta
                              avatar={
                                <Avatar
                                  style = {{
                                    cursor: "pointer"
                                  }}
                                  onClick = {() => this.profileDirect(item.username)}
                                   src={item.profile_picture} />
                                }
                                title={<span
                                  style = {{cursor: "pointer"}}
                                   onClick = {() => this.profileDirect(item.username)}> {item.first_name} {item.last_name}</span>}
                                description={
                                  <span class="followerFollowingStat"> {item.get_followers.length +" followers"}</span>
                                  }
                              />
                            </Skeleton>
                        </List.Item>
                    )}
                  />
                </TabPane>
                <TabPane tab="Pending Invites (2)" key="2">

                  <div>hi</div>
                </TabPane>
              </Tabs>
            </div>

            <div class="mapEventCard">
              Location
              <span>
                <Divider style={{marginTop:'-1px'}}/>
                {/*
                <ReactBingmaps
                  bingmapKey = "AggkvHunW4I76E1LfWo-wnjlK9SS6yVeRWyeKu3ueSfgb1_wZqOfD1R87EJPAOqD"
                  center = {[32.2226, 110.9747]}
                  boundary = {
                  {
                    "search":"Fremont, CA",
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
                */}
                 {/*Saving api calls don't worry about maps*/}
                <Divider/>
                  <i style={{marginRight:'15px', color:'#1890ff',
                    fontSize:'16px'}} class="fas fa-map-marker-alt"></i>
                  <p style={{fontSize:'16px', color:'black',  display:'inline-block'}}>
                    Tucson, Arizona
                  </p>
              </span>
            </div>

            <div className = "statEventCard">
               <span> Statistics </span>
              <Divider/>
              <div className =  "percentagesBars">
                <div className = "percentage">
                  <Progress
                    type = "circle"
                    // percent={Math.floor(100*(((accepted.length-1)+decline.length)/invited.length))}
                     size="small"
                     status="active"
                     width={80}
                     gap
                  />
                  <div className = "percentageTerm"> Responded </div>
                </div>
              <div className = 'percentage'>
                <Progress
                  type = "circle"
                  percent={Math.floor(100*((accepted.length-1)/(invited.length)))}
                  width={80}
                />
                <div className = "percentageTerm"> Accepted </div>
                </div>

                <div className = "percentage">
                {
                  (Math.floor(100*(decline.length/invited.length))<100)?
                   <Progress
                     type = "circle" percent={Math.floor(100*(decline.length/invited.length))}
                     width={80}
                   />
                  :
                  <Progress
                    type ="circle" percent={Math.floor(100*(decline.length/invited.length))}
                    width={80}
                   />
                }
                <div className = "percentageTerm" > Declined </div>
                </div>
              </div>
            </div>





          </div>
        </div>

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

        <DetailEditEventForm
        {...this.props}
        visible={this.state.edit}
        initialValues = {this.getInitialValue()}
        onClose = {this.onCancelEventClick}
        onSubmit = {this.onSaveEdit}
        onDelete = {this.onOpenDeleteSocialModal}
         />

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
