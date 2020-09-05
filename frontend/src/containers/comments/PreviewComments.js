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

     const actions=[

         <Tooltip key="comment-basic-like" title="Like">
           <span>

              <LikeFilled/>

             <span className="comment-action">{2}</span>
           </span>
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
  header={`${data.length} replies`}
  itemLayout="horizontal"
  dataSource={this.props.newsfeed.data.post_comments.slice(0, 2)}
  renderItem={(item) => (
    <li>
      <Comment
      class="commentLook"
      actions={actions}
      author={item.name}
      avatar={"https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"}
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
