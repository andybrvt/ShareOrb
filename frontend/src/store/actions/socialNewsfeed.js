import * as actionTypes from './actionTypes';

// This will be used for the new social newsfeed
export const loadSocialPosts = post =>{

  return {
    type: actionTypes.LOAD_SOCIAL_POSTS,
    post: post
  }
}


export const addSocialPostLike = postObj => {
  return {
    type: actionTypes.ADD_SOCIAL_POST_LIKE,
    postObj: postObj
  }
}
