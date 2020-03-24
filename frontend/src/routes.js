import React from 'react';
import { Route } from 'react-router-dom';
import ArticleList from './containers/ArticleListView';
import ArticleDetail from './containers/ArticleDetailView';
import LoginForm from './containers/Login';
import Signup from './containers/Signup';
import UserView from './containers/userView';
import InfiniteList from './containers/InfiniteScroll';
import PersonalProfile from './components/PersonalProfile'
import UserProfile from './containers/UserProfile'
//these routes will route to App.js
//routes component ArticleList gets a list of profile
//routes component ArticleDetail gets individual profiles

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
        <Route exact path = '/:username/' render={(props) => <PersonalProfile {...props} isAuthenticated={this.props.isAuthenticated} />}  />
        <Route exact path = '/currentuser/' render={(props) => <UserProfile {...props} isAuthenticated={this.props.isAuthenticated} />}  />

      </div>

      )

    }
}



export default BaseRouter;
