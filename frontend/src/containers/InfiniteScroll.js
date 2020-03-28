import React from 'react';
import axios from 'axios';
import Article from '../components/Article';
import Result from '../components/Listitems';

// Fucntion: take in all the post and then put them in an infinite scroll list
class InfiniteList extends React.PureComponent {
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
       axios.get(
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
    const { error, hasMore, loading, post} = this.state
    return (
      <div style={{overflowY: 'scroll', flex: 1}}>
      <h1>Infinite Post </h1>
      <p> Scroll down to load more </p>
      <hr />
      {post.map((j,index) => {
        return <Result data = {j} key ={index} />
      })}
      {error  && <div>{error}</div>}
      {loading && <div>Loading...</div>}
      {!hasMore && <div>No more results</div>}
     </div>
   );
  }
}

export default InfiniteList;
