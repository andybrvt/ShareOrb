import React from 'react';
import { NavLink } from 'react-router-dom';


const Contact= (props) => {

 // const friend =
  return (
    <NavLink to = {''+props.data.id } style = {{color: '#fff'}}>
    <li className="contact">
      <div className="wrap">
        <span className="contact-status online"></span>
        <img src="http://emilcarlsson.se/assets/louislitt.png" alt="" />
        <div className="meta">
          <p className="name">{props.data.id}</p>
          <p className="preview"></p>
        </div>
      </div>
    </li>
    </NavLink>
  )


}

export default Contact;
