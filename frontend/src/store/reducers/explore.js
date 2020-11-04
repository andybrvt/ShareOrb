import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';


// Profiles will be all the profiles and profile (no s) will be the current user
// profile
const initialState = {
  showProfileEdit: false,
  changeProfilePic: false,
  profile: {},
  // curProfile: [],
  test: '',

}

export const loadProfile = (state, action) => {
  return updateObject(state, {
    profile: action.profile
  })
}


export const loadCurProfile = (state,action) =>{
  // The profile will get added in when the getcurprofile is added
  // when ever the curprofile is loaded up
  console.log(action.curProfile)
  return updateObject(state, {
    profile: action.curProfile
  })
}

export const addFollower = (state, action) => {

  return updateObject(state, {
    profile: {
      ...state.profile,
      get_followers: action.followerList
    }

  })
}

export const openProfileEdit = (state, action) =>{
  return updateObject (state, {
    showProfileEdit: true
  })
}

export const closeProfileEdit = (state, action) => {
  return updateObject (state, {
    showProfileEdit: false
  })
}


export const openChangeProfilePic = (state, action) => {
  return updateObject (state, {
    changeProfilePic: true
  })
}

export const closeChangeProfilePic = (state, action) => {
  return updateObject (state, {
    changeProfilePic: false
  })
}

export const addUnFollowing = (state, action) => {
  let profiles  = state.profiles
  let person_index = ''
  let person_profile = []
  let target_profile = []
  // The target_profile will be that of the other person
  // The perosn_profile will be that of the current user profile
  for (let i = 0; i <profiles.length; i++){
      if (profiles[i].username === action.followObject.user.username ){
        // This will remove the target from the user's following
        person_index = profiles[i]['get_following'].indexOf(action.followObject.person_unfollowing)
        person_profile = profiles[i]['get_following']
        person_profile.splice(person_index, 1)
      }
      if (profiles[i].username === action.followObject.person_unfollowing.username){
        // This is to remove the actor from the targets following
        person_index = profiles[i]['get_followers'].indexOf(action.followObject.user )
        target_profile = profiles[i]['get_followers']
        target_profile.splice(person_index, 1)
      }
  }

  return updateObject (state, {
    profiles: state.profiles.map(
      profile => profile.username === action.followObject.user.username ? {
        ...profile,
        get_following: person_profile
      } : profile.username === action.followObject.person_unfollowing.username ? {
        ...profile,
        get_followers: target_profile
      } : profile
    )
  })
}

export const addUnFollower = (state, action) => {
  // The process of this will be similar to the addUnFollowing but pretty much
  // the users will be switch up because the mina user will be the other person
  // so that we have to remove follower from them and then remove a following
  // from the other person

  let profiles = state.profiles
  let person_index = ''
  let person_profile = []
  let target_profile = []
  // In this case the person_profile will be that of the person that got the following
  // we will be removing a follower from that person
  // The target_profile will be the follower and then this function will will then remove
  // the following from that person
  for (let i = 0; i < profiles.length; i++ ){
    if(profiles[i].username === action.followObject.user.username){
      person_index = profiles[i]['get_followers'].indexOf(action.followObject.person_unfollower)
      person_profile = profiles [i]['get_followers']
      person_profile.splice(person_index, 1)
    }
    if(profiles[i].username === action.followObject.person_unfollower.username){
      person_index = profiles[i]['get_following'].indexOf(action.followObject.user)
      target_profile = profiles[i]['get_following']
      target_profile.splice(person_index, 1)
    }

  }

  return updateObject (state, {
    profiles: state.profiles.map(
      profile => profile.username === action.followObject.user.username ? {
        ...profile,
        get_followers: person_profile
      } : profile.username === action.followObject.person_unfollower.username ? {
        ...profile,
        get_following: target_profile
      } : profile
    )
  })
}



// FOR ALL THE NEW CAL CELL BEING CREATED, YOU CAN PROBALLY JUST USE ONE
// ADD NEW SOCIALCALCELL

export const addSocialLikeUnlikeOld = (state, action) => {
  // so the task here is to find the user, then find the correct cell
  // data then add in the like

  // For now I will do a double loop --> probally gonna be shit but if things seem to be better
  // and sorted I will switch to binary search
  const calendarOwnerId = action.exploreObj.socialCalCell.socialCalUser.id
  const calendarCalCellId = action.exploreObj.socialCalCell.id
  const userLike = action.exploreObj.userObj

  const calendarCells = action.exploreObj.socialCal
  let curProfileId = ''

  if (state.profile){
    curProfileId = state.profile.id
  }

  return updateObject(state, {
    profiles: state.profiles.map(
      profile => profile.id === calendarOwnerId ? {
        ... profile,
        get_socialCal: calendarCells
      } : profile
    ),
    profile: curProfileId === calendarOwnerId ? {
      ... state.profile,
      get_socialCal: calendarCells
    } : state.profile
  })
}



export const addSocialCommentOld = (state, action) =>{
  // This since the socialcell already exist so what will happen is that you will find
  // the person then find the cell, then go into the comments, and add the comment
  // obj in

  const calendarOwnerId = action.exploreObj.socialCalCell.socialCalUser.id
  const calendarCalCellId = action.exploreObj.socialCalCell.id
  const commentObj = action.exploreObj.socialComment
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
            get_socialCalComment: [...socialCell.get_socialCalComment, commentObj]
          } :socialCell
        )
      } : profile
    ),
    profile: curProfileId === calendarOwnerId ? {
      ... state.profile,
      get_socialCal: state.profile.get_socialCal.map(
        socialCell => socialCell.id === calendarCalCellId ? {
          ... socialCell,
          get_socialCalComment: [... socialCell.get_socialCalComment, commentObj]
        } : socialCell
      )
    } : state.profile

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
    case actionTypes.ADD_FOLLOWER:
      return addFollower(state, action);
    case actionTypes.LOAD_CUR_PROFILE:
      return loadCurProfile(state, action)
    case actionTypes.OPEN_PROFILE_EDIT:
      return openProfileEdit(state, action)
    case actionTypes.CLOSE_PROFILE_EDIT:
      return closeProfileEdit(state, action)
    case actionTypes.OPEN_CHANGE_PROFILE_PIC:
      return openChangeProfilePic(state, action)
    case actionTypes.CLOSE_CHANGE_PROFILE_PIC:
      return closeChangeProfilePic(state, action)
    case actionTypes.ADD_UNFOLLOWING:
      return addUnFollowing(state, action)
    case actionTypes.ADD_UNFOLLOWER:
      return addUnFollower(state, action)
    case actionTypes.ADD_SOCIAL_LIKE_UNLIKE_OLD:
      return addSocialLikeUnlikeOld(state, action)
    case actionTypes.ADD_SOCIAL_COMMENT_OLD:
      return addSocialCommentOld (state, action)
    case actionTypes.ADD_SOCIAL_EVENT_OLD:
      return addSocialEventOld(state,action)
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
