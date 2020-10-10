import React from 'react';
import './EventPage.css';

class EventInfo extends React.Component{


  render(){
    let username = ''
    let title = ''
    if(this.props.info){
      if(this.props.info.host){
        username = this.props.info.host.username
      }
      if(this.props.info.title){
        title = this.props.info.title
      }
    }

    return(
      <div className = 'eventInfoContainer'>
      Host: {username}
      <br />
      Title: {title}

      </div>

    )
  }
}

export default EventInfo;
