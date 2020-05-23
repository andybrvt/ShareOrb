import * as actionTypes from './actionTypes';


// The openEventSyncModal would taken in 4 paramets
// the current user, user friend, minDate and maxDate
// The reason for this is to better pass info to the Pick
// eventsync modal
export const openEventSyncModal = () => {
  return {
    type: actionTypes.OPEN_EVENT_SYNC_MODAL,

  }
}

export const closeEventSyncModal = () => {
  return {
    type: actionTypes.CLOSE_EVENT_SYNC_MODAL
  }
}

export const openPickEventSyncModal = (user, userFriend, minDate, maxDate) => {
  return {
    type: actionTypes.OPEN_PICK_EVENT_SYNC_MODAL,
    user: user,
    userFriend: userFriend,
    minDate: minDate,
    maxDate: maxDate

  }
}

export const closePickEventSyncModal = () => {
  console.log('close sync sync')
  return {
    type: actionTypes.CLOSE_PICK_EVENT_SYNC_MODAL
  }
}
