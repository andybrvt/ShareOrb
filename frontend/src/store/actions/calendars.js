import axios from "axios";
import * as actionTypes from "./actionTypes";
import { authAxios } from '../../components/util';


export const addEvent = events => {
  return {
    type:actionTypes.ADD_EVENT_CALENDAR,
    events: events
  }
}


export const loadEvents = events => {
  return {
    type: actionTypes.LOAD_EVENTS_CALENDAR,
    events: events
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
