import { Comment, Tooltip, List, Divider } from 'antd';
import moment from 'moment';
import React, { createElement } from 'react';
import './PreviewComments.css'
import { DislikeOutlined, LikeOutlined, DislikeFilled, LikeFilled } from '@ant-design/icons';
class Comments extends React.Component {

  state = {
    likes:0,
    dislike:0,
    action:'',
  };

  like = () => {
    this.setState({
      likes:this.state.likes+1,
      action:'liked'
    });
  };


  dislike = () => {
    this.setState({
      dislike:this.state.dislike+1,
      action:'disliked'
    });
  };



   render(){
     console.log(this.props.newsfeed.data.post_comments)
     const actions=[

       <Tooltip key="comment-basic-like" title="Like">


         <LikeFilled/>

        <span className="comment-action">{2}</span>

    </Tooltip>,

    <span key="comment-basic-reply-to">Reply to</span>


     ];

     const data = [
  {

    datetime: (
      <Tooltip
        title={moment().subtract(2, "days").format("YYYY-MM-DD HH:mm:ss")}
      >
        <span>{moment().subtract(2, "days").fromNow()}</span>
      </Tooltip>
    )
  }
];

    return (
      <div>
      <List
  className="comment-list"
  itemLayout="horizontal"
  dataSource={this.props.newsfeed.data.post_comments.slice(0, 2)}
  renderItem={(item) => (
    <li>
      <Comment

      actions={actions}
      author={item.name}
      avatar={`${global.IMAGE_ENDPOINT}`+item.commentUser.profile_picture}
      content={item.body}
      datetime={"few seconds ago"}
      />
    </li>
  )}
/>
      </div>
    );
  }
}

export default Comments;
