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

  handleOk = e => {
    console.log(e);
    console.log(this.state.like)
    this.setState({
      like: !this.state.like,
    });
    console.log(this.state.like)
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      like: !this.state.like,
    });
  };
  capitalize (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  onFollowItemClick = (user) => {
    window.location.href = 'explore/'+user
  }


  render () {
    console.log(this.props)
    const followList = this.props.follow
    console.log(this.props)
    console.log(this.state.like)
    return (

      <div>
        <Modal
          class="modalOuterContainer"
          title={`Post by ${this.props.data.user.username}`}
          visible={this.state.like}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width="1600px"
          height="800px"
          style={{marginTop:'-50px'}}
          >


          testsetestses

          </Modal>

      {/*
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
      */}
      </div>
    )
  }

}

export default LikeList;
