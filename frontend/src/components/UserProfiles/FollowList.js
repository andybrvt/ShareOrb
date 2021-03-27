import React from 'react';
import { List, Avatar } from 'antd';
import defaultPicture from '../images/default.png';



class FollowList extends React.Component{

  capitalize (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  onFollowItemClick = (user) => {
    window.location.href = '/explore/'+user
  }

  viewUserPage = (username) => {
    window.location.href = '/explore/'+username
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
        <List.Item
        className = 'followListItem'
        onClick = {() => this.onFollowItemClick(item.username)}
        >
        <List.Item.Meta
          avatar={
            item.profile_picture ?

              <Avatar src= {`${global.IMAGE_ENDPOINT}`+item.profile_picture} />

              :

              <Avatar src={defaultPicture} />

            }
          title={
            <a onClick = {() => this.viewUserPage(item.username)}>
              {this.capitalize(item.first_name)} {this.capitalize(item.last_name)}
            </a>
          }
          description= {<b>@{item.username}</b>}
        />
        </List.Item>
      )}
      >

      </List>


    )
  }

}

export default FollowList;
