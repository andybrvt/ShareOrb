import React from "react";
// import {
//   Button,
//   Form,
//   Grid,
//   Header,
//   Message,
//   Segment
// } from "semantic-ui-react";
import { connect } from "react-redux";
import { NavLink, Redirect, } from "react-router-dom";
import { BrowserRouter as Router} from "react-router-dom";
import { authLogin } from "../../store/actions/auth";
import NotificationWebSocketInstance from '../../notificationWebsocket';

import pic2 from './calendar.svg';
import 'antd/dist/antd.css';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Button, Checkbox, Avatar } from 'antd';
import './Login.css';
// Function: logs user in
class LoginForm extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    username: "",
    password: "",
    login: false,

  };

  handleUserName = e => {
     const tempVal = e.target.value;
     console.log(e.target)
     console.log(tempVal)
     console.log(e.target.test)
    this.setState({ username: tempVal});
  };

  handlePasword = e => {
     const tempVal = e.target.value;
     console.log(e.target)
     console.log(tempVal)
     console.log(e.target.test)
    this.setState({password: tempVal});
  };

  handleSubmit = e => {
    const { username, password } = this.state;
    console.log(username)
    console.log(password)
    this.props.login(username, password)
    this.setState({login: true })
  };

  render() {
    console.log(this.state)
    const { error, loading, token } = this.props;
    const { username, password } = this.state;
if (token) {
       return <Redirect to="/home" />
    }


    return (
      <div style={{
      // height:'100%',
      background:'#fafafa'}} class="parentContainer">
        <div class="one">
          {/* color is #68BFFD*/}



          <div class="loginTitle">Connecting people through calendars test4</div>
            <div class="eventCard allStyle" style={{left:'20%',
            width:'80%', height:'40%', padding:'75px'}}>

              <Form
              name="basic"
              initialValues={{ remember: true }}
              // onSubmit = {this.handleSubmit}
              >
                <Form.Item
                onChange={this.handleUserName}
                test="username"
                label="Username"

                >
                  <Input />
                </Form.Item>

                <Form.Item
                  onChange={this.handlePasword}
                  value={password}
                  test="password"
                  label="Password"
                >
                  <Input.Password />
                </Form.Item>

                <Form.Item name="remember" valuePropName="checked">
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>



                <Form.Item>
                  <Button
                   htmlType = 'submit'
                   type="primary"
                   shape="round"
                   size="large"
                   onClick={this.handleSubmit}
                   loading={loading}
                   >
                    Log In

                  </Button>
                  <div>  New? <NavLink to="/signup">Sign Up</NavLink></div>
                </Form.Item>

                </Form>
              </div>
        </div>

        <div class="two">
          {/* color is #68BFFD*/}

          <img src={pic2} width="33%"
            style={{position:'relative',top:'25%', left:'15%'}}/>
        </div>



      </div>
    );
  }
}

const mapStateToProps = state => {
  // you get the token here
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    token: state.auth.token,
  };
};

const mapDispatchToProps = dispatch => {
  // the actual login in function is in here and this is from redux (store)
  return {
    login: (username, password) => dispatch(authLogin(username, password))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginForm);
