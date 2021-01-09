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
    //
    // console.log(profilePic)
    console.log(like_people)
    console.log(this.props)
    let specifySize=""
    if(this.props.specifySize){
      specifySize=this.props.specifySize;
    }
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

                  <Avatar.Group size={"specifySize"}>
                    <Avatar style={{background:'white'}}/>
                  </Avatar.Group>
                </span>

                :



                <div>
                  {
                    (like_people.length==1)?
                    <span>

                      <Avatar.Group size={specifySize}>
                        <Tooltip placement="topLeft" title={`${like_people[0].first_name} ${like_people[0].last_name} `}>
                             <Avatar
                              onClick = {() => this.profileDirect(like_people[0].username)}
                              // PROFILE ULR
                              src={`${global.API_ENDPOINT}`+like_people[0].profile_picture}/>
                        </Tooltip>
                      </Avatar.Group>
                    </span>


                    :
                    <span>

                    {
                      (like_people.length==2)?

                      <Avatar.Group size={specifySize}>
                        <Tooltip placement="topLeft" title={`${like_people[0].first_name} ${like_people[0].last_name} `}>
                             <Avatar
                             onClick = {() => this.profileDirect(like_people[0].username)}

                              src={like_people[0].profile_picture}/>
                        </Tooltip>



                        <Tooltip placement="topLeft" title={`${like_people[1].first_name} ${like_people[1].last_name} `}>
                             <Avatar
                             onClick = {() => this.profileDirect(like_people[1].username)}
                              src={like_people[1].profile_picture}/>
                        </Tooltip>


                        </Avatar.Group>

                        :
                        <Avatar.Group size={specifySize}>
                           <Tooltip placement="topLeft" title={`${like_people[0].first_name} ${like_people[0].last_name} `}>
                                 <Avatar
                                 onClick = {() => this.profileDirect(like_people[0].username)}
                                 src={like_people[0].profile_picture}/>
                           </Tooltip>
                           <Tooltip placement="topLeft" title={`${like_people[1].first_name} ${like_people[1].last_name} `}>
                              <Avatar
                              onClick = {() => this.profileDirect(like_people[1].username)}

                              src={like_people[1].profile_picture}/>
                           </Tooltip>
                           <Tooltip placement="topLeft" title={`${like_people[2].first_name} ${like_people[2].last_name} `}>
                                <Avatar
                                onClick = {() => this.profileDirect(like_people[2].username)}
                                
                                src={like_people[2].profile_picture}/>
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
