export const AUTH_START ='AUTH_START';
export const AUTH_SUCCESS ='AUTH_SUCCESS';
export const AUTH_FAIL ='AUTH_FAIL';
export const AUTH_LOGOUT ='AUTH_LOGOUT';
export const ADD_CREDENTIALS='ADD_CREDENTIALS';

export const OPEN_POPUP = "OPEN_POPUP";
export const CLOSE_POPUP = "CLOSE_POPUP";

export const ADD_MESSAGE = "ADD_MESSAGE";
export const SET_MESSAGES = "SET_MESSAGES";

export const GET_CHATS_SUCCESS = "GET_CHATS_SUCCESS";

export const SET_NOTIFICATIONS = 'SET_NOTIFICATIONS';
export const NEW_NOTIFICATION = 'NEW_NOTIFICATION';
export const DELETE_NOTIFICATION = 'DELETE_NOTIFICATION';
export const OPEN_NOTIFICATION = 'OPEN_NOTIFICATION';
export const CLOSE_NOTIFICATION = 'CLOSE_NOTIFICATION';


export const ADD_EVENT_CALENDAR = 'ADD_EVENT_CALENDAR';
export const LOAD_EVENTS_CALENDAR = 'LOAD_EVENTS_CALENDAR';
export const EDIT_EVENT_CALENDAR = 'EDIT_EVENT_CALENDAR';
export const DELETE_EVENT_CALENDAR = 'DELETE_EVENT_CALENDAR';
export const GET_DATE = 'GET_DATE';
export const NEXT_YEAR = 'NEXT_YEAR';
export const PREV_YEAR = 'PREV_YEAR';
export const NEXT_MONTH = 'NEXT_MONTH';
export const PREV_MONTH = 'PREV_MONTH';
export const NEXT_WEEK  = 'NEXT_WEEK';
export const PREV_WEEK = 'PREV_WEEK';
export const NEXT_DAY = 'NEXT_DAY';
export const PREV_DAY = 'PREV_DAY';

export const OPEN_EVENT_MODAL = 'OPEN_EVENT_MODAL';
export const CLOSE_EVENT_MODAL = 'CLOSE_EVENT_MODAL';
export const CHANGE_CALENDAR_EVENT = 'CHANGE_CALENDAR_EVENT';

export const OPEN_EVENT_SYNC_MODAL = 'OPEN_EVENT_SYNC_MODAL';
export const CLOSE_EVENT_SYNC_MODAL = 'CLOSE_EVENT_SYNC_MODAL';
export const OPEN_PICK_EVENT_SYNC_MODAL = 'OPEN_PICK_EVENT_SYNC_MODAL';
export const CLOSE_PICK_EVENT_SYNC_MODAL = 'CLOSE_PICK_EVENT_SYNC_MODAL';
// The event event is for the events that you have fitlered out in the range
export const EVENT_EVENT_SYNC_MODAL = 'EVENT_EVENT_SYNC_MODAL';


// action type > actions > dispatch > reducers > state
// when you set a variable in all caps it now becomes a global variable

// once you make the action types you want to go into your auth or whater actions in the
// action folder then you wna to put a type on your action by doing actionTypes.THE ACTION HERE
