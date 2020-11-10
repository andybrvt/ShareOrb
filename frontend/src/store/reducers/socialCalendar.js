import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";
import * as dateFns from 'date-fns';


const initialState = {
  // The socialObj will be the information inside the modal
  // for each day cell, it will pretty mcuh be like the single cell
  // so then you will have to change the profile object in the explore
  // and add a like to this as well

  // DELETE XXX
  socialObject: [],

  //This will be the information that fills in the socail cal cell page
  socialCalCellInfo: {},

  socialDate: new Date(),

  // DELETE XXX
  showSocialModal: false,


  curSocialDate: new Date(),
  showSocialPicModal: false,
  showSocialEventModal: false,
  curSocialEventDate: new Date(),
  // selectedSocialEvent is for the event page
  selectedSocialEvent: {},
  socialEventMessages: [],
  // Show will indicate that the event has been deleted
  showDeleted: false,

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

const fetchSocialCalCellPage = (state, action) => {

  return updateObject (state, {
    socialCalCellInfo: action.socialCalCellObj
  })
}

const sendSocialCalCellLikeUnlike = (state, action) => {
  return updateObject(state, {
    socialCalCellInfo: {
      ...state.socialCalCellInfo,
      people_like: action.socialCalCellLikeObj
    }
  })
}


//DELETE XXX
const openSocialModal = (state, action) => {
  return updateObject ( state, {
    showSocialModal: true,
    socialObject: action.socialObject,
    curSocialDate: action.socialDay
  })
}
//DELETE XXX
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



const addSocialUnLikeM = (state, action) => {

  function removeUnliker(unliker){
    return unliker.id !== action.socialObj.userObj.id
  }

  return updateObject(state, {
    socialObject: state.socialObject[0] ? [{
      ...state.socialObject[0],
      people_like: state.socialObject[0].people_like.filter(removeUnliker)
    }] : []
  })
}


const addSocialCellNewM = (state, action) => {
  return updateObject (state, {
    socialObject: [
      action.socialObj.socialCalCellObj
    ]
  })
}

const addSocialCommentOldM = (state, action) => {
  // This is for when the social cell has been made already
  return updateObject (state, {
    socialObject: [{
      ...state.socialObject[0],
      get_socialCalComment: [... state.socialObject[0].get_socialCalComment, action.socialObj.socialComment]
    }]
  })
}

const openSocialEventModal = (state, action) => {
  return updateObject (state, {
    showSocialEventModal: true,
    curSocialEventDate: action.date
  })
}

const closeSocialEventModal = (state,action) => {
  return updateObject (state, {
    showSocialEventModal: false
  })
}

const addUserSocialEventM = (state, action) => {

  const userObj = action.socialObj.userObj
  const socialEvents = action.socialObj.socialCalCellObj.get_socialCalEvent
  return updateObject (state, {
    socialObject: state.socialObject[0] ? [{
      ...state.socialObject[0],
      get_socialCalEvent: socialEvents
    }] : []
  })
}

const removeUserSocialEventM = (state, action) => {
  const userObj = action.socialObj.userObj
  const socialEvents = action.socialObj.socialCalCellObj.get_socialCalEvent

  return updateObject(state, {
    socialObject: state.socialObject[0] ? [{
      ...state.socialObject[0],
      get_socialCalEvent: socialEvents
    }] : []
  })
}

const loadSocialEventInfo = (state, action) => {
  // Load out the social event with all the information

  console.log(action)
  return updateObject(state, {
    selectedSocialEvent: action.socialEvent.eventInfo,
    socialEventMessages: action.socialEvent.messages
  })
}

const sendSocialEventMessage = (state, action) => {

  return updateObject(state, {
    socialEventMessages: [...state.socialEventMessages, action.socialMessageObj]
  })
}

const updateSocialEventPage = (state, action) => {
  return updateObject(state, {
    selectedSocialEvent: action.updatedSocialEvent
  })
}

const updateSocialEventBackground = (state, action) => {
  return updateObject(state, {
    selectedSocialEvent: {
      ...state.selectedSocialEvent,
      backgroundImg: action.backgroundPic
    }
  })
}

const sendDeleteSocialEventNoti = (state, action) => {
  return updateObject(state, {
    showDeleted: true
  })
}

const reducer = (state = initialState, action) => {
  switch(action.type){
    case actionTypes.NEXT_MONTH_SOCIAL:
      return nextMonthSocial(state, action)
    case actionTypes.PREV_MONTH_SOCIAL:
      return prevMonthSocial(state, action)
    case actionTypes.FETCH_SOCIAL_CAL_CELL_PAGE:
      return fetchSocialCalCellPage(state, action)
    case actionTypes.SEND_SOCIAL_CAL_CELL_LIKE_UNLIKE:
      return sendSocialCalCellLikeUnlike(state, action)

    // DELETE XXX
    case actionTypes.OPEN_SOCIAL_MODAL:
      return openSocialModal(state, action)

    // DELETE XXX
    case actionTypes.CLOSE_SOCIAL_MODAL:
      return closeSocialModal(state, action)


    case actionTypes.OPEN_SOCIAL_PICTURE_MODAL:
      return openSocialPictureModal(state, action)
    case actionTypes.CLOSE_SOCIAL_PICTURE_MODAL:
      return closeSocialPictureModal(state, action)
    case actionTypes.ADD_SOCIAL_UNLIKE_M:
      return addSocialUnLikeM(state, action)
    case actionTypes.ADD_SOCIAL_COMMENT_OLD_M:
      return addSocialCommentOldM(state, action)
    case actionTypes.OPEN_SOCIAL_EVENT_MODAL:
      return openSocialEventModal(state, action)
    case actionTypes.CLOSE_SOCIAL_EVENT_MODAL:
      return closeSocialEventModal(state, action)
    case actionTypes.ADD_SOCIAL_CELL_NEW_M:
      return addSocialCellNewM(state, action)
    case actionTypes.ADD_USER_SOCIAL_EVENT_M:
      return addUserSocialEventM (state, action);
    case actionTypes.REMOVE_USER_SOCIAL_EVENT_M:
      return removeUserSocialEventM(state, action);
    case actionTypes.LOAD_SOCIAL_EVENT_INFO:
      return loadSocialEventInfo(state, action);
    case actionTypes.SEND_SOCIAL_EVENT_MESSAGE:
      return sendSocialEventMessage(state, action);
    case actionTypes.UPDATE_SOCIAL_EVENT_PAGE:
      return updateSocialEventPage(state, action);
    case actionTypes.UPDATE_SOCIAL_EVENT_BACKGROUND:
      return updateSocialEventBackground(state, action);
    case actionTypes.SEND_DELETE_SOCIAL_EVENT_NOTI:
      return sendDeleteSocialEventNoti(state, action);
    default:
      return state;
  }
}

export default reducer;
