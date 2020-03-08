import React from 'react';
import { List, Avatar, Icon } from 'antd';
//This is just to load up the default image, probally delete soon
const IconText = ({ type, text }) => (
  <span>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </span>
);


const Article = (props) => {
	return (
			<List
		    itemLayout="vertical"
		    size="large"
		    pagination={{
		      onChange: (page) => {
		        console.log(page);
		      },
		      pageSize: 3,
		    }}
		    dataSource={props.data}
		    footer={
		      <div>
		        <b>ant design</b> footer part
		      </div>
		    }
		    renderItem={item => (
		      <List.Item
		        key={item.title}
		        actions={[
		          <IconText type="star-o" text="156" key="list-vertical-star-o" />,
		          <IconText type="like-o" text="156" key="list-vertical-like-o" />,
		          <IconText type="message" text="2" key="list-vertical-message" />,
		        ]}
		        extra={
		          <img
		            width={272}
		            alt="logo"
		            src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
		          />
		        }
		      >
		        <List.Item.Meta
		          avatar={<Avatar src={item.first_name} />}
		          title={<a href={'/article/'+item.id}>{item.last_name}</a>}

		        />
		        {item.content}
		      </List.Item>
		    )}
		  />
		)

}


export default Article;
