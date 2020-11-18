import React from 'react';
import UserPostPage from './UserPostPage';
import "./UserPostPage.css";


// This file will be used to hold the post modal. This will have its own
// channels, it will make liking and commenting faster

class UserPostModal extends React.Component{
  back = e => {
    // This is used to go back to previous page
    e.stopPropagation();
    this.props.history.goBack();

  }


  render(){
    console.log(this.props)

    return(
      <div
      className = "userPostModalBackground"
      >
        <UserPostPage />
        <div className = 'exitX'>
        <i class="fas fa-times"
        onClick = {this.back}
        ></i>
        </div>
      </div>
    )
  }
}

export default UserPostModal;
