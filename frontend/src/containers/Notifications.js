import React from 'react';
import NotificationWebSocketInstance from '../notificationWebsocket';
import { authAxios } from '../components/util';
import axios from 'axios';
import { List, Avatar, Button, Skeleton } from 'antd';
import { connect } from 'react-redux';


const count = 3;


class Notifications extends React.Component{
  state = {
    notifications: []
  }

// remember that you can add the call backs in using redux
// you like the functions in the notificationWebsocket to the notificaiton.js through callbacks and bind
// baically the information will be called to the states
  initialiseNotification(){
    this.waitForSocketConnection(() => {
      // when you do the fetchFriendRequests it already called the actions
      NotificationWebSocketInstance.fetchFriendRequests(
        this.props.id
      )
      })
      // NotificationWebSocketInstance.connect()
    }

    constructor(props){
      super(props)
      this.initialiseNotification()
      // these will give the commands the function --> this is similar to the command
      // array in the consumer.py
    }

  waitForSocketConnection (callback) {
    const component = this;
    setTimeout(
      function(){
        console.log(NotificationWebSocketInstance.state())
        if (NotificationWebSocketInstance.state() === 1){
          console.log('connection is secure');
          console.log(NotificationWebSocketInstance.state())
          callback();
          return;
        } else{
            console.log('waiting for connection...')
            component.waitForSocketConnection(callback);
        }
      }, 100)

  }

  renderTimestamp = (timestamp) => {
    let prefix = '';
    const timeDiff = Math.round((new Date().getTime() - new Date(timestamp).getTime())/60000)
    if (timeDiff < 1 ) {
      prefix = `Just now`;
    } else if (timeDiff < 60 && timeDiff >1 ) {
      prefix = `${timeDiff} minutes ago`;
    }else if (timeDiff < 24*60 && timeDiff > 60) {
      prefix = `${Math.round(timeDiff/60)} hours ago`;
    } else if (timeDiff < 31*24*60 && timeDiff > 24*60) {
      prefix = `${Math.round(timeDiff/60*24)} days ago`;
    } else {
        prefix = `${new Date(timestamp)}`;
    }

    return prefix;
  }

  // renderNotifications = (notifications) => {
  //   return notifications.map(notification => (
  //     <li class="list">
  //         <a href="#" title="">
  //             <img src="images/resources/thumb-1.jpg" alt=""/>
  //             <div class="mesg-meta">
  //                 <div> This is the actor (person sending) [{notification.actor.username}] sent recepient (person receiving) [{notification.recipient}] </div>
  //                 <div>  </div>
  //                 <div> This is the message: [{notification.description}] </div>
  //                   <i>The time of this notification: {this.renderTimeStamp(notification.timestamp)}</i>
  //
  //
  //             </div>
  //         </a>
  //      </li>;
  //
  //    )
  //   )
  // }

  onLoadMore = () => {
    this.setState({
      loading: true,
      list: this.state.data.concat([...new Array(count)].map(() => ({ loading: true, name: {} }))),
    });
    this.getData(res => {
      const data = this.state.data.concat(res.results);
      this.setState(
        {
          data,
          list: data,
          loading: false,
        },
        () => {
          // Resetting window's offsetTop so as to display react-virtualized demo underfloor.
          // In real scene, you can using public method of react-virtualized:
          // https://stackoverflow.com/questions/46700726/how-to-use-public-method-updateposition-of-react-virtualized
          window.dispatchEvent(new Event('resize'));
        },
      );
    });
  };

  componentWillReceiveProps(newProps){

  }

  render(){
    console.log(this.props)

    return (

            <List
              className="demo-loadmore-list"

              itemLayout="horizontal"

              dataSource={this.props.notifications}
              renderItem={item => (


                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                    title={<a href="https://ant.design">{item.title}</a>}

                    description={"This is the description     ["+item.description+"    ]  \n"+
                      "This is the recipientID    "+item.recipient+"    This is the actor "+item.actor.username}
                  />
                </List.Item>
              )}
            />


      )

    }
  }

  const mapStateToProps = state => {
    return {
      notifications: state.notifications.notifications,
      username: state.auth.username
    }
  }

export default connect(mapStateToProps)(Notifications);
