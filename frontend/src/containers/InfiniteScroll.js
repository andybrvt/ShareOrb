import React from 'react';
import axios from 'axios';

import NewsFeedPost from '../containers/NewsfeedItems/NewsFeedPost';
import { authAxios } from '../components/util';
import './InfiniteScroll.css';

// Fucntion: take in all the post and then put them in an infinite scroll list
class InfiniteList extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      error: false,
      loading: false,
      post: [],
      hasMore: true,
      offset: 0,
      limit: 1,
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

  componentWillMount() {
    this.loadPost();
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
    const { error, hasMore, loading, post} = this.state
    return (

      <div style={{ flex: 1}}>
        <div className="testFont" style={{color:'black', fontSize:25}}> Welcome {this.props.data.username}. Here's what's going on today! </div>

      <hr />
      {post.map((j,index) => {
        return <NewsFeedPost data = {j}  />
      })}
      {error  && <div>{error}</div>}
      {loading && <div>Loading...</div>}
      {!hasMore && <div>No more results</div>}
     </div>
   );
  }
}

export default InfiniteList;
