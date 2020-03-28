import React from 'react';
import { Route } from 'react-router-dom';
import ArticleList from './containers/ArticleListView';
import ArticleDetail from './containers/ArticleDetailView';
import LoginForm from './containers/Login';
import Signup from './containers/Signup';
import UserView from './containers/userView';
import InfiniteList from './containers/InfiniteScroll';
import UserProfile from './containers/UserProfile';
import UserProfileView from './containers/Profileview';
import FriendRequestList from './components/FriendRequestList';
import FriendsList from './containers/FriendsList';
//these routes will route to App.js
//routes component ArticleList gets a list of profile
//routes component ArticleDetail gets individual profiles

// the way you fixed

class BaseRouter extends React.Component {


  render() {

    console.log(this.props);
		return (


      <div>
        <Route exact path = '/home'  render={(props) => <ArticleList {...this.props} isAuthenticated={this.props.isAuthenticated} />} />
        <Route exact path = '/article/:id' render={(props) => <ArticleDetail {...props} isAuthenticated={this.props.isAuthenticated} />}   />
        <Route exact path = '/' component = {LoginForm} />
        <Route exact path = '/signup/' component= {Signup} />
        <Route exact path = '/userview/' render={(props) => <UserView {...props} isAuthenticated={this.props.isAuthenticated} />}  />
        <Route exact path = '/userview/:username' render={(props) => <UserProfileView {...props} isAuthenticated={this.props.isAuthenticated} />}  />
        <Route exact path = '/current-user/' render={(props) => <UserProfile {...props} isAuthenticated={this.props.isAuthenticated} />}  />
        <Route exact path = '/friend-request-list/' render={(props) => <FriendRequestList {...props} isAuthenticated={this.props.isAuthenticated} />}  />
        <Route exact path = '/friends-list/' render={(props) => <FriendsList {...props} isAuthenticated={this.props.isAuthenticated} />}  />


      </div>

      )

    }
}



export default BaseRouter;
