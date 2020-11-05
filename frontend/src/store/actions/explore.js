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


// DLETE ALL 5 OF THESE
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
