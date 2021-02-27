import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";
import * as dateFns from 'date-fns';


const initialState = {
  events: [],
  date: new Date(),
  //selectedEvent is for the event page
  selectedEvent: {},
  eventMessages: [],
  showAcceptUnshareModal: false,
  tempEventForModal: {},
  tempDifference : ""
}

const addEvent = (state, action)=> {
  return updateObject(state,{
      events: [...state.events, action.events]
  })
}

const loadEvents = (state, action) =>{
  return updateObject(state, {
    events: action.events
  })
}

// this will get the date that is currently in the url
const getDate = (state, action) => {
  return updateObject(state, {
    date: action.selectedDate
  })
}
// basically for the month we are basically just converting all the
// states into props and we just need the acitons to do so and Since
// getting the current month is natural so we can just pull it right Away
// in the states here so we dont have to worry about it being another action

const nextYear = (state, action) => {
  return updateObject(state, {
    date: dateFns.addYears(state.date, 1)
  })
}

const prevYear = (state, action) => {
  console.log('states prevYear')
  return updateObject(state, {
    date: dateFns.subYears(state.date, 1)
  })
}

const nextMonth = (state, action) => {
  return updateObject(state, {
    date: dateFns.addMonths(state.date, 1)
  })
}

const prevMonth = (state, action) => {
  return updateObject(state, {
    date: dateFns.subMonths(state.date, 1)
  })
}

const nextWeek = (state, action) => {
  return updateObject(state, {
    date: dateFns.addWeeks(state.date, 1)
  })
}

const prevWeek = (state, action) => {
  return updateObject(state, {
    date: dateFns.subWeeks(state.date, 1)
  })
}

const nextDay = (state, action) => {
  return updateObject(state, {
    date: dateFns.addDays(state.date, 1)
  })
}

const prevDay = (state, action) => {
  return updateObject(state, {
    date: dateFns.subDays(state.date, 1)
  })
}

// you will index out the value in the list with the value you are trying to edit
// you will then change that value
const editEvent = (state, action) => {

  return updateObject(state, {
    events: state.events.map(
      item => item.id === action.instanceEvent.id ? {
        ...item,
        title: action.instanceEvent.title,
        content: action.instanceEvent.content,
        start_time: action.instanceEvent.start_time,
        end_time: action.instanceEvent.end_time,
        location: action.instanceEvent.location,
        color: action.instanceEvent.color,
      } : item
    )
  })
}

// Splice basically removes an object out of a list giving the index
// list.splice(index, number) the first value is the index you want to take out
// the second values is how many values you want to take out afterwards
const deleteEvent = (state, action) => {
  // let newEvents = state.events
  // for (let i = 0; i< newEvents.length; i++){
  //   if(newEvents[i].id === action.eventId){
  //     newEvents.splice(i, 1)
  //   }
  // }
  // return updateObject (state, {
  //   events: newEvents
  // })

  console.log('we hit here')
  function removeEvent(removedEvent){
    return removedEvent.id !== action.eventId
  }

  return updateObject(state, {
    events: state.events.filter(removeEvent)
  })

}

const acceptEventShare = (state, action) => {
  return updateObject(state, {
    events: state.events.map(
      item => item.id === action.acceptShareObj.eventId ? {
        ...item,
        accepted: action.acceptShareObj.person
      } : item
    )
  })
}

const declineElseEventShare = (state, action) => {

  function removeDeclineEvent(declineUser){
    return declineUser.id !== action.declineShareObj.declineId
  }

  return updateObject(state, {
    events: state.events.map(
      item => item.id === action.declineShareObj.eventId ? {
        ...item,
        person: item.person.filter(removeDeclineEvent),
        decline: [...item.decline, action.declineShareObj.declineId]
      } : item
    )
  })
}

const declineEventShare = (state, action) => {

  function removeDeclineEvent(declineEvent){
    return declineEvent.id !== action.declineShareObj.eventId
  }

  return updateObject(state, {
    events: state.events.filter(removeDeclineEvent)
  })
}

const loadEventInfo = (state, action) => {
  // This is to load in event information the event page... pretty much whenever
  // you open up an event page it will change the selected event and the mesages
  // is also jsut saved there tempary, it will change

  return updateObject(state, {
    selectedEvent: action.eventInfoObj.eventInfo,
    eventMessages: action.eventInfoObj.messages
  })
}

const sendEventMessage = (state, action) =>{
  // This will add messages into the message field of the group chats, and since
  // each time you pull up an event page, it will change the message field.
  return updateObject(state, {
    eventMessages: [...state.eventMessages, action.message]
  })
}

const updateSeenEventMessage = (state, action) => {
  // This will updat ethe seen field in the selected event object
  // maybe the state.events too but gotta check

  return updateObject(state, {
    selectedEvent: {
      ...state.selectedEvent,
      seen: action.seenEventObj
    }
  })
}


const openAcceptUnshareModal = (state, action) => {
  console.log(action)
  return updateObject(state, {
    showAcceptUnshareModal: true,
    tempEventForModal: action.eventObj,
    tempDifference: action.tempDifference,
  })
}

const closeAcceptUnshareModal = (state, action) => {
  return updateObject(state, {
    showAcceptUnshareModal: false,
    tempEventForModal: {},
    tempDifference: ""
  })
}

const updateEventPage = (state, action) => {
  return updateObject(state, {
    selectedEvent: action.updatedEventObj
  })
}

const updateEventBackground = (state, action) => {
  console.log(action.backgroundPic)

  console.log('hi there brother')
  return updateObject(state, {
    selectedEvent: {
      ...state.selectedEvent,
      backgroundImg: action.backgroundPic
    }
  })
}

const updateGoingNotList = (state, action) => {
  // This will update the accepted and decline list

  console.log(action)
  return updateObject(state, {
    selectedEvent: {
      ...state.selectedEvent,
      accepted: action.goingObj.acceptList,
      decline: action.goingObj.declineList,
    }
  })
}

// const deleteEvent =

// when an action gets called it will go into here and this will check what the
// the type is
const reducer = (state = initialState, action) => {
  switch(action.type){
    case actionTypes.LOAD_EVENTS_CALENDAR:
      return loadEvents(state, action);
    case actionTypes.ADD_EVENT_CALENDAR:
      return addEvent(state, action);
    case actionTypes.NEXT_YEAR:
      return nextYear(state, action);
    case actionTypes.PREV_YEAR:
      return prevYear(state, action);
    case actionTypes.NEXT_MONTH:
      return nextMonth(state, action);
    case actionTypes.PREV_MONTH:
      return prevMonth(state, action);
    case actionTypes.GET_DATE:
      return getDate(state, action);
    case actionTypes.NEXT_WEEK:
      return nextWeek(state, action);
    case actionTypes.PREV_WEEK:
      return prevWeek(state, action);
    case actionTypes.NEXT_DAY:
      return nextDay(state, action);
    case actionTypes.PREV_DAY:
      return prevDay(state, action);
    case actionTypes.EDIT_EVENT_CALENDAR:
      return editEvent(state, action);
    case actionTypes.DELETE_EVENT_CALENDAR:
      return deleteEvent(state, action);
    case actionTypes.ACCEPT_EVENT_SHARE:
      return acceptEventShare(state, action);
    case actionTypes.DECLINE_ELSE_EVENT_SHARE:
      return declineElseEventShare(state, action);
    case actionTypes.DECLINE_EVENT_SHARE:
      return declineEventShare(state, action);
    case actionTypes.LOAD_EVENT_INFO:
      return loadEventInfo(state, action);
    case actionTypes.SEND_EVENT_MESSAGE:
      return sendEventMessage(state, action)
    case actionTypes.OPEN_ACCEPT_UNSHARE_MODAL:
      return openAcceptUnshareModal(state, action)
    case actionTypes.CLOSE_ACCEPT_UNSHARE_MODAL:
      return closeAcceptUnshareModal(state, action)
    case actionTypes.UPDATE_EVENT_PAGE:
      return updateEventPage(state, action)
    case actionTypes.UPDATE_EVENT_BACKGROUND:
      return updateEventBackground(state, action)
    case actionTypes.UPDATE_SEEN_EVENT_MESSAGE:
      return updateSeenEventMessage(state, action)
    case actionTypes.UPDATE_GOING_NOT_LIST:
      return updateGoingNotList(state, action)
    default:
      return state;
  }
}


export default reducer;

// once you are done with reducers, add it into index.js
