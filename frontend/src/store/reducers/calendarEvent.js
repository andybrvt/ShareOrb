import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility'


const initialState = {
  showModal: false,
  title: '',
  content: '',
  start_date: null,
  end_date: null,
  start_time: null,
  end_time: null,
  location: '',
  calendarId: '',
}

const openEventModal = (state, action) => {
  // Remeber that when you first make the event the values that come in
  // are not a string
  console.log(action.oneEvent.start_time)
  const start_date = String(action.oneEvent.start_time).substring(0,10)
  const end_date = String(action.oneEvent.end_time).substring(0,10)
  const start_time = String(action.oneEvent.start_time).substring(11, 16)
  const end_time = String(action.oneEvent.end_time).substring(11,16)
  console.log(start_date)


  return updateObject (state, {
    showModal: true,
    title: action.oneEvent.title,
    content: action.oneEvent.content,
    start_date: start_date,
    end_date: end_date,
    start_time: start_time,
    end_time: end_time,
    location: action.oneEvent.location,
    calendarId: action.oneEvent.id
  });
};

const closeEventModal = (state, action) => {
  return updateObject (state, {
    showModal: false,
    oneEvent: {}

  });
}

const changeCalendarEvent = (state, action) => {
  const type = action.test.target.name
  const value = action.test.target.value
  if(type === "title"){
    return updateObject (state, {
      title: value
  })} else if (type === 'content'){
    return updateObject (state, {
      content: value
  })} else if (type === 'start'){
    return updateObject (state, {
      start_time: value
  })} else if (type === 'end'){
    return updateObject (state, {
      end_time: value
  })} else if (type === 'location'){
    return updateObject (state, {
      location: value
  })}
}

const reducer = (state = initialState, action) => {
  switch(action.type){
    case actionTypes.OPEN_EVENT_MODAL:
      return openEventModal(state, action);
    case actionTypes.CLOSE_EVENT_MODAL:
      return closeEventModal(state, action);
    case actionTypes.CHANGE_CALENDAR_EVENT:
      return changeCalendarEvent(state, action);
    default:
      return state;
  }
}

export default reducer;
