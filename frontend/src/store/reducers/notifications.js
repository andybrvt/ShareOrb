import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  notifications: []
};

const setNotifications = (state, action) => {
  console.log(action.notifications)
  return updateObject(state, {

    notifications: action.notifications
  });
};

const newNotification = (state, action) => {
  return updateObject(state, {
    notifications: [...state.notifications, action.notification]
  })
}

const reducer = (state= initialState, action ) => {
  switch(action.type) {
    case actionTypes.NEW_NOTIFICATION:
      return newNotification(state,action);
      case actionTypes.SET_NOTIFICATIONS:
        return setNotifications(state,action);
    default:
      return state;
  }
};

export default reducer;
