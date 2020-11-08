import React from 'react';
import "./SocialCalCSS/SocialCellPage.css";
import * as dateFns from 'date-fns';
import SocialCalCellPage from "./SocialCalCellPage";

class SocialCalCellModal extends React.Component{

  back = e => {
    e.stopPropagation();
    this.props.history.goBack();
  }

  render(){
    return(
      <div
        onClick  = {this.back}
        className = "socialCalCellModalBackground"
  
       >
       <SocialCalCellPage />
       </div>

    )
  }
}

export default SocialCalCellModal;
