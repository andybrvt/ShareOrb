import * as actionTypes from './actionTypes';

export const openEventModal = () => {
  return {
    type: actionTypes.OPEN_EVENT_MODAL
  };
};

export const closeEventModal = () => {
  return {
    type: actionTypes.CLOSE_EVENT_MODAL
  };
}
