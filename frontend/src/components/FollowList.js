import React from 'react';
import { List, Avatar } from 'antd';
import defaultPicture from './images/default.png';



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
          avatar={
            item.profile_picture ?
              <Avatar src= {'http://127.0.0.1:8000'+item.profile_picture} />

              :

              <Avatar src={defaultPicture} />

            }
          title={<a href="https://ant.design">{this.capitalize(item.first_name)} {this.capitalize(item.last_name)}</a>}
          description= {<b>@{this.capitalize(item.username)}</b>}
        />
        </List.Item>
      )}
      >

      </List>


    )
  }

}

export default FollowList;
