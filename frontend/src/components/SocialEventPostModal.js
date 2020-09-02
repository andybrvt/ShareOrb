import React from 'react';
import {  Modal, Avatar } from 'antd';
import { Form } from '@ant-design/compatible';
import { DatePicker, TimePicker, Button, Input, Select } from 'antd';
// import { connect } from 'react-redux';
import * as dateFns from 'date-fns';


const { TextArea } = Input

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};


class SocialEventPostModal extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      title: '',
      content: '',
      startTime: '',
      endTime: '',
      location: '',
    }
  }

  handleChange = (values) => {
    this.setState({[values.target.name]: values.target.value})
  }



  render() {
    console.log(this.props)
    let curDate = ''
    if (this.props.curDate){
      curDate = dateFns.format(new Date(this.props.curDate), 'MMMM d, yyyy')
    }

    return(
      <Modal
      onCancel = {this.props.close}
      visible = {this.props.view}
      >
        <Form
        onChange = {this.handleChange}
        >
          <Form.Item>
            <Input
            name = 'title'
            placeholder = 'Title'
            value = {this.state.title}
            />
          </Form.Item>

          <Form.Item>
            <TextArea
            name = 'content'
            placeholder = 'Content'
            value = {this.state.content}
            />
          </Form.Item>

          <Form.Item>
            <TextArea
            name = 'location'
            placeholder = 'Location'
            value = {this.state.location}
            />
          </Form.Item>


        </Form>
      </Modal>
    )
  }

}


export default SocialEventPostModal;
