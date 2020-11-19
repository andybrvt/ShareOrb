import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  //Posts will be for all the post in the newsfeed
  posts: [],

  //Post will just be the individual post it self when you open up the
  // post page
}

const loadPosts = (state, action) => {
  // state.postLikes[postId] = action.likes
  // const newPostLikes = { ...state.postLikes, }
  // So in the dictionary, the key will be the postId and the values
  // will be the number ofl likes
  return updateObject(state, {
    posts: action.post
  })
}

const addPostLike = (state, action) => {
  return updateObject(state, {
    posts: state.posts.map(
      post => post.id === action.like.postId ? {
        ...post,
        like_count : post.like_count + 1,
        people_like: [...post.people_like, action.like.userObj]
      } : post
    )
  })

}

const unaddPostLike = (state, action) => {
  let person_post = state.posts
  let person_index = ''
  let like_list = []
  for (let i = 0; i< person_post.length; i++){
    if(person_post[i].id === action.unlike.postId){
      person_index = person_post[i]['people_like'].indexOf(action.unlike.userId)
      like_list = person_post[i]['people_like']
      like_list.splice(person_index,1)
    }
  }

  // This will be the user object that unlike the post
  const likeUser = action.unlike.userObj

  function removeUnliker(unliker) {
    // use this for the filter function
    return unliker.id !== likeUser.id
  }

  return updateObject(state, {
    posts: state.posts.map(
      post => post.id === action.unlike.postId ? {
        ...post,
        people_like: post.people_like.filter(removeUnliker)
      } : post
    )
  })
}


const addPostComment = (state, action ) => {
  console.log(action.comment.comment.post)
  return updateObject(state, {
    posts: state.posts.map(
      post => post.id === action.comment.comment.post ? {
        ...post,
        post_comments: [...post.post_comments, action.comment.comment]
      } : post
    )
  })

}

const deletePost = (state, action) => {

    const postId = action.postId

    function removePost(post) {
      return post.id !== postId
    }

    return updateObject(state, {
      posts: state.posts.filter(removePost)
    })
}



// THESE FUNCTIONS WILL BE USED FOR THE POST PAGE
const loadPost =(state, action) => {
  return updateObject(state, {
    post: action.postObj
  })
}


const reducer = (state = initialState, action) => {
  switch(action.type){
    case actionTypes.LOAD_POSTS:
      return loadPosts(state, action );
    case actionTypes.ADD_POST_LIKE:
      return addPostLike(state, action);
    case actionTypes.UNADD_POST_LIKE:
      return unaddPostLike(state,action);
    case actionTypes.ADD_POST_COMMENT:
      return addPostComment(state, action);
    case actionTypes.DELETE_POST:
      return deletePost(state, action);
    case actionTypes.LOAD_POST:
      return loadPost(state, action);
    default:
      return state;
  }
}

export default reducer;
