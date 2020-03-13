import React from 'react';
import { Form, Input, Icon, Button } from 'antd';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import * as actions from '../store/actions/auth';
import { QuestionCircleOutlined } from '@ant-design/icons';

const FormItem = Form.Item;

class Signup extends React.Component {
    state = {
      confirmDirty: false,
    };
    //this handle submit is a funciton that handles
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
        return callback('Password must have a upper case letter!')
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
        console.log(values.password.length)
        console.log(err)
        if (!err && values.password.length > 8) {
          this.props.onAuth(
            values.first_name,
            values.last_name,
            values.dob,
            values.email,
            values.phone_number,
            values.password,
            values.confirm,
          );
          this.props.history.push('/');
        }
    });
  }



  render() {
    const { getFieldDecorator } = this.props.form;
    console.log('test')
    console.log(this.props)
    console.log(getFieldDecorator)
      return (
        <Form onSubmit={this.handleSubmit}>

        <FormItem>
            {getFieldDecorator('first_name', {
                rules: [{ required: true, message: 'Please input your username!' }],
            })(
                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="first_name" />
            )}
        </FormItem>
        <FormItem>
            {getFieldDecorator('last_name', {
                rules: [{ required: true, message: 'Please input your username!' }],
            })(
                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="last_name" />
            )}
        </FormItem>
        <FormItem>
            {getFieldDecorator('dob', {
                rules: [{ required: true, message: 'Please input your username!' }],
            })(
                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="last_name" />
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
            <Input prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Email" />
          )}
        </FormItem>
        <FormItem>
            {getFieldDecorator('phone_number', {
                rules: [{ required: true, message: 'Please input your username!' }],
            })(
                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="last_name" />
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
            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password"/>
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
            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" onBlur={this.handleConfirmBlur} />
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
        loading: state.loading,
        error: state.error
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (first_name, last_name, dob, email, phone_number, password1, password2) => dispatch(actions.authSignup(first_name, last_name, dob, email, phone_number, password1, password2)),
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(WrappedSignup);
