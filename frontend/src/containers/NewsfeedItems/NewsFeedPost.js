import React from "react";
import "./NewsfeedPost.css";
import Comments from '../../containers/comments/comments.js'
import { authAxios } from '../../components/util';
import {Icon, Tooltip, Skeleton, Switch, Card, Avatar, Comment, Button, List, Input, Popover, message, Space, Form} from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined, SearchOutlined, ArrowRightOutlined, ShareAltOutlined, HeartTwoTone, EditTwoTone} from '@ant-design/icons';
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
  console.log(this.props);
  const { TextArea } = Input;
  return (
    <div>

    <div class="mock-outer">


      <div class="fb-group-picrow">
            <img src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
      <div class="fb-group-text">
        <h5 class="fbh5">

        <span>
          {this.props.data.user.username}


        </span>


        </h5>
        <span class="fb-group-date"> {this.props.data.created_at}</span>

              </div>

            </div>
            <div class="usertext">
              <p>
                {this.props.data.caption}
              </p
            ></div>

            <Button shape="round" size="middle"  onClick ={this.AddOneToLike} style={{marginTop:'40px', marginRight: '15px',}}>
              <Icon type="heart" style={{ fontSize: '20px', color: 'red', marginRight:'12px', }} />
              {this.props.data.like_count}
            </Button>


            <Button shape="round" size="middle">
              <EditTwoTone  style={{ fontSize: '20px'}}/>
            </Button>
            <div>
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



            </div>
    </div>





      {


        (this.props.data.post_comments.length==0) ?

        <div>

          <Comment
          style={{ width: 600 }}
           avatar={
             <Avatar
               src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
               alt="Han Solo"
               />
           }
           content={
            <div>
             <Form.Item>
               <TextArea
               placeholder="Write a comment"
                rows={4}

               />
               <Button type="primary">
                 Add Comment
               </Button>
             </Form.Item>

            </div>
          }

         />

        </div>
        :

        <div class="mock-outer" style={{ width: 650, marginLeft:30, marginBottom:50, marginTop:25, height:370, }}>

        <Comments className="RobotoFont" newsfeed={this.props}/>
        <Form.Item>
          <TextArea
          placeholder="Write a comment"
           rows={4}

          />
          <Button type="primary">
            Add Comment
          </Button>
        </Form.Item>
        </div>



      }


      </div>





  );
};
}

export default NewsfeedPost;












//
//
// <Card
//    className="cardborder"
//    style={{ width: 700, marginTop: 16,  }}
//    actions={[
//      <SettingOutlined key="setting" />,
//      <EditOutlined key="edit" />,
//      <EllipsisOutlined key="ellipsis" />,
//    ]}
//  >
//
//
//     <span>
//     <Popover content={
//       <div>
//
//
//         <a href="/current-user" className="nav-text">
//           {this.props.data.user.username}
//         </a>
//         <p>Content</p>
//       </div>
//       }
//       title={this.props.data.user.username}
//       placement="topLeft"
//       >
//      <Button> {this.props.data.user.username} </Button>
//     </Popover>
//
//     </span>
//     <br></br>
//     <span>
//       <b>Date:</b> {this.props.data.created_at}
//     </span>
//     <br></br>
//     <h2 className="RobotoFont">
//       {this.props.data.caption}
//     </h2>
//
//     <ArrowRightOutlined
//     style={{ marginLeft: 550 }}
//     size="32px"
//     onClick={success}
//
//
//     />
//     <ShareAltOutlined
//     style={{ marginLeft: 550 }}
//
//     />
//     <br></br>
//
//
//
//     {
//         this.props.data.image ?
//
//         // <div style="max-width: 100%; max-height: 100%;">
//           <span >
//             <img src= {temp} height="250" width="450"/>
//           </span>
//         // </div>
//
//         :
//         <div></div>
//
//
//     }
//
//     <div class="small ui labeled button" tabindex="0"
//
//         onClick ={this.AddOneToLike}
//     >
//       <div class="small ui red button">
//         <i class="heart icon"></i> Like
//       </div>
//       <a class="ui basic red left pointing label">
//         {this.props.data.like_count}
//
//
//
//
//       </a>
//
//
//     </div>
//
//
//
//
//
//   </Card>
