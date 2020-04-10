import axios from "axios";
import * as actionTypes from "./actionTypes";
import  { authAxios } from '../../components/util';


export const addEvent = events = {
  return (
    type:actionTypes.ADD_EVENT_CALENDAR,
    events: events
  )
}


export const loadEvents = events = {
  return (
    type: actionTypes.LOAD_EVENTS_CALENDAR,
    events: events
  )
}
