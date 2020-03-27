import React from 'react';
import { Layout, Menu, Breadcrumb } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../store/actions/auth';
import './Containers.css'
import { authAxios } from '../components/util';

const { Header, Footer, Content } = Layout;

// boarder layout that wraps around each of the other containers
// imported all actions, therefore it allows you to call the functions
// from the
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
                        <a href='/home'>Home</a>
                    </Menu.Item>
                    :
                    <Menu.Item key="1">
                    </Menu.Item>
                }

                {
                    this.props.isAuthenticated ?
                    <Menu.Item key="3">
                        <a href='/userview'>Users</a>
                    </Menu.Item>
                    :
                    <Menu.Item key="3">
                    </Menu.Item>

                }

                {
                    this.props.isAuthenticated ?
                    <Menu.Item key="4">
                        <a href='/currentuser'>Profile</a>
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
