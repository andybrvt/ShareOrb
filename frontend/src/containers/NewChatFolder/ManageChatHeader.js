import React from 'react';
import { Input, Divider} from 'antd';
import './NewChat.css';
import { authAxios } from '../../components/util';



class ManageChatHeader extends React.Component{


  state = {
    // searchValue: "",
    loading: false,
    // searchedChats: []
  }

  onClickAddChats = () =>{
    // This will redirect to the right create chat area
    this.props.history.push("/chat/newchat")
  }

  onClickInput = () =>{

    // This onClick here will be in charge of showing the search list
    // when you click on the search

    console.log('click the input')
    this.props.openChatSearch()
  }

  onBackClick = () => {
    // This function will be used to close the on chat search
    this.props.closeChatSearch()
  }

  onChatSearchChange = e => {
    console.log(e.target.value)
    this.props.onChangeSearchValue(e.target.value)

    const search = e.target.value === undefined ? null : e.target.value

    if(search !== ""){
      // This is if they are searching up stuff
      this.setState({
        loading: true
      })

      // Now you will do a backend call to search for the chats
      authAxios.get(`${global.API_ENDPOINT}/newChat/searchChat/`,{
        params: {
          search
        }
      })
      .then(res =>{
        console.log(res)
        // Now that you have it, put it into a list and then render it
        this.setState({
          loading: false,
          // searchedChats: res.data,
        })

        this.props.addChatSearch(res.data)
      })


    } else {



    }
  }


  render(){
    return(
        <div className = "newManageChatHeader">
          {
            this.props.showChatSearch ?

            <div
              className = "searchChatBack"
              onClick = {() => this.onBackClick()}>
              <i class="fas fa-arrow-circle-left"></i>
            </div>

            :

            <div className ="">
            </div>


          }

          <div className = "manageChatForm">
              <Input
              value = {this.props.searchValue}
              onChange = {this.onChatSearchChange}
              className = "searchInput"
              placeholder = "Search chats..."
              onClick = {() => this.onClickInput()}
              />
          </div>
          <div class="addChatsButtonContainer">
              <i
                onClick = {() => this.onClickAddChats()}
                style={{color:'#1890ff', fontSize:'24px'}}
                class="addChatsButton fas fa-plus-circle"></i>
          </div>

        </div>

    )
  }
}

export default ManageChatHeader;
