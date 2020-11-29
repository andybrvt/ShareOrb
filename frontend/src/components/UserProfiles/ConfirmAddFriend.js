import React from 'react';
import { Button, Modal, Avatar } from 'antd';
import ExploreWebSocketInstance from '../../exploreWebsocket';


// This will be the modal that will confirm whether or not
// you will wnat to add someone as a close friend

class ConfirmAddFriend extends React.Component{



  confirmCloseFriend = () => {
    // Thsi function will confirm the add as close friend. It will call
    // the exportwebsocket and then send information into the backend to
    // then add as friends.


    // curId will be the current user Id, they will be the one adding the
    // other person to their close friend list
    let curId = ""

    //FriendId will be the one getting added to the curId close friend list
    let friendId = ""

    if(this.props.curId){
      curId = this.props.curId
    }
    if(this.props.friendId){
      friendId = this.props.friendId
    }


    ExploreWebSocketInstance.sendAddCloseFriend(
      curId, friendId
    )


  }

  render() {

    console.log(this.props)
    return (
      <Modal
      visible = {this.props.visible}
      onCancel = {() => this.props.onClose()}
      footer = {null}
      >
        <div>
          Do you accept them as a friend?

        </div>


        <Button>
        Cancel
        </Button>
        <Button
        onClick = {() => this.confirmCloseFriend()}
        >
          Yes
        </Button>
      </Modal>

    )
  }

}

export default ConfirmAddFriend;
