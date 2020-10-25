import React from 'react';
import SocialEventInfo from "./SocialEventInfo";
import SocialEventGroupChat from "./SocialEventGroupChat";
import "./SocialEventPage.css"

class SocialEventPage extends React.Component{


  render(){
    return (
      <div className = "socialEventPageContainer">

      <SocialEventInfo />


      <SocialEventGroupChat />
      </div>
    )
  }
}

export default SocialEventPage;
