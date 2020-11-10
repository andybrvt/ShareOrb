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
export const OPEN_EVENT_DELETE_MODAL = 'OPEN_EVENT_DELETE_MODAL';
export const CLOSE_EVENT_DELETE_MODAL = 'CLOSE_EVENT_DELETE_MODAL';

export const OPEN_EVENT_SYNC_MODAL = 'OPEN_EVENT_SYNC_MODAL';
export const CLOSE_EVENT_SYNC_MODAL = 'CLOSE_EVENT_SYNC_MODAL';
export const OPEN_PICK_EVENT_SYNC_MODAL = 'OPEN_PICK_EVENT_SYNC_MODAL';
export const CLOSE_PICK_EVENT_SYNC_MODAL = 'CLOSE_PICK_EVENT_SYNC_MODAL';
// The event event is for the events that you have fitlered out in the range
export const EVENT_EVENT_SYNC_MODAL = 'EVENT_EVENT_SYNC_MODAL';
// This will be for accepting shared event
export const ACCEPT_EVENT_SHARE = 'ACCEPT_EVENT_SHARE';
export const DECLINE_ELSE_EVENT_SHARE = 'DECLINE_ELSE_EVENT_SHARE';
export const DECLINE_EVENT_SHARE = 'DECLINE_EVENT_SHARE';

// Load event info will render the event information. This will be connected to
// the fetch_event_info command that is in the eventPageWebsocket
export const LOAD_EVENT_INFO = 'LOAD_EVENT_INFO';
export const SEND_EVENT_MESSAGE = 'SEND_EVENT_MESSAGE';
export const OPEN_ACCEPT_UNSHARE_MODAL = 'OPEN_ACCEPT_UNSHARE_MODAL';
export const CLOSE_ACCEPT_UNSHARE_MODAL = 'CLOSE_ACCEPT_UNSHARE_MODAL';
export const UPDATE_EVENT_PAGE = "UPDATE_EVENT_PAGE";
export const UPDATE_EVENT_BACKGROUND = "UPDATE_EVENT_BACKGROUND";

export const LOAD_POSTS = 'LOAD_POSTS';
export const ADD_POST_LIKE = 'ADD_POST_LIKE';
export const UNADD_POST_LIKE = 'UNADD_POST_LIKE';
export const ADD_POST_COMMENT = 'ADD_POST_COMMENT';
export const DELETE_POST = 'DELETE_POST';



// so adding to follower you will add it to the person getting the following
// add following would be to the person that is doing the following

export const LOAD_PROFILE  = 'LOAD_PROFILE';

export const ADD_FOLLOWER_UNFOLLOWER = 'ADD_FOLLOWER_UNFOLLOWER';
export const CHANGE_PROFILE_PIC  = 'CHANGE_PROFILE_PIC';




// This is to set the action social
export const NEXT_MONTH_SOCIAL = 'NEXT_MONTH_SOCIAL';
export const PREV_MONTH_SOCIAL = 'PREV_MONTH_SOCIAL';

//This is to fetch the social call cell info
export const FETCH_SOCIAL_CAL_CELL_PAGE = 'FETCH_SOCIAL_CAL_CELL_PAGE';
// USE THIS FOR BOTH LIKING AND UNLIKING
export const SEND_SOCIAL_CAL_CELL_LIKE_UNLIKE = 'SEND_SOCIAL_CAL_CELL_LIKE_UNLIKE';


// The picture modal is what you would use to upload pictures
export const OPEN_SOCIAL_PICTURE_MODAL = 'OPEN_SOCIAL_PICTURE_MODAL';
export const CLOSE_SOCIAL_PICTURE_MODAL = 'CLOSE_SOCIAL_PICTURE_MODAL';
// This social event modal will allow you post social events
export const OPEN_SOCIAL_EVENT_MODAL = "OPEN_SOCIAL_EVENT_MODAL";
export const CLOSE_SOCIAL_EVENT_MODAL = 'CLOSE_SOCIAL_EVENT_MODAL';
// Even though these actions are for the social calendar but because the social calendar
// is part of the profile page


// DELETE XXX
export const ADD_SOCIAL_COMMENT_OLD = 'ADD_SOCIAL_COMMENT_OLD';
export const ADD_SOCIAL_COMMENT_OLD_M = 'ADD_SOCIAL_COMMENT_OLD_M';



export const ADD_SOCIAL_EVENT_OLD = 'ADD_SOCIAL_EVENT_OLD';
export const ADD_USER_SOCIAL_EVENT = 'ADD_USER_SOCIAL_EVENT';
export const ADD_USER_SOCIAL_EVENT_M = 'ADD_USER_SOCIAL_EVENT_M';
export const REMOVE_USER_SOCIAL_EVENT = 'REMOVE_USER_SOCIAL_EVENT';
export const REMOVE_USER_SOCIAL_EVENT_M = 'REMOVE_USER_SOCIAL_EVENT_M';
// This will pretty much be used for any add_social commands with new next to it
export const ADD_SOCIAL_CELL_NEW = 'ADD_SOCIAL_CELL_NEW';
export const ADD_SOCIAL_CELL_NEW_M = 'ADD_SOCIAL_CELL_NEW_M'

// This would be used for the socialEvents
export const LOAD_SOCIAL_EVENT_INFO = "LOAD_SOCIAL_EVENT_INFO";
export const SEND_SOCIAL_EVENT_MESSAGE = "SEND_SOCIAL_EVENT_MESSAGE";
export const UPDATE_SOCIAL_EVENT_PAGE = "UPDATE_SOCIAL_EVENT_PAGE";
export const UPDATE_SOCIAL_EVENT_BACKGROUND = "UPDATE_SOCIAL_EVENT_BACKGROUND";
export const SEND_DELETE_SOCIAL_EVENT_NOTI = "SEND_DELETE_SOCIAL_EVENT_NOTI";
// action type > actions > dispatch > reducers > state
// when you set a variable in all caps it now becomes a global variable

// once you make the action types you want to go into your auth or whater actions in the
// action folder then you wna to put a type on your action by doing actionTypes.THE ACTION HERE
