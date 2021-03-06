import axios from "axios";
import * as actionTypes from "./actionTypes";
import { authAxios } from '../../components/util';


// Might not have to use this if we are gonna use Redux Form
export const addEvent = events => {
  console.log(events)
  return {
    type:actionTypes.ADD_EVENT_CALENDAR,
    events: events
  }
}

// So you just have to call this in the front end so that it will change the props
export const getUserEvents = (startDate, endDate) => {
  // since we are going to call an action in here so we need to use dispatch
  console.log(startDate, endDate)
  return dispatch => {
    authAxios.get(`${global.API_ENDPOINT}/mycalendar/filterEvents/`+startDate+"/"+endDate)
    .then(res => dispatch(loadEvents(res.data))
  )};
  // return dispatch => {
  //   authAxios.get(`${global.API_ENDPOINT}/mycalendar/oldEvents/`)
  //   .then(res => dispatch(loadEvents(res.data))
  // )};
};

// this will basically just be the middle man
export const loadEvents = events => {
  return {
    type: actionTypes.LOAD_EVENTS_CALENDAR,
    events: events
  }
}

export const editEvents = events => {
  // pass in 1 event that we edited and you will go into the backend and edit the
  // states
  console.log(events)
  return {
    type: actionTypes.EDIT_EVENT_CALENDAR,
    instanceEvent: events
  }
}

export const deleteEvents = eventId => {
  console.log(eventId)
  authAxios.delete(`${global.API_ENDPOINT}/mycalendar/events/delete/`+eventId)
  return {
    type: actionTypes.DELETE_EVENT_CALENDAR,
    eventId: eventId
  }
}


// This function will get the current date
export const getDate = date =>{
  return {
    type: actionTypes.GET_DATE,
    selectedDate: date
  }
}

export const nextMonth = () => {
  return {
    type: actionTypes.NEXT_MONTH
  }
}

export const prevMonth = () => {
  return {
    type: actionTypes.PREV_MONTH
  }
}

export const nextWeek = () => {
  return {
    type: actionTypes.NEXT_WEEK
  }
}

export const prevWeek = () => {
  return {
    type: actionTypes.PREV_WEEK
  }
}

export const nextDay = () => {
  return {
    type: actionTypes.NEXT_DAY
  }
}

export const prevDay = () => {
  return {
    type: actionTypes.PREV_DAY
  }
}

export const nextYear = () => {
  console.log('nextYear')
  console.log('herherherherh')
  return {
    type: actionTypes.NEXT_YEAR
  }
}

export const prevYear = () => {
  console.log('prevYear')
  return {
    type: actionTypes.PREV_YEAR
  }
}

export const acceptEventShare = (acceptShareObj) => {
  return {
    type: actionTypes.ACCEPT_EVENT_SHARE,
    acceptShareObj: acceptShareObj
  }
}

export const declineElseEventShare = (declineShareObj) => {
  return{
    type: actionTypes.DECLINE_ELSE_EVENT_SHARE,
    declineShareObj: declineShareObj
  }
}

export const declineEventShare = (declineShareObj) => {
  return {
    type: actionTypes.DECLINE_EVENT_SHARE,
    declineShareObj: declineShareObj
  }
}

export const loadEventInfo = (eventInfoObj) => {
  // This will load the events into the event page, pretty much just holding all
  // the information, and messages for that one event on the event page
  return {
    type: actionTypes.LOAD_EVENT_INFO,
    eventInfoObj: eventInfoObj
  }
}

export const sendEventMessage = (eventMessageObj) => {
  // This will be used to send the message into the message field so that it
  // can show up in the group chats in side the event page
  return {
    type: actionTypes.SEND_EVENT_MESSAGE,
    message: eventMessageObj
  }
}


export const openAcceptUnshareModal = (eventObj, tempDifference) => {
  console.log(tempDifference)
  return {
    type: actionTypes.OPEN_ACCEPT_UNSHARE_MODAL,
    eventObj: eventObj,
    tempDifference: tempDifference
  }
}

export const closeAcceptUnshareModal = () => {
  return{
    type: actionTypes.CLOSE_ACCEPT_UNSHARE_MODAL,
  }
}

export const updateEventPage = (updatedEventObj) => {
  // This will be used to update the event page when you make an edit, not sure if
  // it will change it for everyon who is on the page
  return{
    type: actionTypes.UPDATE_EVENT_PAGE,
    updatedEventObj: updatedEventObj
  }
}

export const updateEventBackground = (backgroundPic) => {
  // This will be used to update the background pic on the event, it will pretty much
  // take in a string of the location of the image
  console.log(backgroundPic)
  return {
    type: actionTypes.UPDATE_EVENT_BACKGROUND,
    backgroundPic: backgroundPic
  }
}

export const updateSeenEventMessage = (seenEventObj)  => {
  return{
    type: actionTypes.UPDATE_SEEN_EVENT_MESSAGE,
    seenEventObj: seenEventObj
  }
}

export const updateGoingNotList = (goingObj) => {
  // The going object will const both of the going and not going list
  console.log(goingObj)
  return{
    type: actionTypes.UPDATE_GOING_NOT_LIST,
    goingObj: goingObj
  }
}
