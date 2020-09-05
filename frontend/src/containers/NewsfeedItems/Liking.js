import React from 'react';
import { Avatar, Tooltip } from "antd";
import { UserOutlined, AntDesignOutlined } from "@ant-design/icons";
import "./NewsfeedPost.css";
import UserAvatar from './UserAvatar'
import UserLikePlusUserAvatar from './UserLikePlusUserAvatar';

class Liking extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      avatarColor: "",
    }
  }

  render(){
    let like_people = this.props.data.people_like
    let profilePic = ''

    if (this.props.data.user.profile_picture){
      profilePic = 'http://127.0.0.1:8000'+this.props.data.user.profile_picture
    }

    console.log(profilePic)

    let temp="http://127.0.0.1:8000"+this.props.data.post_images;
    let viewPersonPage="http://localhost:3000/explore/"+this.props.data.user.username;
    return (
      <div class="likeCSS">

      {
        (like_people.includes(this.props.userId)) ?

        <span>
          {
            (like_people.length == 2) ?
            <span>

            <Avatar.Group>
              <Tooltip placement="topLeft" title={this.props.data.user.username}>
                <Avatar
                onClick = {() => this.onProfileClick(this.props.data.user.username)}
                style = {{
                  cursor: 'pointer',
                }}
                src={profilePic} alt="avatar" />
              </Tooltip>


              <Tooltip placement="topLeft" title="Ayla Smith">
                <Avatar src="https://images.unsplash.com/photo-1597244359536-862d0fcab3c9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1355&q=80"/>

              </Tooltip>


            </Avatar.Group>



            </span>


            :

            <span>
              {
                (like_people.length == 1)?
                <span>
                  <Tooltip placement="topLeft" title={this.props.data.user.username}>
                    <Avatar
                    onClick = {() => this.onProfileClick(this.props.data.user.username)}
                    style = {{
                      cursor: 'pointer',
                    }}
                    src={profilePic} alt="avatar" />
                  </Tooltip>

                </span>
                :


                <div>
                  {
                  (like_people.length == 3)?

                  <div> <Avatar.Group>

                  <Tooltip placement="topLeft" title={this.props.data.user.username}>
                    <Avatar
                    onClick = {() => this.onProfileClick(this.props.data.user.username)}
                    style = {{
                      cursor: 'pointer',
                    }}
                    src={profilePic} alt="avatar" />
                  </Tooltip>

                  <Tooltip placement="topLeft" title="Allen Johnson">
                  <Avatar src="https://images.unsplash.com/photo-1597244359536-862d0fcab3c9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1355&q=80"/>
                  </Tooltip>

                  <Tooltip placement="topLeft" title="Sarah Lee">
                    <Avatar src="https://images.unsplash.com/photo-1570697755619-fa7874c6c062?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"/>
                  </Tooltip>

                  </Avatar.Group> </div>


                :
                <span>


                {

                  (like_people.length > 3)?



                    <span>

                      <UserLikePlusUserAvatar {...this.props}/>
                    </span>



                  :

                  <div>
                    {/* No people
                    <Avatar.Group
                    maxStyle={{ color: 'white', backgroundColor: 'white' }}
                    maxCount={3}
                    >


                    </Avatar.Group>
                    */}

                    testetsestsetset
                  </div>
                 }
                </span>

              }

              </div>
              }
            </span>
          }
        </span>

        :


        <span>
        { /* If the user is not included in the likes */}
        {
          (like_people.length>3)?
          <span>

            <UserAvatar/>
          </span>

          :

            <span>
              {
                (like_people.length === 0) ?
                <span>

                  <Avatar.Group>
                    <Avatar style={{background:'white'}}/>
                  </Avatar.Group>
                </span>

                :



                <div>
                  {
                    (like_people.length==1)?
                    <span>

                    <Avatar.Group>
                       <Avatar src="https://images.unsplash.com/photo-1597244359536-862d0fcab3c9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1355&q=80"/>
                      </Avatar.Group>
                    </span>


                    :
                    <span>

                    {
                      (like_people.length==2)?

                        <Avatar.Group>


                        <Tooltip placement="topLeft" title="William Smith">
                             <Avatar src="https://images.unsplash.com/photo-1597244359536-862d0fcab3c9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1355&q=80"/>
                       </Tooltip>

                       <Tooltip placement="topLeft" title="Emily Lee">
                        <Avatar src="https://images.unsplash.com/photo-1570697755619-fa7874c6c062?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"/>
                      </Tooltip>


                        </Avatar.Group>

                        :
                        <Avatar.Group>


                        <Tooltip placement="topLeft" title="William Chen">
                             <Avatar src="https://images.unsplash.com/photo-1597244359536-862d0fcab3c9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1355&q=80"/>
                       </Tooltip>
                       <Tooltip placement="topLeft" title="Cameron Allen">
                          <Avatar src="https://images.unsplash.com/photo-1570697755619-fa7874c6c062?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"/>
                      </Tooltip>
                      <Tooltip placement="topLeft" title="Lebron James">
                          <Avatar src="https://images.unsplash.com/photo-1484515991647-c5760fcecfc7?ixlib=rb-1.2.1&auto=format&fit=crop&w=687&q=80"/>
                     </Tooltip>

                        </Avatar.Group>



                      }
                    </span>

                  }
                  </div>



              }
            </span>
      }
      </span>

      }


      </div>

    )
  }
}



export default Liking;
