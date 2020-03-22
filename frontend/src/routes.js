import React from 'react';
import { Route } from 'react-router-dom';
import ArticleList from './containers/ArticleListView';
import ArticleDetail from './containers/ArticleDetailView';
import LoginForm from './containers/Login';
import Signup from './containers/Signup';
import UserView from './containers/userView';
import InfiniteList from './containers/InfiniteScroll';
import PersonalProfile from './containers/PersonalProfile'
//these routes will route to App.js
//routes component ArticleList gets a list of profile
//routes component ArticleDetail gets individual profiles
console.log(this)


class BaseRouter extends React.Component {

  render() {

		console.log("HIHIHHIIHIh")
    console.log(this.props)
		return (


      <div>
        <Route exact path = '/home'  render={(props) => <ArticleList {...props} isAuthenticated={this.props.isAuthenticated} />} />
        <Route exact path = '/article/:id' component = {ArticleDetail}  />
        <Route exact path = '/' component = {LoginForm} />
        <Route exact path = '/signup/' component= {Signup} />
        <Route exact path = '/userview/' component= {UserView} />
        <Route exact path = '/test/:username/:id' component= {PersonalProfile} />

      </div>

      )

    }
}



export default BaseRouter;
