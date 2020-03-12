import React from 'react';
import { Route } from 'react-router-dom';
import ArticleList from './containers/ArticleListView';
import ArticleDetail from './containers/ArticleDetailView';
import Login from './containers/Login';
import Signup from './containers/Signup';
import UserView from './containers/userView';
import InfiniteList from './containers/InfiniteScroll'
//these routes will route to App.js
//routes component ArticleList gets a list of profile
//routes component ArticleDetail gets individual profiles
const BaseRouter = () => (
  <div>
    <Route exact path = '/' component = {ArticleList} />
    <Route exact path = '/infinite/' component = {InfiniteList} />
    <Route exact path = '/article/:id' component = {ArticleDetail} />
    <Route exact path = '/login/' component = {Login} />
    <Route exact path = '/signup/' component= {Signup} />
    <Route exact path = '/userview/' component= {UserView} />
  </div>
);



export default BaseRouter;
