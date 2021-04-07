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
import introPic from '../intro.png'
import intro2Pic from '../intro2.png'
import introPic3 from '../introPic3.png';
import login1 from '../login1.png';
import login2 from '../login2.png';
import { NavLink, Redirect, } from "react-router-dom";
import { BrowserRouter as Router} from "react-router-dom";
import { authLogin } from "../../store/actions/auth";
import NotificationWebSocketInstance from '../../notificationWebsocket';
import { LockOutlined, UserOutlined, PhoneOutlined,  } from '@ant-design/icons';
import pic2 from './calendar.svg';
import 'antd/dist/antd.css';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Divider, Button, Checkbox, Avatar, Timeline, Alert } from 'antd';
import './Login.css';
import mainLogo from '../../logo.svg';
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

  errorShow = () => {
    // This function will the error when they give an error
    if(this.props.error){
      return "Incorrect username or password"
    }

    return ""
  }

  render() {
    console.log(this.state)
    console.log(this.props)
    const { error, loading, token } = this.props;
    const { username, password } = this.state;
    if (token) {
       return <Redirect to="/home" />
    }

    let startModalText="Welcome to ShareOrb!"


    return (

      <div>
        <div style={{
        // height:'100%',
        background:'#fafafa'}} class="parentContainer">
          <div class="one">
            {/* color is #68BFFD*/}


            <img src={mainLogo} width="20%"
              style={{position:'absolute',top:'5.5%', left:'19%'}}/>
            <div class="loginTitle">Share your everyday moments  </div>
            <div class="LeftLoginContainer">
              <div class="eventCard allStyle"
                style={{
                  position:'relative', width:'100%', top:'15%',
                   height:'75%'}}>
                <div class="loginFormInnerContent">
                  <Form

                  name="basic">

                    <Form.Item

                      onChange={this.handleUserName}
                      test="username">
                      <Input
                        size="middle"
                        prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                        placeholder="Enter Username"/>
                    </Form.Item>

                    <Form.Item
                      onChange={this.handlePasword}
                      value={password}

                      test="password">
                      <Input.Password
                         size="middle"
                         prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                         placeholder="Enter Password"/>
                       {/*
                       <div style = {{
                           color: "red"
                         }}>
                       {this.errorShow()}
                     </div>
                     */}
                  </Form.Item>
                    {/*
                    <Form.Item name="remember" valuePropName="checked">
                      <Checkbox>Remember me</Checkbox>
                    </Form.Item>

                    */}


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


            </div>

          </div>

          <div class="two">
            {/* color is #68BFFD*/}

            <img src={pic2} width="60%"
              style={{position:'relative',top:'30%', left:'15%'}}/>
          </div>

        </div>



        <div className = "backgroundBox">
          <div className = "firstInfoPageLogin">


            <div className = "loginPicFlexContainer">
              <img class="" src={introPic} />
            </div>

            <div class="loginTextFlexContainer">
              <div
                className = "headerText"
                >{startModalText}</div>

              <div className = "bodyText">
                We believe every day is special. Think of ShareOrb like a
               scrapbook of memories and there's one photo album created per day!
              </div>

            </div>


          </div>

        </div>

        <Divider />



        <div className = "secondBackgroundBox">
          <div class="secondInfoPageLogin">

            <div className = "smolLoginTextFlexContainer">
              We want to let you share photos to people you care about in the easiest and most casual way.
            </div>

            <div className = "smolLoginPicFlexContainer">



            </div>

          </div>

        </div>



        <Divider />


        <div
          className = "backgroundBox">
          <div class="firstInfoPageLogin">

            <div className = "loginPicFlexContainer">

            </div>

            <div className = "loginTextFlexContainer">

            </div>



          </div>


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
