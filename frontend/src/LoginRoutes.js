
import Login from './containers/LoginPage/Login';
import { Route } from 'react-router-dom';
import React from 'react';

class LoginRouter extends React.Component {

// props and this.props are two different things on the routes
  render() {

    console.log(this.props);
		return (

      <div>
        <Route exact path = '/' component = {Login} />


      </div>


    )

  }
}



export default LoginRouter;
