import React from 'react';
import { List, Avatar } from 'antd';


class FollowList extends React.Component{

  capitalize (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }


  render () {
    console.log(this.props)
    const followList = this.props.follow

    return (
      <List
      className = 'followList'
      itemLayout = 'horizontal'
      dataSource = {followList}
      renderItem = {item => (
        <List.Item>
        <List.Item.Meta
          avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
          title={<a href="https://ant.design">{this.capitalize(item)}</a>}
          description="Ant Design, a design language for background applications, is refined by Ant UED Team"
        />
        </List.Item>
      )}
      >

      </List>


    )
  }

}

export default FollowList;
