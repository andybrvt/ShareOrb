import * as actionTypes from './actionTypes';

// THESE ACITONS ARE FOR THE POST ON THE NEWSFEED
export const loadPosts = post => {
  console.log(post)
  // The arguments that will be coming it in will be a
  // dictionary that contains both postId and the number
  // of likes so you pretty much just add them to the
  // prop dict with the post id associated with the likes
  return {
    type: actionTypes.LOAD_POSTS,
    post: post.posts
  }
}

export const addPostLike = like => {
  return {
    type: actionTypes.ADD_POST_LIKE,
    like: like
  }
}

export const unaddPostLike = unlike => {
  return{
    type: actionTypes.UNADD_POST_LIKE,
    unlike: unlike
  }
}

export const addPostComment = comment => {
  return {
    type: actionTypes.ADD_POST_COMMENT,
    comment: comment
  }
}

export const deletePost = post => {
  return {
    type: actionTypes.DELETE_POST,
    postId: post.postId
  }
}



// THESE ACTIONS FOR THE INDIVIDUAL POST PAGES
export const loadPost = postObj => {
  return {
    type: actionTypes.LOAD_POST,
    postObj: postObj
  }
}
