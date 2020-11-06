import React from 'react';


class testModal extends React.Component{

  back = e => {
    e.stopPropagation();
    this.props.history.goBack();
  }

  render(){
    console.log(this.props)
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
           background: "rgba(0, 0, 0, 0.15)"
         }}
       >
         <div
           className="modal"
           style={{
             position: "absolute",
             background: "red",
             top: 25,
             left: "10%",
             right: "10%",
             padding: 15,

             border: "2px solid #444"
           }}
         >
           <h1>HI there boyds</h1>

           <button type="button"
            >
             Close
           </button>
         </div>
       </div>
    )
  }
}

export default testModal;
