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
export const getUserEvents = () => {
  // since we are going to call an action in here so we need to use dispatch
  console.log('hit')
  return dispatch => {
    authAxios.get('http://127.0.0.1:8000/mycalendar/events')
    .then(res => dispatch(loadEvents(res.data))
  )};
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
  authAxios.delete('http://127.0.0.1:8000/mycalendar/events/delete/'+eventId)
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
