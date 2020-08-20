import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";
import * as dateFns from 'date-fns';


const initialState = {
  // The socialEvents will be the information inside the modal
  // for each day cell
  socialObject: [],
  socialDate: new Date(),
  showSocialModal: false,
  curSocialDate: new Date()
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
    default:
      return state;
  }
}

export default reducer;
