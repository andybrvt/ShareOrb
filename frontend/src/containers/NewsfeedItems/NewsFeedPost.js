import React from "react";
import { Popover, Button } from 'antd';
import "./NewsfeedPost.css";
import Comments from '../../containers/comments/comments.js'

const Result = (props) => {
  console.log(props.data.image)
  let temp="http://127.0.0.1:8000"+props.data.image;
  return (

    <div>

        <span>
        <Popover content={
          <div>
            <p>Content</p>
            <p>Content</p>
          </div>
          }
          title={props.data.user.username}
          placement="topLeft"
          >
         <Button> {props.data.user.username} </Button>
        </Popover>

        </span>
        <br></br>
        <span>
          <b>Date:</b> {props.data.created_at}
        </span>
        <br></br>
        <div className="testwithAnt">
          {props.data.caption}
        </div>
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

        <div class="small ui labeled button" tabindex="0">
          <div class="small ui red button">
            <i class="heart icon"></i> Like
          </div>
          <a class="ui basic red left pointing label">
            0
          </a>


        </div>
        <Comments/>

      <hr />
    </div>
  );
};

export default Result;
