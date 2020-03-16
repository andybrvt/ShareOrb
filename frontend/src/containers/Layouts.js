import React from 'react';
import { Layout, Menu, Breadcrumb } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../store/actions/auth';
import './Containers.css'
const { Header, Footer, Content } = Layout;

// boarder layout that wraps around each of the other containers
// imported all actions, therefore it allows you to call the functions
// from the
class CustomLayout extends React.Component {
    render() {




  //   if(this.props.isAuthenticated) {
    //   <Menu.Item key="2" onClick={this.props.logout}>
    //       <Link to="/login">Logout</Link>
    //   </Menu.Item>
    //
    //   // <Menu.Item key="1">
    //   //     <Link to="/">Home</Link>
    //   // </Menu.Item>
    // }
    // else {
    //
    //
    //   <Menu.Item key="2">
    //       <Link to="/login">Login</Link>
    //   </Menu.Item>
    //
    // }

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
                        <Link to="/home">Home</Link>
                    </Menu.Item>
                    :
                    <Menu.Item key="1">
                        <Link></Link>
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
