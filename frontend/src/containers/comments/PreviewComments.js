import { Comment, Tooltip, List, Divider, Avatar } from 'antd';
import moment from 'moment';
import React, { createElement } from 'react';
import './PreviewComments.css'
import * as dateFns from 'date-fns';
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


  capitalize (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  renderTimestamp = timestamp =>{
    console.log(timestamp)
    let prefix = '';
    console.log(Math.round((new Date().getTime() - new Date(timestamp).getTime())/60000))
    const timeDiff = Math.round((new Date().getTime() - new Date(timestamp).getTime())/60000)
    console.log(timeDiff)
    if (timeDiff < 1 ) {
      prefix = `Just now`;
    } else if (timeDiff < 60 && timeDiff >= 1 ) {
      prefix = `${timeDiff}min`;
    }else if (timeDiff < 24*60 && timeDiff > 60) {
      prefix = `${Math.round(timeDiff/60)}h`;
    } else if (timeDiff < 31*24*60 && timeDiff > 24*60) {
      prefix = `${Math.round(timeDiff/(60*24))}days`;
    } else {
        prefix = `${dateFns.format(new Date(timestamp), "MM/dd/yy")}`;
    }

    return prefix;
  }
   render(){
     console.log(this.props.commentList)
     const actions=[
      <Tooltip title="Like">
        <i class="far fa-heart" style={{fontSize:'12px'}}></i>
        <span className="comment-action">{0}</span>
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
        style={{marginLeft:'15px'}}
        class="previewCommentListLook"
        itemLayout="horizontal"
        dataSource={this.props.commentList.slice(0, 2)}
        renderItem={(item) => (

            <Comment
              actions={actions}
              author={this.capitalize(item.commentUser.first_name)+" "+this.capitalize(item.commentUser.last_name)}
              avatar={
                <Avatar size={30} src={`${global.IMAGE_ENDPOINT}`+item.commentUser.profile_picture}/>
              }
              content={item.body}
              datetime={"few seconds ago"}
            />

          )}
      />
    </div>
    );
  }
}

export default Comments;
