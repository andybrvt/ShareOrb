import React from 'react';

const Contact= (props) => {
 console.log(props)
  return (
    <li className="contact">
      <div className="wrap">
        <span className="contact-status online"></span>
        <img src="http://emilcarlsson.se/assets/louislitt.png" alt="" />
        <div className="meta">
          <p className="name">{props.data}</p>
          <p className="preview"></p>
        </div>
      </div>
    </li>
  )


}

export default Contact;
