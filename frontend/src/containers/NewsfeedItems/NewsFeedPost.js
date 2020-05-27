import React from "react";
import { Popover, Button, message, Space} from 'antd';
import "./NewsfeedPost.css";
import Comments from '../../containers/comments/comments.js'
import { authAxios } from '../../components/util';
import { Skeleton, Switch, Card, Avatar } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined, ArrowRightOutlined, ShareAltOutlined } from '@ant-design/icons';
class NewsfeedPost extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    }
  }





  AddOneToLike = () => {
    console.log("hi");
    console.log(this.props);
    console.log(this.props.data.id);
  //   // const username = this.props.data.username;
  //   // console.log(this.props)
    authAxios.post('http://127.0.0.1:8000/userprofile/add-like/'+this.props.data.id+'/')

  //   this.setState({value: e.target.value});
    }
    render() {
  let temp="http://127.0.0.1:8000"+this.props.data.image;
  const success = () => {
  message.success('Clipped to your album!');
  };
  return (

    <div>
    <Card
       class="cardborder"
       style={{ width: 600, marginTop: 16,  }}
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
              {this.props.data.user.username}
            </a>
            <p>Content</p>
          </div>
          }
          title={this.props.data.user.username}
          placement="topLeft"
          >
         <Button> {this.props.data.user.username} </Button>
        </Popover>

        </span>
        <br></br>
        <span>
          <b>Date:</b> {this.props.data.created_at}
        </span>
        <br></br>
        <h2 className="RobotoFont">
          {this.props.data.caption}
        </h2>

        <ArrowRightOutlined
        style={{ marginLeft: 550 }}
        size="32px"
        onClick={success}


        />
        <ShareAltOutlined
        style={{ marginLeft: 550 }}

        />
        <br></br>



        {
            this.props.data.image ?

            // <div style="max-width: 100%; max-height: 100%;">
              <span >
                <img src= {temp} height="250" width="450"/>
              </span>
            // </div>

            :
            <div></div>


        }

        <div class="small ui labeled button" tabindex="0"

            onClick ={this.AddOneToLike}
        >
          <div class="small ui red button">
            <i class="heart icon"></i> Like
          </div>
          <a class="ui basic red left pointing label">
            {this.props.data.like_count}




          </a>


        </div>

            {


              (this.props.data.like_condition==false) ?




              <div>

                {
                  (this.props.data.like_count==0) ?

                  <div>

                  </div>

                  :


                  <div>
                    {this.props.data.like_count} people like this
                  </div>

                }
              </div>


              :

              <div>

              {


                  (this.props.data.like_count==2) ?
                 <div>
                  You and one person like this
                  </div>

                :

                <div>

                {


                  (this.props.data.like_count==1) ?

                  <div>
                    You like this

                  </div>
                  :

                  <div>

                    You and {(this.props.data.like_count)-1} people like this
                  </div>



                }

                </div>



              }
              </div>


            }




      </Card>
      // if(this.props.newsfeed.data.post_comments.length==0){}
      <Comments className="RobotoFont" newsfeed={this.props}/>

         </div>
  );
};
}

export default NewsfeedPost;
