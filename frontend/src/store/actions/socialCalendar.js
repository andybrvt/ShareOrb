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
  //IMPROVED
  console.log(socialCalCellObj)
  return {
    type: actionTypes.FETCH_SOCIAL_CAL_CELL_PAGE,
    socialCalCellObj: socialCalCellObj
  }
}

export const sendSocialCalCellLikeUnlike = (socialCalCellLikeObj) => {
  //IMPROVED
  // Covers both the like and unlike
  return{
    type: actionTypes.SEND_SOCIAL_CAL_CELL_LIKE_UNLIKE,
    socialCalCellLikeObj: socialCalCellLikeObj
  }
}

export const sendSocialCalCellComment = (socialCalCellCommentObj) => {
  //IMPROVED
  // Send comments when there is already an existing cell
  return {
    type: actionTypes.SEND_SOCIAL_CAL_CELL_COMMENT,
    socialCalCellCommentObj: socialCalCellCommentObj
  }
}

export const sendSocialCalCellComments = (socialCalCellCommentsObj) => {
  //IMPROVED
  // Send comments when there is no cell existing
  return {
    type: actionTypes.SEND_SOCIAL_CAL_CELL_COMMENT_NEW,
    socialCalCellCommentsObj: socialCalCellCommentsObj
  }
}

export const deleteSocialCellItem = (socialItemList) => {
  // This is used to update the socialcell items list after you have
  // deleted on of the photos
  return {
    type: actionTypes.DELETE_SOCIAL_CELL_ITEM,
    socialItemList: socialItemList
  }
}

export const addSocialDayCaption = (socialDayCaption) => {
  // This will be used to update the social cal cell when you update the
  // caption of the cell

  return {
    type: actionTypes.ADD_SOCIAL_DAY_CAPTION,
    socialDayCaption: socialDayCaption
  }
}

export const closeSocialCalCellPage = () => {
  // When closing the page, it clears out all the infromation so transtioning will
  // be more smooth
  return {
    type: actionTypes.CLOSE_SOCIAL_CAL_CELL_PAGE,

  }
}







// For social events

export const addSocialEventJoinLeaveM = (socialEventList) => {
  return {
    type: actionTypes.ADD_SOCIAL_EVENT_JOIN_LEAVE_M,
    socialEventList: socialEventList
  }
}


export const loadSocialEventInfo = (socialEvent) => {
  // IMPROVED
  // This will load the information about soical event, like the initial
  // connect
  return {
    type: actionTypes.LOAD_SOCIAL_EVENT_INFO,
    socialEvent: socialEvent
  }
}

export const sendSocialEventMessage = (socialMessageObj) =>{
  // IMPROVED
  // send soial message object to the social event group chat

  console.log(socialMessageObj)
  return {
    type: actionTypes.SEND_SOCIAL_EVENT_MESSAGE,
    socialMessageObj: socialMessageObj
  }
}

export const updateSocialEventPage = (updatedSocialEvent) => {
  // IMPROVED
  // update the information in the socialevent page as well as the event
  // information
  return{
    type: actionTypes.UPDATE_SOCIAL_EVENT_PAGE,
    updatedSocialEvent: updatedSocialEvent
  }
}

export const updateSocialEventBackground = (backgroundPic) => {
  // IMPROVED
  // This will update the background picture of the soical event
  return{
    type: actionTypes.UPDATE_SOCIAL_EVENT_BACKGROUND,
    backgroundPic: backgroundPic
  }
}


export const sendDeleteSocialEventNoti = () => {
  // IMPROVED
  // This will jsut indicate that the event has been deleted and you should
  // return the social cal
  return{
    type: actionTypes.SEND_DELETE_SOCIAL_EVENT_NOTI
  }
}
