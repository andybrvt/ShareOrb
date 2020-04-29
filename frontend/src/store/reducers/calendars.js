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

// when an action gets called it will go into here and this will check what the
// the type is
const reducer = (state = initialState, action) => {
  switch(action.type){
    case actionTypes.LOAD_EVENTS_CALENDAR:
      return loadEvents(state, action);
    case actionTypes.ADD_EVENT_CALENDAR:
      return addEvent(state, action);
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
    default:
      return state;
  }
}


export default reducer;

// once you are done with reducers, add it into index.js
