import React from 'react';
import {
   Form,
   DatePicker,
   TimePicker,
   Button,
   Input
  } from 'antd';
import { connect } from "react-redux";

const { MonthPicker, RangePicker } = DatePicker;

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

const config = {
  rules: [{ type: 'object', required: true, message: 'Please select time!' }],
};

const rangeConfig = {
  rules: [{ type: 'array', required: true, message: 'Please select time!' }],
};

// The reason for switching back to the antd form is because the redux form doenst
// support time picker that well

class ReactAddEventForm extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      dateRange: null,
      title: '',
      content: '',
      location: '',
      error: {}
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = (values) => {
    this.setState({ [values.target.name]: values.target.value})
  }

  onTimeChange = (time) => {
    this.setState({
      dateRange: time
    })
  }
  handleValidation(){
    let title = this.state.title
    let content = this.state.content
    let location = this.state.location
    let dateRange = this.state.dateRange
    let errors = {}
    let formIsValid = true

    if (title === ''){
      formIsValid = false
      errors['title'] = 'Cannot be empty'
    }

    if (content === ''){
      formIsValid = false
      errors['content'] = 'Cannot be empty'
    }

    if (location === ''){
      formIsValid = false
      errors['location'] = 'Cannot be empty'
    }

    if (dateRange === null){
      formIsValid = false
      errors['dateRange'] = 'Cannot be empty'
    }

    this.setState ({
      error: errors
    })

    return formIsValid

  }

  onClear = () => {

  }

  handleSubmit =(event) => {
    event.preventDefault();
    if(this.handleValidation()){
      const submitContent = {
        title: this.state.title,
        content: this.state.content,
        location: this.state.location,
        start_time: this.state.dateRange[0].toDate(),
        end_time: this.state.dateRange[1].toDate(),
      }
      this.props.onSubmit(submitContent)
    } else {
      console.log('Form has an error')
    }
  }

  onFinish = values => {
    console.log('Success:', values);
  };

  onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };


  render (){
    console.log(this.state)
    return (
      <Form
      name="time_related_controls"
      {...formItemLayout}
      onSubmit = {this.handleSubmit}
      onChange = {this.handleChange}
       >
       <label> Title </label>
       <br />
        <Form.Item
         rules={[
           {
             required: true,
             message: 'Please input a title',
           },
         ]}
       >
         <Input name= 'title' placeholder = 'Please put title here' value = {this.state.title}/>
         <span style = {{color: 'red'}}>{this.state.error["title"]}</span>
       </Form.Item>
       <label> Content </label>
       <br />
       <Form.Item
        name="Content"
        rules={[
          {
            required: true,
            message: 'Please input some content',
          },
        ]}
      >
        <Input name = 'content' placeholder= 'Please put content here' value = {this.state.content}/>
        <span style = {{color: 'red'}}>{this.state.error['content']}</span>
      </Form.Item>
      <label> Location </label>
      <br />
      <Form.Item
       name="Location"
       rules={[
         {
           required: true,
           message: 'Please input a location',
         },
       ]}
     >
       <Input name = 'location' placeholder = 'Please enter location here' value = {this.state.location}/>
       <span style = {{color: 'red'}}>{this.state.error['location']}</span>
     </Form.Item>
        <label> RangePicker </label>
        <br />
        <Form.Item name="range-time-picker" {...rangeConfig}>
          <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" onChange = {this.onTimeChange} value = {this.state.dateRange} />
          <span style = {{color: 'red'}}>{this.state.error['dateRange']}</span>
        </Form.Item>
        <Form.Item
          wrapperCol={{
            xs: { span: 24, offset: 0 },
            sm: { span: 16, offset: 8 },
          }}
        >
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <Button type="primary">
            Clear Values
          </Button>
        </Form.Item>
      </Form>
    );
  }

}

export default ReactAddEventForm;
