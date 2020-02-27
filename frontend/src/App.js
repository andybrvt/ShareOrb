import React, { Component } from 'react';
import './App.css';
import CustomLayout from './containers/Layouts';
import 'antd/dist/antd.css';
import ArticleList from './containers/ArticleListView';

class App extends Component  {
  render () {
    return (
      <div className="App">
          <CustomLayout>
            <ArticleList />
          </CustomLayout>
      </div>
    );
   }
}

export default App;
