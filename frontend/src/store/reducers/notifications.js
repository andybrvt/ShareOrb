import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  notifications: [],
  showNotification: false
};

const setNotifications = (state, action) => {
  return updateObject(state, {
    notifications: action.notifications
  });
};

const newNotification = (state, action) => {
  console.log(action)
  return updateObject(state, {
    notifications: [...state.notifications, action.notification]
  })
}

const deleteNotification = (state, action) => {
  let newNotifications = state.notifications
  for (let i = 0; i<newNotifications.length; i++){
    if (newNotifications[i].id === action.notificationId){
      newNotifications.splice(i, 1)
    }
  }
  return updateObject (state, {
    notifications: newNotifications
  })
}

const openNotification = (state, action) => {
  return updateObject(state, {
    showNotification: true
  })
}

const closeNotification = (state, action) => {
  return updateObject(state, {
    showNotification: false
  })
}


const reducer = (state= initialState, action ) => {
  switch(action.type) {
    case actionTypes.NEW_NOTIFICATION:
      return newNotification(state,action);
    case actionTypes.SET_NOTIFICATIONS:
      return setNotifications(state,action);
    case actionTypes.DELETE_NOTIFICATION:
      return deleteNotification(state, action);
    case actionTypes.OPEN_NOTIFICATION:
      return openNotification(state,action);
    case actionTypes.CLOSE_NOTIFICATION:
      return closeNotification(state, action)
    default:
      return state;
  }
};

export default reducer;

// once you are done with reducers, add it into index.js
