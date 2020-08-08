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
import pic1 from './LoginCalendar.svg';
import pic2 from './loginHelloPic2.svg';
import 'antd/dist/antd.css';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Button, Checkbox } from 'antd';
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

    const layout = {

      // controls how far left/right the login is on the page
      labelCol: {
        span: 6,
      },
      // how long the size of user/pass input box is
      wrapperCol: {
        span: 4,
      },
    };
    const tailLayout = {
      wrapperCol: {
        offset: 6,

      },
    };

    return (
      <div>

        <div>

          <Form
          {...layout}
          name="basic"
          initialValues={{ remember: true }}
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

            <Form.Item {...tailLayout} name="remember" valuePropName="checked">
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Form.Item {...tailLayout}>
              <Button type="primary"
               onClick={this.handleSubmit}
               loading={loading}
               >
                Submit

              </Button>
            </Form.Item>
        </Form>
      </div>

      <img src={pic1} width="30%" style={{marginRight:"250px"}}/>
      <img src={pic2} width="30%"/>
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
