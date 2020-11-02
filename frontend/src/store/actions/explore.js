import * as actionTypes from './actionTypes';


export const loadProfile = (profile) => {
  //This will load in the profile for the profile page
  return {
    type: actionTypes.LOAD_PROFILE,
    profile: profile
  }

}

export const addFollower = followObject => {
  // This will be for the receiving persopn
  return{
    type: actionTypes.ADD_FOLLOWER,
    followObject: followObject
  }
}

export const openProfileEdit = () =>{
  return {
    type: actionTypes.OPEN_PROFILE_EDIT
  }
}

export const closeProfileEdit = () => {
  return {
    type: actionTypes.CLOSE_PROFILE_EDIT
  }
}

export const addFollowing = followObject =>{
  // this will be for the person doing the following
  return {
    type: actionTypes.ADD_FOLLOWING,
    followObject: followObject
  }
}


export const loadProfiles = profiles => {
  console.log(profiles)
  return {
    type: actionTypes.LOAD_PROFILES,
    profiles: profiles
  }
}

export const loadCurProfile = curProfile => {
  return {
    type: actionTypes.LOAD_CUR_PROFILE,
    curProfile: curProfile
  }
}

export const openChangeProfilePic = () => {
  return {
    type: actionTypes.OPEN_CHANGE_PROFILE_PIC
  }
}

export const closeChangeProfilePic = () => {
  return {
    type: actionTypes.CLOSE_CHANGE_PROFILE_PIC
  }
}


export const addUnFollower = (followObject) => {
  // This will be used for the person getting the follower
  // basically not you
  return {
    type: actionTypes.ADD_UNFOLLOWER,
    followObject: followObject
  }
}

export const addUnFollowing = (followObject) =>{
  // This one will be used for you as the person doing the unfollowing
  return {
    type: actionTypes.ADD_UNFOLLOWING,
    followObject: followObject
  }
}

export const addSocialLikeUnlikeOld = (exploreObj) => {
  // This will be used for the social calendar liking when there is an exisiting
  // cal cell
  return {
    type: actionTypes.ADD_SOCIAL_LIKE_UNLIKE_OLD,
    exploreObj: exploreObj
  }
}

export const addSocialCommentOld = (exploreObj) => {
  // This will be used for the adding the comments when the social cell
  // is already created
  return{
    type: actionTypes.ADD_SOCIAL_COMMENT_OLD,
    exploreObj: exploreObj
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
