import * as actionTypes from './actionTypes';

export const openPopup = () => {
  return {
    type: actionTypes.OPEN_POPUP
  };
};


export const closePopup = () => {
  return {
    type: actionTypes.CLOSE_POPUP
  };
};
