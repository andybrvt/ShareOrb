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

    if (this.props.data.owner.profile_picture){
      console.log(this.props.data.owner.profile_picture)
      profilePic = `${global.IMAGE_ENDPOINT}`+this.props.data.owner.profile_picture
    }
    return (

      <div>



      <List
        locale={{emptyText:<span/>}}
        className = 'followList'
        itemLayout = 'horizontal'
        dataSource = {this.props.data.post.people_like}
        renderItem = {item => (
        <List.Item
        className = 'followListItem'
        onClick = {this.onProfileClick}
      >
        <List.Item.Meta
          avatar={
            item.profile_picture ?
              <Avatar
              src= {`${global.IMAGE_ENDPOINT}`+item.profile_picture} />
              :
              <Avatar src={profilePic} />
            }
          title={<a href={"http://localhost:3000/explore/"+item.username}>{item.first_name} {item.last_name}</a>}
          description= {<b>{"x"} followers</b>}
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
