import React from 'react';

const TopPanel= (props) => {
  return(
    
      <div className="contact-profile">
        <img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="" />
        <p>username</p>
        <div className="social-media">
          <i className="fa fa-facebook" aria-hidden="true"></i>
          <i className="fa fa-twitter" aria-hidden="true"></i>
          <i className="fa fa-instagram" aria-hidden="true"></i>
        </div>
      </div>
    )
}

export default TopPanel;
