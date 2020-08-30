import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";
import * as dateFns from 'date-fns';


const initialState = {
  // The socialObj will be the information inside the modal
  // for each day cell, it will pretty mcuh be like the single cell
  // so then you will have to change the profile object in the explore
  // and add a like to this as well
  socialObject: [],
  socialDate: new Date(),
  showSocialModal: false,
  curSocialDate: new Date(),
  showSocialPicModal: false,
  test: ''
}

const nextMonthSocial = (state, action) => {
  return updateObject (state, {
    socialDate: dateFns.addMonths(state.socialDate, 1)
  })
}

const prevMonthSocial = (state, action) => {
  return updateObject (state, {
    socialDate: dateFns.subMonths(state.socialDate, 1)
  })
}

const openSocialModal = (state, action) => {
  return updateObject ( state, {
    showSocialModal: true,
    socialObject: action.socialObject,
    curSocialDate: action.socialDay
  })
}

const closeSocialModal = (state, action) => {
  return updateObject (state, {
    showSocialModal: false
  })
}

const openSocialPictureModal = (state, action) => {
  return updateObject (state, {
    showSocialPicModal: true
  })
}

const closeSocialPictureModal = (state, action) => {
  return updateObject (state, {
    showSocialPicModal: false
  })
}

const addSocialLikeNewM = (state, action) => {
  return updateObject (state, {
    socialObject : [
      action.socialObj.socialCalCellObj

    ]
  })
}

const addSocialLikeOldM = (state, action) => {
  return updateObject (state, {
    socialObject: [{
        ...state.socialObject[0],
        people_like: [... state.socialObject[0].people_like, action.socialObj.userObj]

      }
    ]
  })
}


const addSocialUnLikeM = (state, action) => {

  function removeUnliker(unliker){
    return unliker.id !== action.socialObj.userObj.id
  }

  return updateObject(state, {
    socialObject: [{
      ...state.socialObject[0],
      people_like: state.socialObject[0].people_like.filter(removeUnliker)
    }]
  })
}

const addSocialCommentNewM = (state, action) => {
  // Since you have the socialcell already and that the socialcell is not already
  // made, you pretty jsut add it in
  return updateObject (state, {
    socialObject: [
      action.socialObj.socialCalCellObj
    ]
  })
}


const reducer = (state = initialState, action) => {
  switch(action.type){
    case actionTypes.NEXT_MONTH_SOCIAL:
      return nextMonthSocial(state, action)
    case actionTypes.PREV_MONTH_SOCIAL:
      return prevMonthSocial(state, action)
    case actionTypes.OPEN_SOCIAL_MODAL:
      return openSocialModal(state, action)
    case actionTypes.CLOSE_SOCIAL_MODAL:
      return closeSocialModal(state, action)
    case actionTypes.OPEN_SOCIAL_PICTURE_MODAL:
      return openSocialPictureModal(state, action)
    case actionTypes.CLOSE_SOCIAL_PICTURE_MODAL:
      return closeSocialPictureModal(state, action)
    case actionTypes.ADD_SOCIAL_LIKE_NEW_M:
      return addSocialLikeNewM(state, action)
    case actionTypes.ADD_SOCIAL_LIKE_OLD_M:
      return addSocialLikeOldM(state, action)
    case actionTypes.ADD_SOCIAL_UNLIKE_M:
      return addSocialUnLikeM(state, action)
    case actionTypes.ADD_SOCIAL_COMMENT_NEW_M:
      return addSocialCommentNewM(state, action)
    default:
      return state;
  }
}

export default reducer;
