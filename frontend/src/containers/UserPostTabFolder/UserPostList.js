import React from 'react';
import './UserPostList.css';
// This will hold all the pictures and post that the user posted
// This inludues day cells and then post as well. It will probally
// be linked to the explore channel
class UserPostList extends React.Component{


  renderPostCell = () => {
    let renderList = []
    if(this.props.posts){
      for (let i = 0; i < this.props.posts.length; i++){
        renderList.push(this.props.posts[i])
      }
    }
    if(this.props.cells){
      for(let i = 0; i< this.props.cells.length; i++){
        if(this.props.cells[i].get_socialCalItems.length > 0){
          renderList.push(this.props.cells[i])
        }
      }
    }

    if(renderList.length !== 0 ){
      var boxes = []
      for (let i = 0; i< renderList.length; i++ ){
        if(renderList[i].post_images){
          let imagesList = renderList[i].post_images
          console.log(imagesList[0])
          boxes.push(
            <div className = 'postListSquare'>
              <img
              src = {'http://127.0.0.1:8000/media/'+imagesList[0]}
              className = "squarePic"
              />
            </div>
          )
        }
        if(renderList[i].get_socialCalItems){
          const image = renderList[i].coverPic
          console.log(image)
          boxes.push(
            <div className = "postListSquare">
            <img
            src = {'http://127.0.0.1:8000'+image}
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
