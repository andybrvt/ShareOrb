import React from 'react';
import { Route, useLocation, Switch } from 'react-router-dom';
import { withRouter } from "react-router";
import NewsFeedView from './containers/NewsFeedView.js';
import ArticleDetail from './containers/ArticleDetailView';
import Login from './containers/LoginPage/Login';
import Signup from './containers/Signup';
import AllUsersNotCurrNotCurrFriends from './containers/AllUsersNotCurrNotCurrFriends';
import Explore from './containers/Explore';
import InfiniteList from './containers/InfiniteScroll';
import ViewAnyUserProfile from './components/UserProfiles/ViewAnyUserProfile';
import PersonalProfile from './components/UserProfiles/PersonalProfile';
import FriendRequestList from './components/FriendRequestList';
import FriendsList from './containers/FriendsList';
import Chat from './containers/Chat';
import Notifications from './containers/Notifications';
import PersonalCalendar from './containers/PersonalCalendar/PersonalCalendar';
import DayCalendar from './containers/PersonalCalendar/DayCalendar';
import WeekCalendar from './containers/PersonalCalendar/WeekCalendar';
import YearCalendar from './containers/PersonalCalendar/YearCalendar';
import SideMenu from './components/SideMenu/SideMenu.js';
import NoFoundPage from './containers/403.jsx';
import ProfileCardNewsFeed from './components/ProfileCardNewsFeed';
import EventPage from './containers/PersonalCalendar/EventPage/EventPage.js'
import SocialEventPage from './containers/SocialCalendarFolder/SocialEventPage/SocialEventPage';
import testModal from './containers/SocialCalendarFolder/testModal';

//these routes will route to App.js
//routes component ArticleList gets a list of profile
//routes component ArticleDetail gets individual profiles

// the way you fixed


class BaseRouter extends React.Component {

// props and this.props are two different things on the routes

// The props are the props from routes, it gives the components its history, location, match

// I guess the match gets passed in from here so I have to make the params its own
// parameter in props (HAVE TO FIX)

// <Route exact path = '/explore/:username' render={(props) => <ViewAnyUserProfile {...props} {...this.props} isAuthenticated={this.props.isAuthenticated} />}  />
// <Route exact path = '/current-user/:username' render={(props) => <CurrUserProfile {...props} isAuthenticated={this.props.isAuthenticated} />}  />

  render() {

    console.log(this.props);
    //It is all about having that path name inside the switch (whatever the switch is
  // that would be the background)
  //Example : location = {{pathname: '/home'}}



  //FIRGURE OUT A SOLUTION TO WHY MATCH IS NOT CHANGING
    let location = this.props.location;
    console.log(location)
    if(this.props.location.state){
      location = this.props.location.state
    }
    return (


      <div class="backgroundofEverything"  style={{background:'white',minHeight:'100%',}}>
        { this.props.isAuthenticated?
        <SideMenu>

        <Switch location = {location} >


        <Route exact path = '/home'  render={(props) => <NewsFeedView {...this.props} isAuthenticated={this.props.isAuthenticated} />} />
        <Route exact path = '/test'  render={(props) => <ProfileCardNewsFeed {...this.props} isAuthenticated={this.props.isAuthenticated} />} />

        <Route exact path = '/signup/' component= {Signup} />

        <Route exact path = '/userview' render={(props) => <AllUsersNotCurrNotCurrFriends {...this.props} isAuthenticated={this.props.isAuthenticated} />}  />
        <Route exact path = '/explore' render={(props) => <Explore {...this.props} isAuthenticated={this.props.isAuthenticated} />}  />
        <Route exact path = '/explore/:username' render={(props) => <PersonalProfile parameter = {props.match.params} {...this.props} isAuthenticated={this.props.isAuthenticated} />}  />

        <Route exact path = '/friend-request-list/' render={(props) => <FriendRequestList {...this.props} isAuthenticated={this.props.isAuthenticated} />}  />
        <Route exact path = '/friends-list' render={(props) => <FriendsList {...this.props} isAuthenticated={this.props.isAuthenticated} />}  />
        <Route exact path = '/chat/:id' render={(props) => <Chat parameter = {props.match.params} {...this.props} isAuthenticated={this.props.isAuthenticated} />}  />
        <Route exact path = '/personalcalendar/:year/:month' render={(props) => <PersonalCalendar parameter = {props.match.params} {...this.props} isAuthenticated={this.props.isAuthenticated} />}  />
        <Route exact path = '/personalcalendar/:year/:month/:day' render={(props) => <DayCalendar parameter = {props.match.params} {...this.props} isAuthenticated={this.props.isAuthenticated} />}  />
        <Route exact path = '/personalcalendar/w/:year/:month/:day' render={(props) => <WeekCalendar  parameter = {props.match.params} {...this.props} isAuthenticated={this.props.isAuthenticated} />}  />
        <Route exact path = '/personalcalendar/:year' render={(props) => <YearCalendar parameter = {props.match.params} {...this.props} isAuthenticated={this.props.isAuthenticated} />}  />
        <Route exact path = '/personalcal/event/:eventId' render={(props) => <EventPage parameter = {props.match.params} {...this.props} isAuthenticated={this.props.isAuthenticated} />}  />
        <Route exact path = '/socialcal/event/:socialEventId' render={(props) => <SocialEventPage parameter = {props.match.params} {...this.props} isAuthenticated={this.props.isAuthenticated} />}  />

        </Switch>
        </SideMenu>
        :
        <div></div>
        }
        <Route exact path = '/' component = {Login} />
        {location ? <Route exact path = '/testmodal' component = {testModal} /> : null}
      </div>



      )

    }
}



export default withRouter(BaseRouter);
