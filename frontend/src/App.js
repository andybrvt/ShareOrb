import React, { Component } from 'react';
import './App.css';
import CustomLayout from './containers/Layouts';
import { connect } from 'react-redux'
import 'antd/dist/antd.css';
import BaseRouter from './routes';
import { BrowserRouter as Router } from 'react-router-dom';
import * as actions from './store/actions/auth';

// App.js imports all the routes from routes.js then it putts
//all of them in side the CustomLayout which makes a layout for them

//the BrowserRouter as Router will allow you to go through each route
// on the layout

//this will show each individual profile as well
class App extends Component  {

  compenentDidMount() {
    this.props.onTryAutoSignup();

  }

  render () {
    return (
      <div className="App">
        <Router>
          <CustomLayout {...this.props}>
            <BaseRouter />
          </CustomLayout>
        </Router>
      </div>
    );
   }
}

// map value in state
const mapStateToProps = state => {
  return {
    isAuthenticated: state.token!= null,
  }
}
// map method every time app is rendered
const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState)
  }
}



export default connect(mapStateToProps, mapDispatchToProps)(App);

// export default App;
