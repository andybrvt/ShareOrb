import React from "react";

const Result = (props) => {
  console.log(props.data.image)
  let temp="http://127.0.0.1:8000"+props.data.image;
  return (

    <div>
      <li>
        <span>
          <b>Title:</b> {props.data.caption}
        </span>
        <br></br>
        <span>
          <b>Date:</b> {props.data.created_at}
        </span>
        <br></br>
        <span>
          <b>Username:</b> {props.data.user.username}
        </span>
        <br></br>



        {
            props.data.image ?

            // <div style="max-width: 100%; max-height: 100%;">
              <span >
                <img src= {temp} height="250" width="450"/>
              </span>
            // </div>

            :
            <div></div>


        }

        <div class="ui labeled button" tabindex="0">
          <div class="ui red button">
            <i class="heart icon"></i> Like
          </div>
          <a class="ui basic red left pointing label">
            1,048
          </a>
        </div>

      </li>
      <hr />
    </div>
  );
};

export default Result;
