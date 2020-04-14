import { Form, Icon, Input, Button, Select, Radio } from 'antd';
import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as navActions from '../store/actions/nav';
import * as messageActions from '../store/actions/messages';
import { authAxios } from '../components/util';




function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class HorizontalAddChatForm extends React.Component {

  state = {
    usernames: [],
    error: null,
  }

  handleChange = value => {
    this.setState({
      usernames: value
    })
  }
  componentDidMount() {
    // To disable submit button at the beginning.
    this.props.form.validateFields();
  }

// The axios.post underneath is used to create a new chat model through the serializers
// bascially you will just pass in the usernames which you pull form the combinedUsers
// then you return an empty message and then the participants which you did the StringRelatedField
// Whenever you call the closeAddChatPopup it will make the isVisible to false
  handleSubmit = e => {
    e.preventDefault();
    const {usernames} = this.state;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const combinedUsers = [...usernames, this.props.username]
        console.log(combinedUsers)
        authAxios.post("http://127.0.0.1:8000/chat/create/", {
          messages:[],
          participants: combinedUsers
        })
        .then(res => {
          this.props.history.push(`/chat/${res.data.id}`);
          this.props.closePopup();
          this.props.getUserChats(this.props.username, this.props.token);
        })
        .catch(err => {
          console.error(err);
          this.setState({
            error:err
          });
        });
      }
    });
  };

  render() {
    console.log(this.state)
    console.log(this.props)
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

    // Only show error after a field is touched.
    const usernameError = isFieldTouched('username') && getFieldError('username');

    return (
      <Form layout="inline" onSubmit={this.handleSubmit}>
        {this.state.error ? `${this.state.error}`  : null}
        <Form.Item validateStatus={usernameError ? 'error' : ''} help={usernameError || ''}>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <Select
            mode ='tags'
            style = {{width: "100%"}}
            placeholder = "Add a user"
            onChange = {this.handleChange}>
              {[]}
            </Select>
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" disabled={hasErrors(getFieldsError())}>
            Start a chat
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

const mapStateToProps = state => {
  return {
    token: state.auth.token,
    username: state.auth.username
  }
}

const mapDispatchToProps = dispatch => {
  return{
    closePopup: () => dispatch(navActions.closePopup()),
    getUserChats: (username, token) =>
      dispatch(messageActions.getUserChats(username, token))
  }
}

const AddChatForm = Form.create({ name: 'horizontal_login' })(HorizontalAddChatForm);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AddChatForm));
