import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";


const initialState = {

  socialPosts: [],
}


const loadSocialPosts = (state, action) => {

  return updateObject(state, {
    socialPosts: action.post
  })
}

const addSocialPostLike = (state, action) => {
  return updateObject(state, {
    socialPosts: state.socialPosts.map(
      socialPost => socialPost.id === action.postObj.contentTypeId ? {
        ...socialPost,
        post: action.postObj.socialCalCellObj
      } : socialPost
    )
  })
}


const reducer = (state = initialState, action) => {
  switch(action.type){
    case actionTypes.LOAD_SOCIAL_POSTS:
      return loadSocialPosts(state, action);
    case actionTypes.ADD_SOCIAL_POST_LIKE:
      return addSocialPostLike(state, action);
    default:
      return state;

  }
}


export default reducer;
