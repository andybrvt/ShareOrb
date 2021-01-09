import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';


// Profiles will be all the profiles and profile (no s) will be the current user
// profile
const initialState = {
  profile: {},

}

export const loadProfile = (state, action) => {
  //IMPROVED

  return updateObject(state, {
    profile: action.profile
  })
}

export const closeProfile = (state, action ) => {
  return updateObject(state, {
    profile: {}
  })
}

export const addFollowerUnfollower = (state, action) => {
  // IMPROVED

  return updateObject(state, {
    profile: {
      ...state.profile,
      get_followers: action.followerList
    }

  })
}

export const changeProfilePic = (state, action) => {
  // IMPROVED

  return updateObject(state, {
    profile: {
      ...state.profile,
      profile_picture: action.profilePic
    }
  })
}

export const addSocialCell = (state, action) => {
  //NEW ADDING CELL

  return updateObject(state, {
    profile: {
      ...state.profile,
      get_socialCal: [...state.profile.get_socialCal, action.socialCellObj]
    }
  })
}

export const addSocialCellCoverPic = (state, action) => {
  //IMPROVED

  // This will add in the coverpicture when the cell is already created
  return updateObject(state, {
    profile: {
      ...state.profile,
      get_socialCal: state.profile.get_socialCal.map(
        cells => cells.id === action.cellId ? {
          ...cells,
          coverPic: action.coverPicture
        } : cells
      )
    }
  })
}

export const addSocialEventJoinLeave = (state, action) => {
  //IMPROVED

  return updateObject(state, {
    profile: {
      ...state.profile,
      get_socialCal: state.profile.get_socialCal.map(
        cells => cells.id === action.cellId ?{
          ...cells,
          get_socialCalEvent: action.socialEventList
        } : cells
      )
    }
  })
}

export const addSocialEventJoinLeavePage = (state, action) => {

  return updateObject(state, {
    profile: {
      ...state.profile,
      get_socialEvents: action.socialEventList
    }
  })
}

export const sendRequested = (state, action) => {
  return updateObject(state, {
    profile: {
      ...state.profile,
      requested: action.requestedList
    }
  })
}

export const addFollowing = (state, action) => {
  return updateObject(state, {
    profile: {
      ...state.profile,
      get_following: action.followingList
    }
  })
}




const reducer = (state = initialState, action) => {
  switch(action.type){
    case actionTypes.LOAD_PROFILE:
      return loadProfile(state, action);
    case actionTypes.CLOSE_PROFILE:
      return closeProfile(state, action);
    case actionTypes.ADD_FOLLOWER_UNFOLLOWER:
      return addFollowerUnfollower(state, action);
    case actionTypes.CHANGE_PROFILE_PIC:
      return changeProfilePic(state, action);
    case actionTypes.ADD_SOCIAL_CELL:
      return addSocialCell(state, action)
    case actionTypes.ADD_SOCIAL_CELL_COVER_PIC:
      return addSocialCellCoverPic(state, action)
    case actionTypes.ADD_SOCIAL_EVENT_JOIN_LEAVE:
      return addSocialEventJoinLeave(state, action);
    case actionTypes.ADD_SOCIAL_EVENT_JOIN_LEAVE_PAGE:
      return addSocialEventJoinLeavePage(state, action);
    case actionTypes.SEND_REQUESTED:
      return sendRequested(state, action);
    case actionTypes.ADD_FOLLOWING:
      return addFollowing(state, action);
    default:
      return state;
  };

}

export default reducer;
