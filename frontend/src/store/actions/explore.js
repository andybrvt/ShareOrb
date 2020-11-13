import * as actionTypes from './actionTypes';


export const loadProfile = (profile) => {
  //This will load in the profile for the profile page
  return {
    type: actionTypes.LOAD_PROFILE,
    profile: profile
  }

}

export const addFollowerUnfollower = followerList => {
  // This will be for the receiving persopn (both for following and unfollowing)
  return{
    type: actionTypes.ADD_FOLLOWER_UNFOLLOWER,
    followerList: followerList
  }
}

export const changeProfilePic = profilePic => {
  //Use to change the profile pic of the current user
  return {
    type: actionTypes.CHANGE_PROFILE_PIC,
    profilePic: profilePic
  }
}

export const addSocialCell = (newSocialCellObj) => {
  //This will just add in a new cell object
  return {
    type: actionTypes.ADD_SOCIAL_CELL,
    socialCellObj: newSocialCellObj
  }
}

export const addSocialCellCoverPic = (coverPicture, cellId) => {
  // This will add the cover picture into cells that already exist
  return{
    type: actionTypes.ADD_SOCIAL_CELL_COVER_PIC,
    coverPicture: coverPicture,
    cellId: cellId
  }
}

export const addSocialEvent = (socialEventList, cellId) => {
  // This will be add new events in to the cover of the social day cell
  // We will just be replacing the whole list
  return {
    type: actionTypes.ADD_SOCIAL_EVENT,
    socialEventList: socialEventList,
    cellId: cellId
  }
}




export const addSocialEventOld = (exploreObj) => {
  // This will be used to add the events in when you are creating an event
  // old socialCal
  return{
    type: actionTypes.ADD_SOCIAL_EVENT_OLD,
    exploreObj: exploreObj
  }
}

export const addUserSocialEvent = (exploreObj) => {
  // This will be used to add the user to the correct event
  return {
    type: actionTypes.ADD_USER_SOCIAL_EVENT,
    exploreObj: exploreObj
  }
}

export const removeUserSocialEvent = (exploreObj) => {
  // This will be used to remove a user from the correct event
  return{
    type: actionTypes.REMOVE_USER_SOCIAL_EVENT,
    exploreObj: exploreObj
  }
}


export const addSocialCalCellNew = (exploreObj) => {

  return {
    type: actionTypes.ADD_SOCIAL_CELL_NEW,
    exploreObj: exploreObj
  }
}
