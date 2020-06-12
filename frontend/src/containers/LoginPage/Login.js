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
import city from './city.png';
import { Form, Input, Button, Checkbox } from 'antd';
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
      labelCol: { span: 8 },
      wrapperCol: { span: 8 },
    };
    const tailLayout = {
      wrapperCol: { offset: 8, span: 4 },
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

        <img src={city} />
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



      // <Grid
      //   textAlign="center"
      //   style={{ height: "100vh" }}
      //   verticalAlign="top"
      // >
      //   <Grid.Column style={{ maxWidth: 450 }}>
      //     <Header as="h2" color="teal" textAlign="center">
      //       Log-in to your account
      //     </Header>
      //     {error && <p>{this.props.error.message}</p>}
      //     <React.Fragment>
      //       <Form size="large" onSubmit={this.handleSubmit}>
      //         <Segment stacked>
      //           <Form.Input
      //             onChange={this.handleChange}
      //             value={username}
      //             name="username"
      //             fluid
      //             icon="user"
      //             iconPosition="left"
      //             placeholder="Username"
      //           />
      //           <Form.Input
      //             onChange={this.handleChange}

      //             fluid
      //             value={password}
      //             name="password"
      //             icon="lock"
      //             iconPosition="left"
      //             placeholder="Password"
      //             type="password"
      //           />
      //
      //           <Button
      //             color="teal"
      //             fluid
      //             size="large"
      //             loading={loading}
      //             disabled={loading}>
      //             Login
      //           </Button>
      //         </Segment>
      //       </Form>
      //       <Message>
      //         New to us? <NavLink to="/signup">Sign Up</NavLink>
      //       </Message>
      //     </React.Fragment>
      //   </Grid.Column>
      // </Grid>
