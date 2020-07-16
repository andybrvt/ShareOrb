import { Comment, Tooltip, List } from 'antd';
import moment from 'moment';
import React from "react";


class Comments extends React.Component {

  state = {

  }



  render() {
    console.log(this.props)
    console.log(this.props.newsfeed)
    console.log(this.props.newsfeed.data)
    console.log(this.props.newsfeed.data.post_comments)

    const data = [
      {
        actions: [<span key="comment-list-reply-to-0">Reply to</span>],
        author: 'Han Solo',
        avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
        content: (
          <p>
            We supply a series of design principles, practical patterns and high quality design
            resources (Sketch and Axure), to help people create their product prototypes beautifully and
            efficiently.
          </p>
        ),
        datetime: (
          <Tooltip
            title={moment()
              .subtract(1, 'days')
              .format('YYYY-MM-DD HH:mm:ss')}
          >
            <span>
              {moment()
                .subtract(1, 'days')
                .fromNow()}
            </span>
          </Tooltip>
        ),
      },
      {
        actions: [<span key="comment-list-reply-to-0">Reply to</span>],
        author: 'Han Solo',
        avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
        content: (
          <p>
            We supply a series of design principles, practical patterns and high quality design
            resources (Sketch and Axure), to help people create their product prototypes beautifully and
            efficiently.
          </p>
        ),
        datetime: (
          <Tooltip
            title={moment()
              .subtract(2, 'days')
              .format('YYYY-MM-DD HH:mm:ss')}
          >
            <span>
              {moment()
                .subtract(2, 'days')
                .fromNow()}
            </span>
          </Tooltip>
        ),
      },
    ];

    let locale = {
      emptyText: 'Abc',
    };
    return (
      <div class="fontTest maxHeightPost">
        <List
          className="comment-list"

          itemLayout="horizontal"
          dataSource={this.props.newsfeed.data.post_comments.slice(0, 3)}
          renderItem={item => (
            <li>
              <Comment

                locale={locale}
                actions={item.actions}
                author={item.name}
                avatar={"https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"}
                content={item.body}
                datetime={item.datetime}
              />
            </li>
          )}
        />
      </div>
    );
  }
}

export default Comments;
