import React from 'react';
import { Route } from 'react-router-dom';
import Chat from './containers/Chat'
//these routes will route to App.js
//routes component ArticleList gets a list of profile
//routes component ArticleDetail gets individual profiles

// the way you fixed

class Router extends React.Component {

// props and this.props are two different things on the routes
  render() {

    console.log(this.props);
		return (


      <div>
        <Route exact path = '/home'  render={(props) => <ArticleList {...this.props} isAuthenticated={this.props.isAuthenticated} />} />
        <Route exact path = '/article/:id' render={(props) => <ArticleDetail {...this.props} isAuthenticated={this.props.isAuthenticated} />}   />
        <Route exact path = '/' component = {LoginForm} />
        <Route exact path = '/signup/' component= {Signup} />
        <Route exact path = '/userview/' render={(props) => <UserView {...this.props} isAuthenticated={this.props.isAuthenticated} />}  />
        <Route exact path = '/userview/:username' render={(props) => <UserProfileView {...this.props} isAuthenticated={this.props.isAuthenticated} />}  />
        <Route exact path = '/current-user/' render={(props) => <UserProfile {...props} isAuthenticated={this.props.isAuthenticated} />}  />
        <Route exact path = '/friend-request-list/' render={(props) => <FriendRequestList {...this.props} isAuthenticated={this.props.isAuthenticated} />}  />
        <Route exact path = '/friends-list/' render={(props) => <FriendsList {...this.props} isAuthenticated={this.props.isAuthenticated} />}  />
        <Route exact path = '/chat/:id' render={(props) => <Chat {...props} {...this.props} isAuthenticated={this.props.isAuthenticated} />}  />

      </div>

      )

    }
}



export default BaseRouter;
