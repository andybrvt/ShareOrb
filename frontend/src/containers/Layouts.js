import React from 'react';
import { Layout, Menu, Breadcrumb } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../store/actions/auth';
import './Containers.css'
import { authAxios } from '../components/util';
import { Icon } from 'semantic-ui-react'
const { Header, Footer, Content } = Layout;

// Function: boarder layout that wraps around each of the other containers, and has
// menu items that go to each page

class CustomLayout extends React.Component {
  state = {
    username: ''
  }

  async componentDidMount(){
    await authAxios.get('http://127.0.0.1:8000/userprofile/current-user/')
      .then(res=> {
        console.log(res.data)
        console.log(res.data.id)
        this.setState({
          username: res.data.username,
       });
     });
   }

    render() {
      const currentUser = this.state.username
      console.log(this.props)

        return (
            <Layout className="layout">
                <Header>
                <div className="logo" />
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={['2']}
                    style={{ lineHeight: '64px' }}
                >

                {
                    this.props.isAuthenticated ?

                    <Menu.Item key="2" onClick={this.props.logout}>
                        <Link to="/">Logout</Link>
                    </Menu.Item>

                    :

                    <Menu.Item key="2">
                        <Link to="/">Login</Link>
                    </Menu.Item>
                }


                {
                    this.props.isAuthenticated ?
                    <Menu.Item key="1">

                        <a href='/home'>
                          <Icon name='large home' />
                          Home
                        </a>
                    </Menu.Item>
                    :
                    <Menu.Item key="1">
                    </Menu.Item>
                }

                {
                    this.props.isAuthenticated ?
                    <Menu.Item key="3">

                        <a href='/userview'>
                          <Icon name='large user plus' />
                          Users
                        </a>
                    </Menu.Item>
                    :
                    <Menu.Item key="3">
                    </Menu.Item>

                }

                {
                    this.props.isAuthenticated ?
                    <Menu.Item key="4">

                        <a href='/current-user'>
                          <Icon name='large user circle' />
                          Users
                        </a>
                    </Menu.Item>
                    :
                    <Menu.Item key="4">
                    </Menu.Item>
                }


                {
                    this.props.isAuthenticated ?
                    <Menu.Item key="5">
                        <a href='/friend-request-list'>Friend requests</a>
                    </Menu.Item>
                    :
                    <Menu.Item key="5">
                    </Menu.Item>
                }
                {
                    this.props.isAuthenticated ?
                    <Menu.Item key="6">
                        <a href='/friends-list'>Friends</a>
                    </Menu.Item>
                    :
                    <Menu.Item key="6">
                    </Menu.Item>
                }


                {
                    this.props.isAuthenticated ?
                    <Menu.Item key="7">

                        <a href='/personalcalendar'>
                        <div class="column"><i class="calendar outline icon"></i>Calendar Outline</div>

                        </a>
                    </Menu.Item>

                    :
                    <Menu.Item key="7">
                    </Menu.Item>
                }



                {
                    this.props.isAuthenticated ?
                    <Menu.Item key="8">
                        <a href='/chat/1'></a>
                    </Menu.Item>
                    :
                    <Menu.Item key="7">
                    </Menu.Item>
                }




                <Menu.Item key="9">


                       <a href='/chat/1'>
                         <Icon name='large comments icon' />
                         Messages
                       </a>

                </Menu.Item>

                <Menu.Item key="10">
                     <div class="column"><i class=" large cloud icon"></i>Notifications</div>
                </Menu.Item>


                </Menu>
                </Header>
                <Content className="site-layout" style={{ padding: '0 50px', marginTop: 20, width: 1200, marginRight: 'auto', marginLeft: 'auto'}}>
                <Breadcrumb style={{ margin: '16px 0' }}>

                    <Breadcrumb.Item><Link to="/">Home</Link></Breadcrumb.Item>
                    <Breadcrumb.Item><Link to="/">List</Link></Breadcrumb.Item>
                </Breadcrumb>
                    <div className="site-layout-background" style={{ padding: 24, minHeight: 380 }}>
                        {this.props.children}
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                Ant Design ©2016 Created by Ant UED
                </Footer>
            </Layout>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        logout: () => dispatch(actions.logout())
    }
}

export default withRouter(connect(null, mapDispatchToProps)(CustomLayout));
