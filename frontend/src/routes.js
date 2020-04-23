import React from 'react';
import { Route } from 'react-router-dom';
import ArticleList from './containers/ArticleListView';
import ArticleDetail from './containers/ArticleDetailView';
import LoginForm from './containers/Login';
import Signup from './containers/Signup';
import AllUsersNotCurrNotCurrFriends from './containers/AllUsersNotCurrNotCurrFriends';
import InfiniteList from './containers/InfiniteScroll';
import UserProfile from './containers/UserProfile';
import ViewAnyUserProfile from './containers/ViewAnyUserProfile';
import FriendRequestList from './components/FriendRequestList';
import FriendsList from './containers/FriendsList';
import Chat from './containers/Chat';
import Notifications from './containers/Notifications';
import PersonalCalendar from './containers/PersonalCalendar';
import DayCalendar from './containers/DayCalendar';
import WeekCalendar from './containers/WeekCalendar';

//these routes will route to App.js
//routes component ArticleList gets a list of profile
//routes component ArticleDetail gets individual profiles

// the way you fixed

class BaseRouter extends React.Component {

// props and this.props are two different things on the routes
  render() {

    console.log(this.props);
		return (


      <div>
        <Route exact path = '/home'  render={(props) => <ArticleList {...this.props} isAuthenticated={this.props.isAuthenticated} />} />
        <Route exact path = '/article/:id' render={(props) => <ArticleDetail {...this.props} isAuthenticated={this.props.isAuthenticated} />}   />
        <Route exact path = '/' component = {LoginForm} />
        <Route exact path = '/signup/' component= {Signup} />

        <Route exact path = '/userview/' render={(props) => <AllUsersNotCurrNotCurrFriends {...this.props} isAuthenticated={this.props.isAuthenticated} />}  />
        <Route exact path = '/userview/:username' render={(props) => <ViewAnyUserProfile {...props} {...this.props} isAuthenticated={this.props.isAuthenticated} />}  />
        <Route exact path = '/current-user/' render={(props) => <UserProfile {...props} isAuthenticated={this.props.isAuthenticated} />}  />

        <Route exact path = '/friend-request-list/' render={(props) => <FriendRequestList {...this.props} isAuthenticated={this.props.isAuthenticated} />}  />
        <Route exact path = '/friends-list' render={(props) => <FriendsList {...this.props} isAuthenticated={this.props.isAuthenticated} />}  />
        <Route exact path = '/chat/:id' render={(props) => <Chat {...props} {...this.props} isAuthenticated={this.props.isAuthenticated} />}  />
        <Route exact path = '/notifications/:username' render={(props) => <Notifications {...props} {...this.props} isAuthenticated={this.props.isAuthenticated} />}  />
        <Route exact path = '/personalcalendar/' render={(props) => <PersonalCalendar {...props} {...this.props} isAuthenticated={this.props.isAuthenticated} />}  />
        <Route exact path = '/personalcalendar/:year/:month/:day' render={(props) => <DayCalendar {...props} {...this.props} isAuthenticated={this.props.isAuthenticated} />}  />
        <Route exact path = '/weekcalendar' render={(props) => <WeekCalendar {...props} {...this.props} isAuthenticated={this.props.isAuthenticated} />}  />

      </div>

      )

    }
}



export default BaseRouter;
