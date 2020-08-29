import * as actionTypes from './actionTypes';

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

export const addSocialLikeNew = (exploreObj) => {
  // This will be used for the social calendar liking when there is a new cal cell
  return{
    type: actionTypes.ADD_SOCIAL_LIKE_NEW,
    exploreObj: exploreObj
  }
}

export const addSocialLikeOld = (exploreObj) => {
  // This will be used for the social calendar liking when there is an exisiting
  // cal cell
  return {
    type: actionTypes.ADD_SOCIAL_LIKE_OLD,
    exploreObj: exploreObj
  }
}

export const addSocialUnLike = (exploreObj) => {
  // This will be used for unliking the socialcals
  return{
    type: actionTypes.ADD_SOCIAL_UNLIKE,
    exploreObj: exploreObj
  }
}
