import React from 'react';
import "./SocialCalCSS/SocialCellPage.css";
import * as dateFns from 'date-fns';
import SocialCalCellPage from "./SocialCalCellPage";


class SocialCalCellModal extends React.Component{

  constructor(props){
    super(props);
    this.escFunction = this.escFunction.bind(this);
  }

  escFunction(event){
    // 27 is the keycode for esc
    if(event.keyCode === 27){
      this.back(event)
    }
  }

  componentDidMount(){
    document.addEventListener("keydown", this.escFunction, false);
  }

  componentWillUnmount(){
    document.removeEventListener("keydown", this.escFunction, false);

  }

  back = e => {
    e.stopPropagation();
    this.props.history.goBack();

  }



  render(){

    console.log(this.props)
    return(

       <div className = "socialCalCellModalBackground">
         <SocialCalCellPage
         {...this.props}
          />
        <div className = 'exitX' >
          <i class="fas fa-times"
          onClick = {this.back}
          ></i>
          </div>
       </div>


    )
  }
}


export default SocialCalCellModal;
