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


const reducer = (state = initialState, action) => {
  switch(action.type){
    case actionTypes.LOAD_SOCIAL_POSTS:
      return loadSocialPosts(state, action);
    default:
      return state;

  }
}


export default reducer;
