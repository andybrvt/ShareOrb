import React from 'react';
import './UserPostList.css';
import {
  UserOutlined,
  PlusOutlined,
  EyeOutlined,
  CalendarOutlined } from '@ant-design/icons';
  import {
      BrowserRouter as Router,
      Switch,
      Route,
      Link,
      useHistory,
      useLocation,
      useParams
    } from "react-router-dom";
// This will hold all the pictures and post that the user posted
// This inludues day cells and then post as well. It will probally
// be linked to the explore channel
class UserPostList extends React.Component{


  renderPostCell = () => {
    console.log(this.props.allpost)
    let renderList = []
    // if(this.props.posts){
    //   for (let i = 0; i < this.props.posts.length; i++){
    //     renderList.push(this.props.posts[i])
    //   }
    // }
    // if(this.props.cells){
    //   for(let i = 0; i< this.props.cells.length; i++){
    //     if(this.props.cells[i].get_socialCalItems.length > 0){
    //       renderList.push(this.props.cells[i])
    //     }
    //   }
    // }
    if(this.props.allpost){
      renderList = this.props.allpost
    }

    if(renderList.length !== 0 ){
      var boxes = []
      for (let i = 0; i< renderList.length; i++ ){
        console.log(renderList[i])
        if(renderList[i].post.post_images){
          let imagesList = renderList[i].post.post_images
          console.log(renderList[i])
          const postId = renderList[i].post.id
          const postUser = renderList[i].post.user
          boxes.push(
            <div className = 'postListSquare'>
              <Link
              to = {{
                pathname: "/post/"+postUser+"/"+postId,
                state: {pathname: this.props.location}
              }}
              >
              <EyeOutlined className = 'eyeClick'/>
              </Link>
              <img
              // PICTURE URL
              src = {`${global.API_ENDPOINT}/media/`+imagesList[0]}
              className = "squarePic"
              />
            </div>
          )
        }
        if(renderList[i].post.get_socialCalItems){
          const image = renderList[i].post.coverPic
          const calUsername = renderList[i].post.socialCalUser.username
          console.log(renderList[i].post.socialCaldate.split("-"))
          const dateList = renderList[i].post.socialCaldate.split("-")
          const year = dateList[0]
          const month = dateList[1]
          const day = dateList[2]
          boxes.push(
            <div className = "postListSquare">
            <Link
            to = {{
              pathname :"/socialcal/"+calUsername+"/cell/"+year+"/"+month+"/"+day,
              state: {pathname: this.props.location}
            }}
            >

            <i
            style ={{
              position: "absolute",
              zIndex: 1,
              right: "3%",
              top: "3%",
              fontSize: "30px",
              color: "white"
            }}
            class="fas fa-calendar"></i>
            <EyeOutlined className = 'eyeClick'/>
            </Link>
            <img
            // PICTURE URL
            src = {`${global.API_ENDPOINT}`+image}
            className = "squarePic"
            />
            </div>
          )
        }

      }

      console.log(renderList)

      return <div className = "postListContainer"> {boxes} </div>

    } else {
      return <div> No Posts </div>
    }


  }

  render(){

    console.log(this.props)


    return(
      <div className = "postListTabContainer">
        {this.renderPostCell()}
      </div>
    )
  }

}


export default UserPostList;
