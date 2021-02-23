import React from 'react';
import "./NewsFeedView.css";
import { Avatar, List, Card } from 'antd';
import * as dateFns from 'date-fns';
import { Link } from 'react-router-dom';
import { connect } from "react-redux";


class NewsfeedButtonContainer extends React.Component{

  capitalize (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  eventTitle = (eventTitle) => {
    let name = eventTitle
    if(name.length > 50 ){
      name = name.substring(0,50) +"..."
    }

    return name
  }

  render(){

    console.log(this.props)

    let profilePic = ""
    let username = ""
    let curSocialCalCell = {}
    let curItems = []
    let dayCaption = ""
    let picExist = false

    const curDate = new Date()
		const cellYear = dateFns.getYear(curDate)
		const cellMonth = dateFns.getMonth(curDate)+1
		const cellDay = dateFns.getDate(curDate)

    if(this.props.profilePic){
      profilePic = this.props.profilePic
    }
		if(this.props.username){
			username = this.props.username
		}
    if(this.props.curSocialCalCell){
      curSocialCalCell = this.props.cur
      if(this.props.curSocialCalCell.get_socialCalItems){
        curItems = this.props.curSocialCalCell.get_socialCalItems
        if(this.props.curSocialCalCell.get_socialCalItems.length > 0){
          picExist = true

        }
      }
      if(this.props.curSocialCalCell.dayCaption){
        dayCaption = this.props.curSocialCalCell.dayCaption
      }

    }

    const location = this.props.location.pathname;

    const data = [
      {
        title: 'Title 1',
      },
      {
        title: 'Title 2',
      },
      {
        title: 'Title 3',
      },
      {
        title: 'Title 4',
      },
    ];

    console.log(picExist)

    return (
      <div className = "newUpdateButtonContainer">


        <div
          onClick = {this.props.postCondition}

           className ="upperTopContainer">



          <div className = "upperTopLeftContainer">
            <div className = "avatarHolder">
              <Avatar size = {45} src  = {`${global.IMAGE_ENDPOINT}`+profilePic} />
            </div>

          </div>

          <div className = "upperTopRightContainer">
            {
              dayCaption.length > 0 ?

              <div
                onClick = {this.props.postCondition}
                 className = "writeAPostText">
                {this.eventTitle(this.capitalize(dayCaption))}
              </div>

              :

              <div
                onClick = {this.props.postCondition}
                 className = "writeAPostText">
                Write a post...
              </div>

            }

          </div>



        </div>

        <div
          onClick = {this.props.postCondition}

          className = {`upperBottomContainer
            ${picExist ? "": "undisplayMid"}
              ` }>
          <div className = "newPictureHolder">
            <List
               grid={{ gutter: 16, column: curItems.length }}

               dataSource = {curItems}
               renderItem={item => (
                <List.Item>
                  <div className = "miniPics">
                    <img src = {`${global.IMAGE_ENDPOINT}`+ item.itemImage} />
                  </div>
                </List.Item>
              )}
              />


            <div
              onClick = {this.props.postCondition}
              className = "circlePlus">
              <i class="fas fa-plus-circle"></i>
            </div>



          </div>

        </div>


        <div className = "newBottomButtonHolder">
          <div className = "leftPart">

            <div className = "newButtonCard">
              <div className = "textCenter">
                <i class="fas fa-plus" style={{fontSize:'20px', color:'#1890ff'}}></i>
                 <p style={{ color:'#1890ff'}} class=""> Create event  </p>
              </div>
            </div>




          </div>

          <div className = "rightPart">

            <Link to = {{
              pathname:"/socialcal/"+username+"/cell/"+cellYear+"/"+cellMonth+"/"+cellDay,
              state:{pathname:location}
            }}
            className = "topCard"
             >
             <div className = "newButtonCard">
               <div className = "textCenter">
                 <i class="far fa-image" style={{fontSize:'20px',
                    color:'#1890ff'}}></i>
                  <p  class=""> View album </p>
               </div>
             </div>

           </Link>


          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    curSocialCalCell: state.socialNewsfeed.curSocialCell

  }
}

export default connect(mapStateToProps)(NewsfeedButtonContainer);
