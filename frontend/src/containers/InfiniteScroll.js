
import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import NewsFeedPost from '../containers/NewsfeedItems/NewsFeedPost';
import { authAxios } from '../components/util';
import './InfiniteScroll.css';
import WebSocketPostsInstance from  '../postWebsocket';


// Fucntion: take in all the post and then put them in an infinite scroll list
class InfiniteList extends React.Component {
  constructor(props){
    super(props);
    this.initialisePost()
    this.state = {
      error: false,
      loading: false,
      post: [],
      hasMore: true,
      offset: 0,
      limit: 3,
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
         'http://127.0.0.1:8000/userprofile/infinite-post/?limit='+limit+'&offset='+offset

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
    let post = this.props.posts

    // {error  && <div>{error}</div>}
    // {loading && <div>Loading...</div>}
    // {!hasMore && <div>No more results</div>}

    return (


      <div style={{ flex: 1}}>

        <div class="intro" style={{color:'black', fontSize:25, marginTop:'40px'}}>
          Welcome, {this.props.data.username}. Here's what's going on today! </div>

        <hr style={{marginBottom:'25px'}} />

        {post.map((j,index) => {
          return <NewsFeedPost
            history = {this.props.data.history}
           data = {j}  />
        })}

     </div>
   );
  }
}

const mapStateToProps = state => {
  return {
    id: state.auth.id,
    friends: state.auth.friends,
    posts: state.newsfeed.posts
  }
}

export default connect(mapStateToProps)(InfiniteList);
