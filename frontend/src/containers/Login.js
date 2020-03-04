import React from 'react';

import { Form, Icon, Input, Button, Spin } from 'antd';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
const FormItem = Form.Item;

const antIcon = <Icon type="loading" style=
  "
    text-align: center;
    background: rgba(0, 0, 0, 0.05);
    border-radius: 4px;
    margin-bottom: 20px;
    padding: 30px 50px;
    margin: 20px 0;
  "
   spin />

class Login extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if(!err) {
        console.log("Receive values of form", values);
      }
  });
}


  render() {
    const { getFieldDecorator } = this.props.form;
      return (



        <div>
        {

        this.props.loading ?

                <Spin indicator={antIcon} />

                :
          
          <Form onSubmit =  {this.handleSubmit} className = "login-form">


          <FormItem>
          {getFieldDecorator('userName', {
              rules: [{ required: true, message: 'Please input your username!' }],
          })(
              <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
          )}
          </FormItem>

          <FormItem>
          {getFieldDecorator('password', {
              rules: [{ required: true, message: 'Please input your Password!' }],
          })(
              <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
          )}
          </FormItem>

          <FormItem>
            <Button type = "primary" htmltype="submit" style={{marginRight: '10px'}}>
              Login
            </Button>
              Or
            <NavLink style={{marginRight: '10px' }} to ='/signup/'>
              Signup
            </NavLink>
          </FormItem>

          </Form>
        </div>

      );
     }

  }

const WrappedNormalLoginForm = Form.create()(Login);

export default connect()(WrappedNormalLoginForm);
