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
         style={{
           position: "absolute",
           top: 0,
           left: 0,
           bottom: 0,
           right: 0,
           height: "2000px",
           background: "rgba(0, 0, 0, 0.45)"
         }}
       >
       <SocialCalCellPage />
       </div>

    )
  }
}

export default SocialCalCellModal;
