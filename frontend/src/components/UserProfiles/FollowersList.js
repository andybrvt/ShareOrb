import React from 'react';
import { List, Avatar, Button, message } from 'antd';
import defaultPicture from '../images/default.png';
import { authAxios } from '../util';
import NotificationWebSocketInstance from '../../notificationWebsocket';
import ExploreWebSocketInstance from '../../exploreWebsocket';

// This will be similar to the followList but will be used for the followers
// to handle request as well

class FollowersList extends React.Component{

  onFollow = (privatePro, follower, following) => {
    // This function will be used to handle the follow or request
    // The parameter privatePro will be used to see if the account is private or not
    // to send the right request
    // The parameterfollower will you, and following will be the person you are
    // trying to follow.

    console.log(privatePro, follower, following)
    if(privatePro === true) {
      // if true then the perosn profile will be private and then when you click
      // follow it will show a reqeust instead of followed

      // Make an axios call here that creates taht sent request event and update
      // it in the front end and then send a notification to the other person

      authAxios.post(`${global.API_ENDPOINT}/userprofile/sendFollowRequest`, {
        follower: follower,
        following: following
      })
      .then(res => {
        console.log(res.data)

        // update your redux first and then send a notificaiton to the other person
        // and update their auth too as well
        this.props.updateSentRequestList(res.data)


        const notificationObject = {
          command: 'send_follow_request_notification',
          actor: follower,
          recipient: following
        }
        // ADD THE NOTIFICATIONI HERE TO UPDATE THE FOLLOWING AUTH
        NotificationWebSocketInstance.sendNotification(notificationObject)


      })
      // const notificationObject = {
      //   command: 'send_follow_request_notification',
      //   actor: follower,
      //   recipient: following
      // }
      //
      // // add auth here
      //
      // // Simlar to the personal profile but without sending it throught he weboscket
      // NotificationWebSocketInstance.sendNotification(notificationObject)


    } else {
      // This will be for when it is not a private event
      authAxios.post(`${global.API_ENDPOINT}/userprofile/onFollow`, {
        follower: follower,
        following: following
      })
      .then(res => {
        console.log(res.data)
        this.props.updateFollowing(res.data)
        // Send a notification to the other person here
        const notificationObject = {
          command: 'send_follow_notification',
          actor: follower,
          recipient: following
        }
        NotificationWebSocketInstance.sendNotification(notificationObject)
      })
    }
  }

  onUnfollow = (follower, following) => {
    // This will unfollow the person
    authAxios.post(`${global.API_ENDPOINT}/userprofile/onUnfollow`, {
      follower: follower,
      following: following
    })
    .then(res => {
      console.log(res.data)
      this.props.updateFollowing(res.data)
      // This will unsend the follow notification if the person decides to unfollow
      const notificationObject = {
        command: 'unsend_follow_notification',
        actor: follower,
        recipient: following
      }
      NotificationWebSocketInstance.sendNotification(notificationObject)
    })
  }

  capitalize (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  onFollowItemClick = (user) => {
    window.location.href = '/explore/'+user
  }

  successFollow = () => {
    message.success('You accepted a follower.');
  };

  viewUserPage = (username) => {
    window.location.href = '/explore/'+username
  }

  onAcceptFollow = (follower, following) => {
    // Pretty much for accepting the onAccept follow on the users page

    console.log(follower, following)
    authAxios.post(`${global.API_ENDPOINT}/userprofile/approveFollow`, {
      follower: follower,
      following: following
    })
    .then(res => {
      this.props.updateFollowers(res.data)

      ExploreWebSocketInstance.sendAcceptFollowing(follower)

      const notificationObj = {
        command: 'unsend_follow_request_notification',
        actor: follower,
        recipient: following
      }
      NotificationWebSocketInstance.sendNotification(notificationObj)

      // Now you have to send a notification ot the other perosn saying
      // that you accept their request

      const notificationObject = {
        command: 'accept_follow_request',
        actor: following,
        recipient: follower
      }
      // Then send out a notification
      NotificationWebSocketInstance.sendNotification(notificationObject)

      this.successFollow()

    })

  }

  renderRequestList = () => {
    let requestList = []
    let request = []
    if(this.props.request){
      request = this.props.request
    }

    for(let i = 0; i< request.length; i++){
      requestList.push(
        <List.Item
        className = 'followListItem'
        // onClick = {() => this.onFollowItemClick(request[i].username)}
        >
        <List.Item.Meta
          avatar={
            request[i].profile_picture ?

              <Avatar src= {`${global.IMAGE_ENDPOINT}`+request[i].profile_picture} />

              :

              <Avatar src={defaultPicture} />

            }
          title={
        <span>
          <a>{this.capitalize(request[i].first_name)} {this.capitalize(request[i].last_name)}</a>  <span
            style = {{color: "red"}}
            > *Request* </span>
        </span>
          }
          description= {<b>@{this.capitalize(request[i].username)}</b>}
        />
      <Button
        onClick = {() => this.onAcceptFollow(request[i].id, this.props.curId)}
        type = "primary">
          Accept
        </Button>
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
          title={
            <a onClick = {() => this.viewUserPage(followers[i].username)}>
              {this.capitalize(followers[i].first_name)} {this.capitalize(followers[i].last_name)}
            </a>
          }
          description= {<b>@{followers[i].username}</b>}
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

    let curId = 0
    let profileId = -1
    let pathname = ""
    if(this.props.curId){
      curId = this.props.curId
    }
    if(this.props.profileId){
      profileId = this.props.profileId
    }
    if(this.props.location){
      pathname = this.props.location.pathname
    }

    return (
      <div>

        <List
        className = 'followList'
        itemLayout = 'horizontal'
        // dataSource = {followList}
        // renderItem = {item => (

        >
        {
          curId === profileId || pathname === "/home" ?
          this.renderRequestList()
          :

          <div></div>
        }

        {this.renderFollowList()}
        </List>



      </div>


    )
  }

}

export default FollowersList;
