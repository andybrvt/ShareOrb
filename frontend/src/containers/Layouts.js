import React from 'react';
import { Layout, Menu, Breadcrumb, Dropdown } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../store/actions/auth';
import './Containers.css'
import { authAxios } from '../components/util';
import { Icon } from 'semantic-ui-react'
import { Tag, Input } from 'antd';
import * as navActions from '../store/actions/nav'
import NoticeIcon from './NoticeIcon/index';
import styles from './notification.less';
import moment from 'moment';
const { Header, Footer, Content } = Layout;
const { Search } = Input;


// Function: boarder layout that wraps around each of the other containers, and has
// menu items that go to each page

class CustomLayout extends React.Component {
  state = {
    username: '',
    testData:[
      {
        id: '000000001',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
        title: 'HEYYYYY there',
        datetime: '2017-08-09',
        type: 'notification',
      },
      {
        id: '000000002',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png',
        title: 'Ian wants hiking',
        datetime: '2017-08-08',
        type: 'notification',
      },

    ],
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

   getNoticeData = () => {
       const notices = this.state.testData;

       console.log(notices)
       if (!notices || notices.length === 0 || !Array.isArray(notices)) {
         return {};
       }

       const newNotices = notices.map(notice => {
         const newNotice = { ...notice };

         if (newNotice.datetime) {
           newNotice.datetime = moment(notice.datetime).fromNow();
         }

         if (newNotice.id) {
           newNotice.key = newNotice.id;
         }

         if (newNotice.extra && newNotice.status) {
           const color = {
             todo: '',
             processing: 'blue',
             urgent: 'red',
             doing: 'gold',
           }[newNotice.status];
           newNotice.extra = (
             <Tag
               color={color}
               style={{
                 marginRight: 0,
               }}
             >
               {newNotice.extra}
             </Tag>
           );
         }

         return newNotice;
       });

     };


    render() {
      const currentUser = this.state.username
      const noticeData = this.getNoticeData();
      console.log(this.props)
      const menu = (
            <Menu>
              <Menu.Item>
                <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">
                  menu item
                </a>
              </Menu.Item>
              <Menu.Item>
                <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">
                  menu item
                </a>
              </Menu.Item>
              <Menu.Item>
                <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">
                  menu item
                </a>
              </Menu.Item>
            </Menu>
          );





        const getNotices = (req, res) => {
          res.json([
            {
              id: '000000001',
              avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
              title: 'HEYYYYY there',
              datetime: '2017-08-09',
              type: 'notification',
            },
            {
              id: '000000002',
              avatar: 'https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png',
              title: 'Ian wants hiking',
              datetime: '2017-08-08',
              type: 'notification',
            },

          ]);
        };
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


                            loading={this.fetchingNotices}
                            clearText="清空"
                            viewMoreText="查看更多"

                            // onClear={this.handleNoticeClear}
                            // onPopupVisibleChange={onNoticeVisibleChange}

                            clearClose


                            // <Dropdown
                            //   overlay={menu}
                            // >
                            //   <div>
                            //   Notifications
                            //   </div>
                            // </Dropdown>
                          >
                            <NoticeIcon.Tab
                              tabKey="notification"
                              count={10}
                              list={this.state.testData}
                              title="first tab"
                              emptyText="你已查看所有通知"
                              showViewMore
                            />

                          </NoticeIcon>



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
    notificationDrop: state.nav.showPopup,
  }
}


const mapDispatchToProps = dispatch => {
  return {
        closeNotification: () => dispatch(navActions.closePopup()),
        openNotification: () => dispatch(navActions.openPopup()),
        logout: () => dispatch(actions.logout())
    }
}



export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CustomLayout));
