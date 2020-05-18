import * as actionTypes from './actionTypes';


export const openEventSyncModal = () => {
  return {
    type: actionTypes.OPEN_EVENT_SYNC_MODAL
  }
}

export const closeEventSyncModal = () => {
  return {
    type: actionTypes.CLOSE_EVENT_SYNC_MODAL
  }
}
