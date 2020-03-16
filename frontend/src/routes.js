import React from 'react';
import { Route } from 'react-router-dom';
import ArticleList from './containers/ArticleListView';
import ArticleDetail from './containers/ArticleDetailView';
import LoginForm from './containers/Login';
import Signup from './containers/Signup';
import UserView from './containers/userView';
import InfiniteList from './containers/InfiniteScroll'
import PostUpload from './components/Forms2'
//these routes will route to App.js
//routes component ArticleList gets a list of profile
//routes component ArticleDetail gets individual profiles
const BaseRouter = () => (
  
  <div>
    <Route exact path = '/' component = {ArticleList} />
    <Route exact path = '/article/:id' component = {ArticleDetail} />
    <Route exact path = '/login/' component = {LoginForm} />
    <Route exact path = '/signup/' component= {Signup} />
    <Route exact path = '/userview/' component= {UserView} />
    <Route exact path = '/addtest/' component= {PostUpload} />
  </div>
);



export default BaseRouter;
