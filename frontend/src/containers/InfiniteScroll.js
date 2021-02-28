
import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import NewsFeedPost from '../containers/NewsfeedItems/NewsFeedPost';
import SocialNewsfeedPost from '../containers/NewsfeedItems/SocialNewsfeedPost';
import SocialEventNewsfeedPost from '../containers/NewsfeedItems/SocialEventNewsfeedPost';
import { authAxios } from '../components/util';
import './InfiniteScroll.css';
import WebSocketPostsInstance from  '../postWebsocket';
import { Divider } from 'antd';
import Spinner from './Spinner.js';

import LazyLoad from 'react-lazyload';

const TestSpinner = () => {

    return (
      <div className = "post loading">
        <h5> Loading ...</h5>
      </div>
    )


}

// Fucntion: take in all the post and then put them in an infinite scroll list
class InfiniteList extends React.Component {
  constructor(props){
    super(props);
    // this.initialisePost()
    this.state = {
      error: false,
      loading: false,
      post: [],
      hasMore: true,
      offset: 0,
      limit: 3,
      newsfeedLoad:false,
    };
    window.onscroll = () => {
      const {
        loadPost,
        state: { error, loading, hasMore} } = this;
      if (error || loading || !hasMore) return;
      if (document.documentElement.scrollHeight -
        document.documentElement.scrollTop ===
        document.documentElement.clientHeight
      ) {  //call some loading METHOD
        loadPost();
      }
    };
  }

  initialisePost(){
    this.waitForSocketConnection(() =>{
      WebSocketPostsInstance.fetchPosts(this.props.id)
      // WebSocketPostsInstance.fetchComments(this.props.data.id)
    })
  }

  waitForSocketConnection(callback){
    const component = this
    setTimeout(
      function(){
        if(WebSocketPostsInstance.state() ===1){
          callback();
          return;
        } else {
          component.waitForSocketConnection(callback);
        }
      }, 100)
  }


  componentDidMount() {
    // WebSocketPostsInstance.connect()

  }

  componentWillMount() {
    this.loadPost();
    // WebSocketPostsInstance.connect()

  };

  loadPost = () => {
     this.setState({loading: true}, () => {
       const {offset, limit} = this.state;
       authAxios.get(
         `${global.API_ENDPOINT}/userprofile/infinite-post/?limit=`+limit+'&offset='+offset

       )
       .then(res => {
         const newPost = res.data.post;
         const hasMore = res.data.has_more;
         this.setState({
           hasMore,
           loading: false,
           post:  [...this.state.post, ...newPost],
           offset: offset + limit,
         });
       })
       .catch(err => {
         this.setState({
           error: err.message,
           loading: false
         });
       });
     });
  };

  render () {
    console.log(this.props)
    // const { error, hasMore, loading, post} = this.state
    let post = []

    if(this.props.socialPosts){
      post = this.props.socialPosts
    }

    // {error  && <div>{error}</div>}
    // {loading && <div>Loading...</div>}
    // {!hasMore && <div>No more results</div>}

    return (

      <div>


          <div style={{ flex: 1}}>

            <div class="intro" style={{color:'black', fontSize:'20px', marginTop:'25px'}}>
              Welcome, {this.props.userName}. Here's what's going on today! </div>
            <Divider style={{marginBottom:'25px'}}/>
            {post.map((j,index) => {
              return(

                <div>

                  {
                    j.post.get_socialCalItems ?

                    <SocialNewsfeedPost
                    history = {this.props.data.history}
                     data = {j}  />

                   :


                   <div></div>


                  }



                </div>



              )


            })}

         </div>

      </div>
   );
  }
}

const mapStateToProps = state => {
  return {
    id: state.auth.id,
    userName: state.auth.username,
    friends: state.auth.friends,
    posts: state.newsfeed.posts,
    socialPosts: state.socialNewsfeed.socialPosts
  }
}

export default connect(mapStateToProps)(InfiniteList);
