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
        class="socialParent"

       >
       <div className = "socialCalCellModalBackground">
         <SocialCalCellPage
         {...this.props}
          />
        <div className = 'exitX' style={{padding:'20px'}}>
          <i class="fas fa-times" style={{fontSize:'30px'}}
          onClick = {this.back}
          ></i>
          </div>
       </div>




       </div>

    )
  }
}


export default SocialCalCellModal;
