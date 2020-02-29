import React from 'react'
import { Form, Input, Button, Select } from 'antd';

const { Option } = Select;
// const layout = {
//   labelCol: { span: 8 },
//   wrapperCol: { span: 16 },
// };
// const tailLayout = {
//   wrapperCol: { offset: 8, span: 16 },
// };


// <Form {...layout} ref={this.formRef} name="control-ref" >
// <Form {...layout} ref={this.formRef} name="control-ref" >

class ProfilePost extends React.Component {



  constructor(props) {
    super(props);
    this.state = {
        temp1:'',
        temp2:'',


    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
      event.preventDefault();
      const title=event.target.elements.titleInput.value;
      const content=event.target.elements.contentInput.value;

      this.setState({
         temp1: title,
        temp2: content,
      }, ()=> console.log(this.state.temp1, this.state.temp2));

    }






  render() {

    return (

      <Form onSubmit = {this.handleSubmit} >
        <Form.Item label="Title">
          <Input name = "titleInput"  />
        </Form.Item>

        <Form.Item label="Content">
          <Input name = "contentInput" placeholder ='Enter text here' />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default ProfilePost;
