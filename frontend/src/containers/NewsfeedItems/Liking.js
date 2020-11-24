import React from 'react';
import { Avatar, Tooltip } from "antd";
import { UserOutlined, AntDesignOutlined } from "@ant-design/icons";
import "./NewsfeedPost.css";
import UserAvatar from './UserAvatar'

class Liking extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      avatarColor: "",
    }
  }


  profileDirect = (username) => {
      // This will direct the user to a person's profile page when they
      // click on a person's avatar

      console.log(username)
    this.props.history.push('/explore/'+username)
  }

  render(){
    let like_people = this.props.like_people
    // let profilePic = ''
    //
    // if (this.props.data.user.profile_picture){
    //   profilePic = 'http://127.0.0.1:8000'+this.props.data.user.profile_picture
    // }
    //
    // console.log(profilePic)
    console.log(like_people)
    console.log(this.props)
    // let temp="http://127.0.0.1:8000"+this.props.data.post_images;
    // let viewPersonPage="http://localhost:3000/explore/"+this.props.data.user.username;
    return (
      <div class="likeCSS">






        <span>
        { /* If the user is not included in the likes */}
        {
          (like_people.length>3)?
          <span>

            <UserAvatar  {...this.props}/>
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
                        <Tooltip placement="topLeft" title={`${like_people[0].first_name} ${like_people[0].last_name} `}>
                             <Avatar
                              onClick = {() => this.profileDirect(like_people[0].username)}
                              src={'http://127.0.0.1:8000'+like_people[0].profile_picture}/>
                        </Tooltip>
                      </Avatar.Group>
                    </span>


                    :
                    <span>

                    {
                      (like_people.length==2)?

                      <Avatar.Group>
                        <Tooltip placement="topLeft" title={`${like_people[0].first_name} ${like_people[0].last_name} `}>
                             <Avatar
                             onClick = {() => this.profileDirect(like_people[0].username)}
                              src={'http://127.0.0.1:8000'+like_people[0].profile_picture}/>
                        </Tooltip>



                        <Tooltip placement="topLeft" title={`${like_people[1].first_name} ${like_people[1].last_name} `}>
                             <Avatar
                             onClick = {() => this.profileDirect(like_people[1].username)}
                              src={'http://127.0.0.1:8000'+like_people[1].profile_picture}/>
                        </Tooltip>


                        </Avatar.Group>

                        :
                        <Avatar.Group>


                        <Tooltip placement="topLeft" title={`${like_people[0].first_name} ${like_people[0].last_name} `}>
                             <Avatar
                             onClick = {() => this.profileDirect(like_people[0].username)}
                             src={'http://127.0.0.1:8000'+like_people[0].profile_picture}/>
                       </Tooltip>
                       <Tooltip placement="topLeft" title={`${like_people[1].first_name} ${like_people[1].last_name} `}>
                          <Avatar
                          onClick = {() => this.profileDirect(like_people[1].username)}
                          src={'http://127.0.0.1:8000'+like_people[1].profile_picture}/>
                      </Tooltip>
                      <Tooltip placement="topLeft" title={`${like_people[2].first_name} ${like_people[2].last_name} `}>
                          <Avatar
                          onClick = {() => this.profileDirect(like_people[2].username)}
                           src={'http://127.0.0.1:8000'+like_people[2].profile_picture}/>
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




      </div>

    )
  }
}



export default Liking;
