import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";
import * as dateFns from 'date-fns';


const initialState = {
  events: [],
  date: new Date()
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
        location: action.instanceEvent.location
      } : item
    )
  })
}

// Splice basically removes an object out of a list giving the index
// list.splice(index, number) the first value is the index you want to take out
// the second values is how many values you want to take out afterwards
const deleteEvent = (state, action) => {
  let newEvents = state.events
  for (let i = 0; i< newEvents.length; i++){
    if(newEvents[i].id === action.eventId){
      newEvents.splice(i, 1)
    }
  }
  return updateObject (state, {
    events: newEvents
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
    default:
      return state;
  }
}


export default reducer;

// once you are done with reducers, add it into index.js
