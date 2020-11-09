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

    console.log(this.props)
    return(
      <div
        // onClick  = {this.back}
        className = "socialCalCellModalBackground"

       >
       <SocialCalCellPage
       {...this.props}
        />
       <div className = 'exitX'>
       <i class="fas fa-times"
       onClick = {this.back}
       ></i>
       </div>


       </div>

    )
  }
}


export default SocialCalCellModal;
