import React from 'react';
import { Input, List, Avatar, Spin, Select} from 'antd';
import './NewChat.css';
import { connect } from 'react-redux';
// This fucntion will be the search function and add function
// when you are trying to add new chats or make new chats
const { Option } = Select;



class AddNewChatContent extends React.Component{

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
        <Option value = {following[i].username}
        label = {this.capitalize(following[i].username)}>
          {this.capitalize(following[i].username)}
        </Option>

      )
    }

    return chatOptions

  }


  render(){

    console.log(this.props)


    function handleChange(value) {
      console.log(`selected ${value}`);
    }


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
            onChange={handleChange}
            optionLabelProp="label"
          >
            {this.renderPeopleSearch()}
            </Select>
          </form>
        </div>

      <div className = "searchChatContent">
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
              title={<a href="https://ant.design">{item.title}</a>}
              description="Ant Design, a design language for background applications, is refined by Ant UED Team"
            />
          </List.Item>
        )}
      />
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
