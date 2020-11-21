import React from 'react';
import './UserEventList.css';
import {PictureOutlined } from '@ant-design/icons';



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
            <div className = 'noPicBox'>
            <PictureOutlined />
            <br />
              <span className = 'noPicWords'> No picture </span>
            </div>
            :
            <div className = 'picBox'>
              <img
              className = "picBoxPic"
              src = {'http://127.0.0.1:8000'+socialEventList[i].backgroundImg} />
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
