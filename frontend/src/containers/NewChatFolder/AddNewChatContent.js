import React from 'react';
import { Input, List, Avatar, Spin, Select} from 'antd';
import './NewChat.css';
import { connect } from 'react-redux';
import { authAxios } from '../../components/util';

// This fucntion will be the search function and add function
// when you are trying to add new chats or make new chats
const { Option } = Select;



class AddNewChatContent extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      person: [],
      messages: []
    }
  }

  scrollToBottom = () => {
    if(this.messagesEnd){
        this.messagesEnd.scrollIntoView({ behavior: "auto" });
    }

  }

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }


  capitalize (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  renderPeopleSearch = () => {
    // This part will consit of all your followers and following
    // let followers = this.props.followers
    // let following = this.props.following
    // const newList = followers.concat(following)
    let followers = []
    let following = []
    let searchList = []
    if(this.props.followers){
      followers = this.props.followers
    }
    if(this.props.following){
      following = this.props.following
    }
    // To pick who you want to serach just change the list here


    // Do it with just following for now

    let chatOptions = []

    for(let i = 0; i<following.length; i++){
      // This will make all the select child
      chatOptions.push(
        <Option value = {following[i].id}
        label = {this.capitalize(following[i].username)}>
          {this.capitalize(following[i].username)}
        </Option>

      )
    }

    return chatOptions

  }

  handleChange = (value) =>{
    this.setState({
      person: value
    })

    if(value.length > 0){
      authAxios.post("http://127.0.0.1:8000/newChat/getChat",
        {
          person: [...value, this.props.curId]
        }
      ).then(
        res => {
          console.log(res.data)
          this.setState({
            messages:res.data
          })
        }
      )
    } else {
      this.setState({
        messages: []
      })
    }




  }


  render(){

    console.log(this.props)
    console.log(this.state)


    const data = [
      {
        title: 'Ant Design Title 1',
      },
      {
        title: 'Ant Design Title 2',
      },
      {
        title: 'Ant Design Title 3',
      },
      {
        title: 'Ant Design Title 4',
      },
    ];


    return(
      <div className ="addNewChatContainer">
        <div className = "searchFormBox">
          <form>
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Search users"
            onChange={this.handleChange}
            value = {this.state.person}
            optionLabelProp="label"
          >
            {this.renderPeopleSearch()}
            </Select>
          </form>
        </div>

      <div className = "searchChatContent">


      <List
      className = "newChatTextContainer"
      itemLayout = "horizontal"
      dataSource = {this.state.messages}
      renderItem = { item => (

        <div>
        {
          this.props.curId === item.messageUser.id ?

          <div className = "chatTextBoxRight">
          <Avatar size = {45} src = {'http://127.0.0.1:8000' +item.messageUser.profile_picture}  />
          <div className = 'chatNameTimeRight'>
            <div className = 'chatNameRight'>
              {this.capitalize(item.messageUser.first_name)} {this.capitalize(item.messageUser.last_name)}
            </div>
            <div>

            </div>
          </div>

          <div className = "chatContentTextRight">
            {item.body}
          </div>

          </div>

          :

          <div className = "chatTextBox">
          <Avatar size = {45} src = {'http://127.0.0.1:8000' +item.messageUser.profile_picture}  />
          <div className = 'chatNameTime'>
            <div className = 'chatName'>
              {this.capitalize(item.messageUser.first_name)} {this.capitalize(item.messageUser.last_name)}
            </div>
            <div>

            </div>
          </div>

          <div className = "chatContentText">
            {item.body}
          </div>

          </div>

        }


        </div>


      )

      }

      >
      <div style={{ float:"left", clear: "both" }}
          ref={(el) => { this.messagesEnd = el; }}>
     </div>
      </List>



      </div>


      <div className = "searchChatInput">
        <form>
          <div className = "searchChatInputBox">
          <Input
          className = "chatInput"
           />
          </div>
        </form>
      </div>
      </div>

    )

  }
}

export default AddNewChatContent;
