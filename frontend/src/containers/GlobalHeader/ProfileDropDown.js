import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin } from 'antd';
import React from 'react';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import {connect} from 'react-redux';
import * as actions from '../../store/actions/auth';

import axios from 'axios';
import { authAxios } from '../../components/util';

 class ProfileDropDown extends React.Component {


   constructor(props) {
    super(props);
    this.state={

  		username: '',
  		avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',

  	}
  }


  componentWillReceiveProps(newProps){

    console.log(this.props.data)
    authAxios.get('http://127.0.0.1:8000/userprofile/current-user/')
      .then(res=> {
        console.log(res.data.username)
        this.setState({
          username: res.data.username
       });
     });


  }


  onMenuClick = event => {
    const { key } = event;

    if (key === 'logout') {
      const { dispatch } = this.props;

      if (dispatch) {
        dispatch({
          type: 'login/logout',
        });
      }

      return;
    }

  };

  renderProfile() {
    if (this.props.isAuthenticated){
      return (
        <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        { (
          <Menu.Item key="center">
            <UserOutlined />
            个人中心
          </Menu.Item>
        )}
        { (
          <Menu.Item key="settings">
            <SettingOutlined />
            个人设置
          </Menu.Item>
        )}
        { <Menu.Divider />}

        <Menu.Item key="logout">
          <LogoutOutlined />
          退出登录
        </Menu.Item>
      </Menu>
    )

    } else {
      return (
        <span className={`${styles.action} ${styles.account}`}>
          <Spin
            size="small"
            style={{
              marginLeft: 8,
              marginRight: 8,
            }}
          />
        </span>
      )

    }

  }

  render() {

    const {
      menu,
    } = this.props;


    const test = true;

    console.log(this.state)
    console.log(this.state.username)
    console.log(this.state.avatar && this.state.username)
    console.log(test)
    console.log(test&&true)
    return (
      <div>
      {this.renderProfile()}
      </div>
    )
  }
}


export default ProfileDropDown;
