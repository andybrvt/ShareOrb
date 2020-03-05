import React from 'react';
import { Route } from 'react-router-dom';
import ArticleList from './containers/ArticleListView';
import ArticleDetail from './containers/ArticleDetailView';
import Login from './containers/Login';
import Signup from './containers/Signup'



//these routes will route to App.js
//routes component ArticleList gets a list of profile
//routes component ArticleDetail gets individual profiles
const BaseRouter = () => (
  <div>
    <Route exact path = '/' component = {ArticleList} />
    <Route exact path = '/article/:id' component = {ArticleDetail} />
    <Route exact path = '/login/' component = {Login} />
    <Route exact path = '/signup/' component= {Signup} />
  </div>
);



export default BaseRouter;
