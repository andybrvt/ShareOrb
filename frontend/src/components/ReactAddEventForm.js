import React from 'react';
import {
   Form,
   DatePicker,
   TimePicker,
   Button,
   Input,
  } from 'antd';
import { AimOutlined } from '@ant-design/icons';


import { connect } from "react-redux";
import './labelCSS/ReactForm.css';

const { TextArea } = Input

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
    console.log(time)
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
    this.setState({
      dateRange: null,
      title: '',
      content: '',
      location: '',
      error: {}
    })
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
      this.onClear()
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
    // The name of the inputt values are important
    // it allows for us to be able to input stuff into the form item
    // because it is what connents to the onChange for the states
    console.log(this.state)
    return (
      <Form
      className ="reactForm"
      {...formItemLayout}
      onSubmit = {this.handleSubmit}
      onChange = {this.handleChange}
       >
        <Form.Item>
         <Input
         name = 'title'
         className= 'reactTitle'
         placeholder = 'Title'
         value = {this.state.title}
         />
         <span style = {{color: 'red'}}>{this.state.error["title"]}</span>
       </Form.Item>
       <Form.Item name="Content">
        <TextArea
        name = 'content'
        className = 'reactContent'
        placeholder= 'Event Description'
        value = {this.state.content}
        rows ={4}
        style = {{width: '500px'}}/>
        <Input type = 'color' className = 'reactColor'/>

        <span style = {{color: 'red'}}>{this.state.error['content']}</span>
      </Form.Item>

      <Form.Item name="Location" style = {{height: '10px'}}>
       <Input
        name = 'location'
        className = 'reactLocation'
        placeholder = 'Location'
        value = {this.state.location}
        />
        <AimOutlined className = 'aim'/>
       <span style = {{color: 'red'}}>{this.state.error['location']}</span>
     </Form.Item>
        <Form.Item
          name="range-time-picker"
         {...rangeConfig}
          className = 'timepicker'>

          <RangePicker showTime={{
            format: 'HH:mm a',
            minuteStep : 30,
            user12Hours: true
          }} format="YYYY-MM-DD HH:mm a"
          onChange = {this.onTimeChange}
          value = {this.state.dateRange}
          />
          <span style = {{color: 'red'}}>{this.state.error['dateRange']}</span>
        </Form.Item>
        <Form.Item
          wrapperCol={{
            xs: { span: 24, offset: 0 },
            sm: { span: 16, offset: 8 },
          }}
          className = 'buttomHolder'
        >
        <div className = 'clearButtonCon'>
          <Button onClick = {this.onClear}>
            Clear Values
          </Button>
        </div>
        <div className = 'submitButtonCon'>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </div>
        </Form.Item>
      </Form>
    );
  }

}

export default ReactAddEventForm;
