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

export const openSocialModal = (socialObject, day) => {
  return {
    type: actionTypes.OPEN_SOCIAL_MODAL,
    socialObject: socialObject,
    socialDay: day
  }
}

export const closeSocialModal = () => {
  return {
    type: actionTypes.CLOSE_SOCIAL_MODAL
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

export const addSocialLikeNewM = (socialObj) => {
  // This will be used to the redux information into the modal itself
  return{
    type: actionTypes.ADD_SOCIAL_LIKE_NEW_M,
    socialObj: socialObj
  }
}

export const addSocialLikeOldM = (socialObj) => {
  // This will be used to the redux information into the modal itself
  return {
    type: actionTypes.ADD_SOCIAL_LIKE_OLD_M,
    socialObj: socialObj
  }
}


export const addSocialUnLikeM = (socialObj) => {
  return {
    type: actionTypes.ADD_SOCIAL_UNLIKE_M,
    socialObj: socialObj
  }
}

export const addSocialCommentNewM = (socialObj) => {
  return {
    type: actionTypes.ADD_SOCIAL_COMMENT_NEW_M,
    socialObj: socialObj
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
