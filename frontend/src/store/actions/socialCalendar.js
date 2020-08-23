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
