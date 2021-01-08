import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin, Dropdown } from 'antd';
import React from 'react';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import {connect} from 'react-redux';
import * as actions from '../../store/actions/auth';
import { Link, withRouter } from 'react-router-dom';
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

    authAxios.get(`${global.API_ENDPOINT}/userprofile/current-user/`)
      .then(res=> {
        console.log(res.data.username)
        this.setState({
          username: res.data.username
       });
     });


  }




  renderProfile() {
    if (this.props.isAuthenticated){
      return (
        <div>
          <Dropdown overlay={

            <Menu className={styles.menu} selectedKeys={[]} >
              { (
                <Menu.Item key="center">
                  <Link to="/current-user">
                    <UserOutlined />
                    Profile

                  </Link>

                </Menu.Item>
              )}
              { (
                <Menu.Item key="settings">
                  <i style={{marginRight:'5px' }} class="fas fa-cog"></i>
                  <span style={{marginLeft:'2px'}}> Settingsss</span>
                </Menu.Item>
              )}
              { <Menu.Divider />}





              <Menu.Item key="logout" onClick={this.props.logout}>
                <Link to="/">
                  <LogoutOutlined />
                  Logout

                </Link>

              </Menu.Item>
            </Menu>}>




        </Dropdown>
      </div>

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
    return (
      <div>
      {this.renderProfile()}
      </div>
    )
  }
}


export default ProfileDropDown;
