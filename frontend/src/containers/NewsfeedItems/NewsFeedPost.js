import React from "react";
import { Popover, Button } from 'antd';
import "./NewsfeedPost.css";
import Comments from '../../containers/comments/comments.js'
import { Skeleton, Switch, Card, Avatar } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined, ArrowRightOutlined, ShareAltOutlined } from '@ant-design/icons';
const Result = (props) => {
  console.log(props.data.image)
  let temp="http://127.0.0.1:8000"+props.data.image;
  return (

    <div>
    <Card

       style={{ width: 600, marginTop: 16 }}
       actions={[
         <SettingOutlined key="setting" />,
         <EditOutlined key="edit" />,
         <EllipsisOutlined key="ellipsis" />,
       ]}
     >


        <span>
        <Popover content={
          <div>


            <a href="/current-user" className="nav-text">
              {props.data.user.username}
            </a>
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
        <h2 className="RobotoFont">
          {props.data.caption}
        </h2>

        <ArrowRightOutlined
        style={{ marginLeft: 550 }}
        size="32px"
    

        />
        <ShareAltOutlined
        style={{ marginLeft: 550 }}

        />
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




      </Card>
      <Comments className="RobotoFont"/>
    </div>
  );
};

export default Result;
