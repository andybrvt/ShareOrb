import { List, Avatar, Button, Skeleton } from 'antd';
import './SuggestedFriends.css';
import Icon from '@ant-design/icons';
import {
DownloadOutlined,
SearchOutlined
} from '@ant-design/icons';
// import reqwest from 'reqwest';
import React from 'react';
import { authAxios } from '../../components/util';
import NotificationWebSocketInstance from '../../notificationWebsocket';

import nature from './nature.jpg';

class SuggestedEvents extends React.Component {
  state = {


  };



  profileDirect = (user) => {
    this.props.history.push('/explore/'+user)
  }



  render() {
    console.log(this.state)
    console.log(this.props)


    const { initLoading, loading, list } = this.state;
    const loadMore =
       !initLoading && !loading ? (
         <div
           style={{
             textAlign: 'center',
             marginTop: 12,
             height: 32,
             lineHeight: '32px',
           }}
         >
        </div>
      ) : null;


    return (
      <div>
      <div class="containerEvent">
        <div class="image">
          <img src={nature}/>
        </div>
        <div class="image">
          <img  src={nature}/>
        </div>
        <div class="image">
          <img src={nature}/>
        </div>
        <div class="image">
          <img  src={nature}/>
        </div>
      </div>

      </div>
    );
  }
}

export default SuggestedEvents;
