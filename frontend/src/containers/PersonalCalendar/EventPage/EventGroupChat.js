import React from 'react';
import moment from 'moment';
import { Comment, Tooltip, List, Avatar, Input, Form, Button } from 'antd';
import { SendOutlined  } from '@ant-design/icons';
import { connect } from 'react-redux'
import './EventPage.css';

class EventGroupChat extends React.Component{
  capitalize (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  renderTimestamp = timestamp =>{
    let prefix = '';
    const timeDiff = Math.round((new Date().getTime() - new Date(timestamp).getTime())/60000)
    console.log(timeDiff)
    if (timeDiff <= 1 ) {
      prefix = `Just now`;
    } else if (timeDiff < 60 && timeDiff >1 ) {
      prefix = `${timeDiff} minutes ago`;
    }else if (timeDiff < 24*60 && timeDiff > 60) {
      prefix = `${Math.round(timeDiff/60)} hours ago`;
    } else if (timeDiff < 31*24*60 && timeDiff > 24*60) {
      prefix = `${Math.round(timeDiff/(60*24))} days ago`;
    } else {
        prefix = `${new Date(timestamp)}`;
    }

    return prefix;
  }


  render(){

    console.log(this.props)
    let messages = []
    if (this.props.messages){
      messages = this.props.messages
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
      <div className = 'eventGroupChatContainer'>
      <div className = 'messageList'>
      <List
          itemLayout="horizontal"
          dataSource={messages}
          renderItem={item => (



            <div className = {`${this.props.id === item.messageUser.id ?
              "eventMessageItemUser" : "eventMessageItemNotUser"}`}>

              {this.props.id !== item.messageUser.id ?
                <div>
                <Avatar
                className = 'eventMessageAvatar'
                size = {30} src = {'http://127.0.0.1:8000'+item.messageUser.profile_picture} />
                </div>
                :

                <div></div>
              }
              <div className = 'messageP'>
              {this.props.id !== item.messageUser.id ?
                <span className = 'userName'>{this.capitalize(item.messageUser.first_name)} {this.capitalize(item.messageUser.last_name)}
                </span>
                :
                <span></span>

              }


            <div>{item.body}</div>
            <div className = 'eventTimeStamp'> {this.renderTimestamp(item.created_on)}</div>
            </div>
            </div>

          )}
        />
        </div>
      <div className = 'inputForm'>

      <Form>
        <Input />

      </Form>
      </div>

      </div>

    )
  }
}

const mapStateToProps = state => {
  return{
    id: state.auth.id
  }
}

export default connect(mapStateToProps)(EventGroupChat);
