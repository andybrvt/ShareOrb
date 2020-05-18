import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility'


const initialState = {
  showEventSyncModal: false
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

const reducer = (state = initialState, action) => {
  switch (action.type){
    case actionTypes.OPEN_EVENT_SYNC_MODAL:
      return openEventSyncModal (state, action);
    case actionTypes.CLOSE_EVENT_SYNC_MODAL:
      return closeEventSyncModal (state, action);
    default:
      return state;
  }
}

export default reducer;
