import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility'


const initialState = {
  showModal: false,
  title: '',
  content: '',
  start_time: null,
  end_time: null,
  location: ''
}

const openEventModal = (state, action) => {
  return updateObject (state, {
    showModal: true,
    title: action.oneEvent.title,
    content: action.oneEvent.content,
    start_time: action.oneEvent.start_time,
    end_time: action.oneEvent.end_time,
    location: action.oneEvent.location
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
  })} else if (type === 'start_time'){
    return updateObject (state, {
      start_time: value
  })} else if (type === 'end_time'){
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
