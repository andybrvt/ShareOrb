export const AUTH_START ='AUTH_START';
export const AUTH_SUCCESS ='AUTH_SUCCESS';
export const AUTH_FAIL ='AUTH_FAIL';
export const AUTH_LOGOUT ='AUTH_LOGOUT';
export const ADD_CREDENTIALS='ADD_CREDENTIALS';

export const OPEN_ADD_CHAT_POPUP = "OPEN_ADD_CHAT_POPUP";
export const CLOSE_ADD_CHAT_POPUP = "CLOSE_ADD_CHAT_POPUP";

export const ADD_MESSAGE = "ADD_MESSAGE";
export const SET_MESSAGES = "SET_MESSAGES";

export const GET_CHATS_SUCCESS = "GET_CHATS_SUCCESS";

export const SET_NOTIFICATIONS = 'SET_NOTIFICATIONS';
export const NEW_NOTIFICATION = 'NEW_NOTIFICATION';

export const ADD_EVENT_CALENDAR = 'ADD_EVENT_CALENDAR';
export const LOAD_EVENTS_CALENDAR = 'LOAD_EVENTS_CALENDAR';


// action type > actions > dispatch > reducers > state
// when you set a variable in all caps it now becomes a global variable

// once you make the action types you want to go into your auth or whater actions in the
// action folder then you wna to put a type on your action by doing actionTypes.THE ACTION HERE
