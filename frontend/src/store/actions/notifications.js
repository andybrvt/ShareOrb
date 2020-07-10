import axios from "axios";
import * as actionTypes from "./actionTypes";

export const setNotifications = notifications => {
  return {
    type: actionTypes.SET_NOTIFICATIONS,
    notifications: notifications
  };
};


export const newNotification = notification => {
  return {
    type: actionTypes.NEW_NOTIFICATION,
    notification: notification
  };
};

export const deleteNotification = notificationId => {
  return {
    type: actionTypes.DELETE_NOTIFICATION,
    notificationId: notificationId
  }
}


export const openNotification = () => {
  return {
    type: actionTypes.OPEN_NOTIFICATION,
  }
}


export const closeNotification = () => {
  return {
    type: actionTypes.CLOSE_NOTIFICATION
  }
}
