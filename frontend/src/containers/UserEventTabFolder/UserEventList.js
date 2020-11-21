import React from 'react';
import './UserEventList.css';


class UserEventList extends React.Component{

  renderEventCells = () => {
    console.log(this.props)

    let socialEventList = []
    if(this.props.events){
      socialEventList = this.props.events
    }

    if(socialEventList.length !== 0){
      var boxes = []
      for(let i = 0; i< socialEventList.length; i++){
        boxes.push(
          <div className = "eventContainer">
          {
            socialEventList[i].backgroundImg === null ?
            <div className = ''>
              Hi
            </div>
            :
            <div className = ''>
            hey
            </div>
          }

          </div>
        )
      }


      return <div className = "eventListContainer"> {boxes} </div>
    } else {
      return <div> No Events </div>
    }
  }


  render(){
    console.log(this.props)
    return (
      <div className = "eventListTabContainer">

        {this.renderEventCells()}

      </div>
    )
  }
}

export default UserEventList;
