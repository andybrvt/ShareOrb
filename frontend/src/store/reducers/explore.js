import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';


// Profiles will be all the profiles and profile (no s) will be the current user
// profile
const initialState = {
  profile: {},
  test: '',

}

export const loadProfile = (state, action) => {
  //IMPROVED

  return updateObject(state, {
    profile: action.profile
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


export const addSocialEventOld = (state,action) => {
  const calendarOwnerId = action.exploreObj.socialCalCell.socialCalUser.id
  const calendarCalCellId = action.exploreObj.socialCalCell.id
  const eventObj = action.exploreObj.socialEvent

  console.log(action.exploreObj.socialCalCell)
  console.log('hit here ')
  console.log(eventObj)
  let curProfileId = ''

  if (state.profile){
    curProfileId = state.profile.id
  }

  return updateObject(state, {
    profiles: state.profiles.map(
      profile => profile.id === calendarOwnerId ? {
        ...profile,
        get_socialCal: profile.get_socialCal.map(
          socialCell => socialCell.id === calendarCalCellId ? {
            ...socialCell,
            get_socialCalEvent: [...socialCell.get_socialCalEvent, eventObj]
          } :socialCell
        )
      } : profile
    ),
    profile: curProfileId === calendarOwnerId ? {
      ... state.profile,
      get_socialCal: state.profile.get_socialCal.map(
        socialCell => socialCell.id === calendarCalCellId ? {
          ... socialCell,
          get_socialCalEvent: [... socialCell.get_socialCalEvent, eventObj]
        } : socialCell
      )
    } : state.profile

  })
}

export const addSocailCalCell = (state, action) => {
  // This is gonna be used for all the 'new' cal cells
  console.log(action)
  const calendarOwnerId = action.exploreObj.socialCalCellObj.socialCalUser.id
  const calendarCalCellId = action.exploreObj.socialCalCellObj.id

  let curProfileId = ''

  if (state.profile){
    curProfileId = state.profile.id
  }

  return updateObject(state, {
    profiles: state.profiles.map(
      profile => profile.id === calendarOwnerId ? {
        ... profile,
        get_socialCal : [... profile.get_socialCal, action.exploreObj.socialCalCellObj]
      } : profile
    ),
    profile: curProfileId === calendarOwnerId ? {
      ... state.profile,
      get_socialCal: [... state.profile.get_socialCal, action.exploreObj.socialCalCellObj]
    } : state.profile
  })

}

export const addUserSocialEvent = (state, action) => {
  // This will be used to add specific people to an event that exist on your soicla calendar
  // Remember that the userObj is the person that is being added to the event


  // To make this more efficent, instead of looking for a specific event,
  // you can just replace the whole event list again

  const socialCalCellObj = action.exploreObj.socialCalCellObj
  const calendarOwnerId = action.exploreObj.socialCalCellObj.socialCalUser.id

  const userObj = action.exploreObj.userObj

  let curProfileId = ''
  // This will be used when you are the host and that the socialcalendar owner is you
  // so this makes sure it gets added to your calendar (the cur calendar)
  if (state.profile){
    curProfileId = state.profile.id
  }

  return updateObject( state, {
    profiles: state.profiles.map(
      profile => profile.id === calendarOwnerId ? {
        ... profile,
        get_socialCal: profile.get_socialCal.map(
          socialCell => socialCell.id === socialCalCellObj.id ? {
            ... socialCell,
            get_socialCalEvent: socialCalCellObj.get_socialCalEvent
          } : socialCell
        )
      } : profile
    ),
    profile: curProfileId === calendarOwnerId ? {
      ... state.profile,
      get_socialCal: state.profile.get_socialCal.map(
        socialCell => socialCell.id === socialCalCellObj.id ? {
          ... socialCell,
          get_socialCalEvent: socialCalCellObj.get_socialCalEvent
        } : socialCell
      )
    } : state.profile

  })

}

export const removeUserSocialEvent = (state, action) => {
  // What is gonna happen is first you will change all cell in profiles (all the profiles)
  // that are not including th currentProfile. You will prtty much find the host of that event
  // profile and find the right cell and just replace it, you do not need to find the specific
  // event and then remoove the user.
  // For the host you will see a user getting remove from your event, just replace the whole cell
  const socialCalCellObj = action.exploreObj.socialCalCellObj
  const calendarOwnerId = action.exploreObj.socialCalCellObj.socialCalUser.id
  const userObj = action.exploreObj.userObj


  let curProfileId = ''

  if (state.profile){
    curProfileId = state.profile.id
  }

  return updateObject(state, {
    profiles: state.profiles.map(
      profile  => profile.id === calendarOwnerId ? {
        ...profile,
        get_socialCal: profile.get_socialCal.map(
          socialCell => socialCell.id === socialCalCellObj.id ? {
            ... socialCell,
            get_socialCalEvent: socialCalCellObj.get_socialCalEvent
          } : socialCell
        )
      } : profile
    ),
    profile: curProfileId === calendarOwnerId ? {
      ... state.profile,
      get_socialCal: state.profile.get_socialCal.map(
        socialCell => socialCell.id === socialCalCellObj.id ? {
          ...socialCell,
          get_socialCalEvent: socialCalCellObj.get_socialCalEvent
        } : socialCell
      )
    } : state.profile

  })
}





const reducer = (state = initialState, action) => {
  switch(action.type){
    case actionTypes.LOAD_PROFILE:
      return loadProfile(state, action);
    case actionTypes.ADD_FOLLOWER_UNFOLLOWER:
      return addFollowerUnfollower(state, action);
    case actionTypes.CHANGE_PROFILE_PIC:
      return changeProfilePic(state, action);
    case actionTypes.ADD_SOCIAL_CELL:
      return addSocialCell(state, action)
    case actionTypes.ADD_SOCIAL_CELL_COVER_PIC:
      return addSocialCellCoverPic(state, action)
    case actionTypes.ADD_SOCIAL_EVENT_OLD:
      return addSocialEventOld(state,action)


    // delete xxx
    case actionTypes.ADD_SOCIAL_CELL_NEW:
      return addSocailCalCell(state, action)


    case actionTypes.ADD_USER_SOCIAL_EVENT:
      return addUserSocialEvent(state, action)
    case actionTypes.REMOVE_USER_SOCIAL_EVENT:
      return removeUserSocialEvent(state, action)
    default:
      return state;
  };

}

export default reducer;
