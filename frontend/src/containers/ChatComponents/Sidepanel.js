import React ,{useState, useEffect } from 'react';
import Contact from './Contacts';
import { authAxios } from '../../components/util';
import { connect } from "react-redux";
import * as navActions from "../../store/actions/nav"


class Sidepanel extends React.Component{

  openPopup() {
    this.props.addChat()
  }

  render() {
    return (
      <div id="sidepanel">
        <div id="profile">
          <div className="wrap">
            <img id="profile-img" src="http://emilcarlsson.se/assets/mikeross.png" className="online" alt="" />
            <p>{this.props.username}</p>
            <i className="fa fa-chevron-down expand-button" aria-hidden="true"></i>
            <div id="status-options">
              <ul>
                <li id="status-online" className="active"><span className="status-circle"></span> <p>Online</p></li>
                <li id="status-away"><span className="status-circle"></span> <p>Away</p></li>
                <li id="status-busy"><span className="status-circle"></span> <p>Busy</p></li>
                <li id="status-offline"><span className="status-circle"></span> <p>Offline</p></li>
              </ul>
            </div>
            // <div id="expanded">
            //   <label htmlFor="twitter"><i className="fa fa-facebook fa-fw" aria-hidden="true"></i></label>
            //   <input name="twitter" type="text" value="mikeross" />
            //   <label htmlFor="twitter"><i className="fa fa-twitter fa-fw" aria-hidden="true"></i></label>
            //   <input name="twitter" type="text" value="ross81" />
            //   <label htmlFor="twitter"><i className="fa fa-instagram fa-fw" aria-hidden="true"></i></label>
            //   <input name="twitter" type="text" value="mike.ross" />
            // </div>
          </div>
        </div>
        <div  id="search">
          <label htmlFor=""><i className="fa fa-search" aria-hidden="true"></i></label>
          <input type="text" placeholder="Search contacts..." />
        </div>
        <div id="contacts">
          <ul>
          {this.props.chatList.map((j,index) => {
            console.log(j)
            return <Contact data = {j} key ={index} {...this.props} />
          })}
          </ul>
        </div>
        <div id="bottom-bar" onClick = {()=> this.openPopup()}>
          <button id="addcontact">
          <i className="fa fa-user-plus fa-fw" aria-hidden="true">
          </i>
          <span>Add chat</span>
          </button>
          <button id="settings"><i className="fa fa-cog fa-fw" aria-hidden="true"></i> <span>Settings</span></button>
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addChat: () => dispatch(navActions.openPopup())
  }
}

export default connect(null, mapDispatchToProps)(Sidepanel);
