import * as actionTypes from './actionTypes';


// The event added to the openEventModal is to pass the event into
// the default list
export const openEventModal = oneEvent => {
  console.log(oneEvent)
  return {
    type: actionTypes.OPEN_EVENT_MODAL,
    oneEvent: oneEvent
  };
};

export const closeEventModal = () => {
  return {
    type: actionTypes.CLOSE_EVENT_MODAL
  };
}

export const changeCalendarEvent = e =>{
  // this is only for the onchange function for the modal 
  console.log(e)
  return {
    type: actionTypes.CHANGE_CALENDAR_EVENT,
    test: e,
  }
}
