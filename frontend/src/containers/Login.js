import React from "react";
import {
  Button,
  Form,
  Grid,
  Header,
  Message,
  Segment
} from "semantic-ui-react";
import { connect } from "react-redux";
import { NavLink, Redirect, } from "react-router-dom";
import { BrowserRouter as Router} from "react-router-dom";
import { authLogin } from "../store/actions/auth";


class LoginForm extends React.Component {
  state = {
    username: "",
    password: "",
    login: false,

  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = e => {
    // e.preventDefault();
    const { username, password } = this.state;
    this.props.login(username, password)
    this.setState({login: true })
// this.props.history.push('/home')
  };

  render() {
    console.log(this.state)
    const { error, loading, token } = this.props;
    const { username, password } = this.state;
if (token) {
       return <Redirect to="/home" />

    }
    return (
      <Grid
        textAlign="center"
        style={{ height: "100vh" }}
        verticalAlign="top"
      >
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" color="teal" textAlign="center">
            Log-in to your account
          </Header>
          {error && <p>{this.props.error.message}</p>}

          <React.Fragment>
            <Form size="large" onSubmit={this.handleSubmit}>
              <Segment stacked>
                <Form.Input
                  onChange={this.handleChange}
                  value={username}
                  name="username"
                  fluid
                  icon="user"
                  iconPosition="left"
                  placeholder="Username"
                />
                <Form.Input
                  onChange={this.handleChange}
                  fluid
                  value={password}
                  name="password"
                  icon="lock"
                  iconPosition="left"
                  placeholder="Password"
                  type="password"
                />

                <Button
                  color="teal"
                  fluid
                  size="large"
                  loading={loading}
                  disabled={loading}>
                  Login
                </Button>
              </Segment>
            </Form>
            <Message>
              New to us? <NavLink to="/signup">Sign Up</NavLink>
            </Message>
          </React.Fragment>
        </Grid.Column>
      </Grid>
    );
  }
}

const mapStateToProps = state => {
  console.log(state)
  return {
    loading: state.loading,
    error: state.error,
    token: state.token,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    login: (username, password) => dispatch(authLogin(username, password))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginForm);
