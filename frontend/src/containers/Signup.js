import React from 'react';
import 'antd/dist/antd.css';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Button } from 'antd';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import * as actions from '../store/actions/auth';
import { LockOutlined, MailOutlined, QuestionCircleOutlined, UserOutlined } from '@ant-design/icons';

const FormItem = Form.Item;

class Signup extends React.Component {
  constructor(props) {
    super(props);
  }
    state = {
      confirmDirty: false,
    };
    //this handle submit is a funciton that handles
    // the all functions from here down is use to put restrictions on fields of the signup
    compareToFirstPassword = (rule, value, callback) => {
      debugger;
      const form = this.props.form;
      if (value && value !== form.getFieldValue('password')) {
        callback('Two passwords do not match')
      } else {
        callback();
      }
    }

    validateToNextPassword = (rule, value, callback) => {
      debugger;
      const form = this.props.form;
      if (value && this.state.confirmDirty) {
        form.validateFields(['confirm'], {force: true});
      }
      callback();
    }

    validateLength = (rule, value, callback) => {
      if (value.length < 8 && value.length > 1) {
        callback('Password must be at least 8 characters!')
      } else {
      callback();
      }
    }

    validateUpper = (rule, value, callback) => {
      if(value.search(/[A-Z]/) < 0) {
        return callback('Password must have an upper case letter!')
      }else {
        callback();
        }
      }

    validateNumeric = (rule, value, callback) => {
      if(value.search(/[0-9]/) < 0) {
        return callback('Password must have a number!')
      }else {
        callback();
        }
      }

    handleSubmit = (e) => {
      e.preventDefault();
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err && values.password.length > 8) {
          this.props.onAuth(
            values.first_name,
            values.last_name,
            values.dob,
            values.bio,
            values.email,
            values.phone_number,
            values.password,
            values.confirm,
          );
          this.props.history.push('/home');
        }
    });
  }



  render() {
    const { getFieldDecorator } = this.props.form;
      return (
        <Form onSubmit={this.handleSubmit}>

        <FormItem>
            {getFieldDecorator('first_name', {
                rules: [{ required: true, message: 'Please input your first name!' }],
            })(
                <Input prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="First Name" />
            )}
        </FormItem>
        <FormItem>
            {getFieldDecorator('last_name', {
                rules: [{ required: true, message: 'Please input your last name!' }],
            })(
                <Input prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Last Name" />
            )}
        </FormItem>

        <FormItem>
            {getFieldDecorator('dob', {
                rules: [{ required: true, message: 'Please input your date of birth!' }],
            })(
                <Input prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Date of Birth" />
            )}
        </FormItem>

        <FormItem>
            {getFieldDecorator('bio', {
                rules: [{ required: true, message: 'Please input your bio!' }],
            })(
                <Input prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Biography" />
            )}
        </FormItem>
        <FormItem>

          {getFieldDecorator('email', {
            rules: [{
              type: 'email', message: 'The input is not valid E-mail!',
            }, {
              required: true, message: 'Please input your E-mail!',
            }],
          })(
            <Input prefix={<MailOutlined style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Email" />
          )}
        </FormItem>
        <FormItem>
            {getFieldDecorator('phone_number', {
                rules: [{ required: true, message: 'Please input your phone number!' }],
            })(
                <Input prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Phone Number" />
            )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{
              required: true, message: 'Please input your password!',
            }, {
              validator: this.validateToNextPassword,
            }, {
              validator: this.validateLength,
            }, {
              validator: this.validateUpper,
            }, {
              validator: this.validateNumeric,
            }],
          })(
            <Input prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password"/>
          )}
        </FormItem>

        <FormItem>
          {getFieldDecorator('confirm', {
            rules: [{
              required: true, message: 'Please confirm your password!',
            }, {
              validator: this.compareToFirstPassword,
            }],
          })(
            <Input prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" onBlur={this.handleConfirmBlur} />
          )}
        </FormItem>

        <FormItem>
          <Button type="primary" htmlType="submit" style={{marginRight: '10px'}}>
              Signup
          </Button>
          Or
          <NavLink
              style={{marginRight: '10px'}}
              to='/login/'> login
          </NavLink>
        </FormItem>
        </Form>
      );
  }
}

const WrappedSignup = Form.create()(Signup);


const mapStateToProps = (state) => {
    return {
        loading: state.auth.loading,
        error: state.auth.error
    }
}

const mapDispatchToProps = dispatch => {
  // this is where the actual sign up fucntion is called
    return {
        onAuth: (first_name, last_name, dob, bio, email, phone_number, password1, password2) => dispatch(actions.authSignup(first_name, last_name, dob, bio, email, phone_number, password1, password2)),
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(WrappedSignup);
