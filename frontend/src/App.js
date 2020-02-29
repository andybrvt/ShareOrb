import React, { Component } from 'react';
import './App.css';
import CustomLayout from './containers/Layouts';
import 'antd/dist/antd.css';
import BaseRouter from './routes';
import { BrowserRouter as Router } from 'react-router-dom';


// App.js imports all the routes from routes.js then it putts
//all of them in side the CustomLayout which makes a layout for them

//the BrowserRouter as Router will allow you to go through each route
// on the layout

//this will show each individual profile as well
class App extends Component  {
  render () {
    return (
      <div className="App">
        <Router>
          <CustomLayout>
            <BaseRouter />
          </CustomLayout>
        </Router>
      </div>
    );
   }
}

export default App;
