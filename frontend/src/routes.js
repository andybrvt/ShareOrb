import React from 'react';
import { Route } from 'react-router-dom';
import ArticleList from './containers/ArticleListView';
import ArticleDetail from './containers/ArticleDetailView';
import Login from './containers/Login';



//these routes will route to App.js
//routes component ArticleList gets a list of profile
//routes component ArticleDetail gets individual profiles
const BaseRouter = () => (
  <div>
    <Route exact path = '/' component = {ArticleList} />
    <Route exact path = '/:id' component = {ArticleDetail} />
    <Route exact path = '/login/' component = {Login} />
  </div>
);



export default BaseRouter;
