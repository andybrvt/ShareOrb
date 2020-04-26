import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility'


const initialState = {
  showModal: false
}

const openEventModal = (state, action) => {
  return updateObject (state, {showModal: true});
};

const closeEventModal = (state, action) => {
  return updateObject (state, {showModal: false});
}

const reducer = (state = initialState, action) => {
  switch(action.type){
    case actionTypes.OPEN_EVENT_MODAL:
      return openEventModal(state, action);
    case actionTypes.CLOSE_EVENT_MODAL:
      return closeEventModal(state, action);
    default:
      return state;
  }
}

export default reducer;
