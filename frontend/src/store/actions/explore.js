import * as actionTypes from './actionTypes';


export const loadProfile = (profile) => {
  //IMPROVED
  //This will load in the profile for the profile page
  return {
    type: actionTypes.LOAD_PROFILE,
    profile: profile
  }

}

export const addFollowerUnfollower = followerList => {
//IMPROVED
  // This will be for the receiving persopn (both for following and unfollowing)
  return{
    type: actionTypes.ADD_FOLLOWER_UNFOLLOWER,
    followerList: followerList
  }
}

export const changeProfilePic = profilePic => {
  //IMPROVED
  //Use to change the profile pic of the current user
  return {
    type: actionTypes.CHANGE_PROFILE_PIC,
    profilePic: profilePic
  }
}

export const addSocialCell = (newSocialCellObj) => {
  //IMPROVED
  //This will just add in a new cell object
  return {
    type: actionTypes.ADD_SOCIAL_CELL,
    socialCellObj: newSocialCellObj
  }
}

export const addSocialCellCoverPic = (coverPicture, cellId) => {
  //IMPROVED
  // This will add the cover picture into cells that already exist
  return{
    type: actionTypes.ADD_SOCIAL_CELL_COVER_PIC,
    coverPicture: coverPicture,
    cellId: cellId
  }
}

export const addSocialEventJoinLeave = (socialEventList, cellId) =>{
  //IMPROVED
  // This will be add new events in to the cover of the social day cell
  // We will just be replacing the whole list

  //Used for joining and leaving events too
  return {
    type: actionTypes.ADD_SOCIAL_EVENT_JOIN_LEAVE,
    socialEventList: socialEventList,
    cellId: cellId
  }
}
