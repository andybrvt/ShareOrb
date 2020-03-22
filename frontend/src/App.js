import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { connect } from 'react-redux';
import BaseRouter from './routes';
import 'antd/dist/antd.css';
import * as actions from './store/actions/auth';

import CustomLayout from './containers/Layouts';

class App extends Component {
//the map state to props allows us to get the state and then
//turn it to props then call those props in Layouts.js
  componentDidMount() {
  //everythign this is run it will do a try auto signup, it will give
  //App.js this method from the store
    this.props.onTryAutoSignup();
  }

  render() {
    console.log(this.props)
    return (
      <div>
        <Router>
          <CustomLayout {...this.props}>
              <BaseRouter   {...this.props}/>
          </CustomLayout>
        </Router>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.token !== null
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
