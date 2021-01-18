import React from 'react';
import { List, Avatar } from 'antd';
import defaultPicture from '../images/default.png';

// This will be similar to the followList but will be used for the followers
// to handle request as well

class FollowersList extends React.Component{

  capitalize (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  onFollowItemClick = (user) => {
    window.location.href = '/explore/'+user
  }

  renderRequestList = () => {
    let requestList = []
    const request = this.props.request
    for(let i = 0; i< request.length; i++){
      requestList.push(
        <List.Item
        className = 'followListItem'
        onClick = {() => this.onFollowItemClick(request[i].username)}
        >
        <List.Item.Meta
          avatar={
            request[i].profile_picture ?

              <Avatar src= {`${global.IMAGE_ENDPOINT}`+request[i].profile_picture} />

              :

              <Avatar src={defaultPicture} />

            }
          title={<a href="https://ant.design">{this.capitalize(request[i].first_name)} {this.capitalize(request[i].last_name)}</a>}
          description= {<b>@{this.capitalize(request[i].username)}</b>}
        />
        </List.Item>
      )
    }

    return requestList

  }


  renderFollowList = () => {

    let followList = []
    const followers = this.props.follow
    for(let i = 0; i< followers.length; i++){
      followList.push(
        <List.Item
        className = 'followListItem'
        onClick = {() => this.onFollowItemClick(followers[i].username)}
        >
        <List.Item.Meta
          avatar={
            followers[i].profile_picture ?

              <Avatar src= {`${global.IMAGE_ENDPOINT}`+followers[i].profile_picture} />

              :

              <Avatar src={defaultPicture} />

            }
          title={<a href="https://ant.design">{this.capitalize(followers[i].first_name)} {this.capitalize(followers[i].last_name)}</a>}
          description= {<b>@{this.capitalize(followers[i].username)}</b>}
        />
        </List.Item>
      )
    }

    return followList

  }

  render () {
    console.log(this.props)
    const followList = this.props.follow
    const requestList = this.props.request

    return (
      <div>

        <List
        className = 'followList'
        itemLayout = 'horizontal'
        // dataSource = {followList}
        // renderItem = {item => (
        //   <List.Item
        //   className = 'followListItem'
        //   onClick = {() => this.onFollowItemClick(item.username)}
        //   >
        //   <List.Item.Meta
        //     avatar={
        //       item.profile_picture ?
        //
        //         <Avatar src= {`${global.IMAGE_ENDPOINT}`+item.profile_picture} />
        //
        //         :
        //
        //         <Avatar src={defaultPicture} />
        //
        //       }
        //     title={<a href="https://ant.design">{this.capitalize(item.first_name)} {this.capitalize(item.last_name)}</a>}
        //     description= {<b>@{this.capitalize(item.username)}</b>}
        //   />
        //   </List.Item>
        // )}
        >
        {this.renderRequestList()}
        {this.renderFollowList()}
        </List>



      </div>


    )
  }

}

export default FollowersList;
