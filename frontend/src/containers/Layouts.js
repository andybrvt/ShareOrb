import React from 'react';
import { Layout, Menu, Breadcrumb } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../store/actions/auth';
import './Containers.css'
import { authAxios } from '../components/util';
import { Icon } from 'semantic-ui-react'
import { Input } from 'antd';


import NoticeIcon from './NoticeIcon';
import styles from './notification.less';

const { Header, Footer, Content } = Layout;
const { Search } = Input;


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

                {/* need to create boolean condition onChange to make the loading = true to get loading animation while typing */}
                {
                    this.props.isAuthenticated ?
                    <Menu.Item key="7">


                        <Search placeholder="input search here!" loading={false} enterButton  />
                    </Menu.Item>

                    :
                        <Menu.Item key="7">
                        </Menu.Item>
                    }


                {
                    this.props.isAuthenticated ?
                    <Menu.Item key="8">

                        <a href='/personalcalendar'>
                        <div class="column"><i class="calendar outline icon"></i>Calendar Outline</div>

                        </a>
                    </Menu.Item>

                    :
                    <Menu.Item key="8">
                    </Menu.Item>
                }



                {
                    this.props.isAuthenticated ?
                    <Menu.Item key="9">
                        <a href='/chat/1'></a>
                    </Menu.Item>
                    :
                    <Menu.Item key="9">
                    </Menu.Item>
                }



                {
                    this.props.isAuthenticated ?
                    <Menu.Item key="10">


                           <a href='/chat/1'>
                             <Icon name='large comments icon' />
                             Messages
                           </a>

                    </Menu.Item>

                    :
                    <Menu.Item key="10">
                    </Menu.Item>
                }


                {
                    this.props.isAuthenticated ?
                      <Menu.Item key="11">

                        <NoticeIcon
                        className={styles.action}
                        count={currentUser && currentUser.unreadCount}
                        onItemClick={item => {
                          this.changeReadState(item);
                        }}
                        {  /* temporary take out loading var */ }
                        clearText="清空"
                        viewMoreText="查看更多"
                        onClear={this.handleNoticeClear}
                        {/* onPopupVisibleChange={onNoticeVisibleChange}
                          onViewMore={() => message.info('Click on view more')} */}

                        clearClose
                      >
                        <NoticeIcon.Tab
                          tabKey="notification"
                          count={5}
                          list={{"test": "blah"}}
                          title="通知"
                          emptyText="你已查看所有通知"
                          showViewMore
                        />
                        <NoticeIcon.Tab
                          tabKey="message"
                          count={5}
                          list={{"test": "blah"}}
                          title="消息"
                          emptyText="您已读完所有消息"
                          showViewMore
                        />
                        <NoticeIcon.Tab
                          tabKey="event"
                          title="待办"
                          emptyText="你已完成所有待办"
                          count={5}
                          list={{"test": "blah"}}
                          showViewMore
                        />
                      </NoticeIcon>

                      Testing noti

                  </Menu.Item>

                  :
                  <Menu.Item key="11">
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

const mapStateToProps = state => {
  return{
    showDrawer: state.nav.showPopup,
  }
}


const mapDispatchToProps = dispatch => {
  return {
        closeDrawer: () => dispatch(navActions.closePopup()),
        openDrawer: () => dispatch(navActions.openPopup())
        logout: () => dispatch(actions.logout())
    }
}



export default withRouter(connect(null, mapDispatchToProps)(CustomLayout));
