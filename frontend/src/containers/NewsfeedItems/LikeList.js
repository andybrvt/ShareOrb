import React from 'react';
import { List, Avatar, Modal } from 'antd';




class LikeList extends React.Component{
  constructor(props){
    super(props);
    // this.initialisePost()

    this.state = {
      like:this.props.condition,
    }
  }

  capitalize (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  onFollowItemClick = (user) => {
    window.location.href = 'explore/'+user
  }

  onProfileClick = () => {
    const user = this.props.data.username
    // this.prop.history.push('userview/'+user)
    window.location.href = 'explore/'+user;

  }


  render () {
    console.log(this.props)
    const followList = this.props.follow
    console.log(this.props.data.people_like)
    console.log(this.state.like)
    let profilePic = ''

    if (this.props.data.user.profile_picture){
      console.log(this.props.data.user.profile_picture)
      profilePic = 'http://127.0.0.1:8000'+this.props.data.user.profile_picture
    }
    return (

      <div>



      <List
      className = 'followList'
      itemLayout = 'horizontal'
      dataSource = {this.props.data.people_like}
      renderItem = {item => (
        <List.Item
        className = 'followListItem'
        onClick = {this.onProfileClick}
        >
        <List.Item.Meta
          avatar={
            item.profile_picture ?
              <Avatar src= {'http://127.0.0.1:8000'+item.profile_picture} />

              :

              <Avatar src={profilePic} />

            }
          title={<a href="https://ant.design">{item.username} {item.last_name}</a>}
          description= {<b>{item.get_followers.length} followers</b>}
        />

        {/*

          title={<a href="https://ant.design">{this.capitalize(item.username)} {this.capitalize(item.last_name)}</a>}
          description= {<b>@{this.capitalize(item.username)}</b>}
        */}
        </List.Item>
      )}
      >

      </List>

      </div>
    )
  }

}

export default LikeList;
