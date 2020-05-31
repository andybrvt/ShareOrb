import React from 'react';
import {
   Form,
   DatePicker,
   TimePicker,
   Button,
   Input
  } from 'antd';

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



class ReactAddEventForm extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      dateRange: null,
      title: '',
      content: '',
      location: '',
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

  onClear = () => {

  }

  handleSubmit =(event) => {
    event.preventDefault();
    // console.log(this.state.dateRange[0].toDate(), this.state.dateRange[1].toDate())
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
         <Input name= 'title' placeholder = 'Please put title here'/>
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
        <Input name = 'content' placeholder= 'Please put content here'/>
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
       <Input name = 'location' placeholder = 'Please enter location here'/>
     </Form.Item>
        <label> RangePicker </label>
        <br />
        <Form.Item name="range-time-picker" {...rangeConfig}>
          <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" onChange = {this.onTimeChange}/>
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
