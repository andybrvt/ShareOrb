import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility'


const initialState = {
  showEventSyncModal: false,
  showPickEventSyncModal: false,
  user: '',
  userFriend: '',
  minDate: null,
  maxDate: null,
  notificationId:'',
  filterEvent: []
}

const openEventSyncModal  = (state, action) => {
  return updateObject(state, {
    showEventSyncModal: true
  })
}

const closeEventSyncModal = (state, action) => {
  return updateObject (state, {
    showEventSyncModal: false
  })
}

const openPickEventSyncModal = (state, action) => {
  return updateObject (state, {
    showPickEventSyncModal: true,
    user: action.user,
    userFriend: action.userFriend,
    minDate: action.minDate,
    maxDate: action.maxDate,
    notificationId: action.notificationId
  })
}

const closePickEventSyncModal = (state, action) => {
  console.log('close event sync')
  return updateObject (state, {
    showPickEventSyncModal: false
  })
}

const eventEventSyncModal = (state, action) => {
  console.log(action.filterEvent)
  return updateObject (state, {
    filterEvent: action.filterEvent
  })
}

const reducer = (state = initialState, action) => {
  switch (action.type){
    case actionTypes.OPEN_EVENT_SYNC_MODAL:
      return openEventSyncModal (state, action);
    case actionTypes.CLOSE_EVENT_SYNC_MODAL:
      return closeEventSyncModal (state, action);
    case actionTypes.OPEN_PICK_EVENT_SYNC_MODAL:
      return openPickEventSyncModal (state, action)
    case actionTypes.CLOSE_PICK_EVENT_SYNC_MODAL:
      return closePickEventSyncModal (state, action)
    case actionTypes.EVENT_EVENT_SYNC_MODAL:
      return eventEventSyncModal (state, action)
    default:
      return state;
  }
}

export default reducer;
