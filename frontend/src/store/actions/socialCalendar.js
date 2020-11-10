import * as actionTypes from "./actionTypes";


export const nextMonthSocial = () => {
  return {
    type: actionTypes.NEXT_MONTH_SOCIAL,
  }
}

export const prevMonthSocial = () => {
  return {
    type: actionTypes.PREV_MONTH_SOCIAL
  }
}

export const fetchSocialCalCellPage = (socialCalCellObj) =>{
  console.log(socialCalCellObj)
  return {
    type: actionTypes.FETCH_SOCIAL_CAL_CELL_PAGE,
    socialCalCellObj: socialCalCellObj
  }
}

export const sendSocialCalCellLikeUnlike = (socialCalCellLikeObj) => {
  return{
    type: actionTypes.SEND_SOCIAL_CAL_CELL_LIKE_UNLIKE,
    socialCalCellLikeObj: socialCalCellLikeObj
  }
}


export const openSocialPictureModal = () => {
  return {
    type: actionTypes.OPEN_SOCIAL_PICTURE_MODAL
  }
}

export const closeSocialPictureModal = () => {
  return {
    type: actionTypes.CLOSE_SOCIAL_PICTURE_MODAL
  }
}


export const addSocialCommentOldM = (socialObj) => {
  return {
    type: actionTypes.ADD_SOCIAL_COMMENT_OLD_M,
    socialObj: socialObj
  }
}

export const openSocialEventModal = (date) => {
  return {
    type: actionTypes.OPEN_SOCIAL_EVENT_MODAL,
    date: date
  }
}

export const closeSocialEventModal = () => {
  return {
    type: actionTypes.CLOSE_SOCIAL_EVENT_MODAL
  }
}

export const addSocialCalCellNew = (socialObj) => {
  return {
    type: actionTypes.ADD_SOCIAL_CELL_NEW_M,
    socialObj: socialObj
  }
}

export const addUserSocialEventM = (socialObj) => {
  // This will add users to the social events in the calendar cell modal
  return {
    type: actionTypes.ADD_USER_SOCIAL_EVENT_M,
    socialObj: socialObj
  }
}

export const removeUserSocialEventM = (socialObj) => {
  // This will remove user from the social events in the calendar cell modal
  return {
    type: actionTypes.REMOVE_USER_SOCIAL_EVENT_M,
    socialObj: socialObj
  }
}

export const loadSocialEventInfo = (socialEvent) => {
  // This will load the information about soical event, like the initial
  // connect
  return {
    type: actionTypes.LOAD_SOCIAL_EVENT_INFO,
    socialEvent: socialEvent
  }
}

export const sendSocialEventMessage = (socialMessageObj) =>{
  // send soial message object to the social event group chat

  console.log(socialMessageObj)
  return {
    type: actionTypes.SEND_SOCIAL_EVENT_MESSAGE,
    socialMessageObj: socialMessageObj
  }
}

export const updateSocialEventPage = (updatedSocialEvent) => {
  // update the information in the socialevent page as well as the event
  // information
  return{
    type: actionTypes.UPDATE_SOCIAL_EVENT_PAGE,
    updatedSocialEvent: updatedSocialEvent
  }
}

export const updateSocialEventBackground = (backgroundPic) => {
  // This will update the background picture of the soical event
  return{
    type: actionTypes.UPDATE_SOCIAL_EVENT_BACKGROUND,
    backgroundPic: backgroundPic
  }
}


export const sendDeleteSocialEventNoti = () => {
  // This will jsut indicate that the event has been deleted and you should
  // return the social cal
  return{
    type: actionTypes.SEND_DELETE_SOCIAL_EVENT_NOTI
  }
}
