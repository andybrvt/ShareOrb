import React from 'react'
import { Form, Input, Button, Select } from 'antd';
import axios from 'axios';
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

// constructor(props) {
//   super(props);
//   this.state = {
//       temp1:'',
//       temp2:'',
//
//
//   };
//
//   this.handleSubmit = this.handleSubmit.bind(this);
// }

// this.setState({
//    temp1: title,
//   temp2: content,
// }, ()=> console.log(this.state.temp1, this.state.temp2));


class ProfilePost extends React.Component {
  handleSubmit = (event, requestType, articleID) => {

      const title=event.target.elements.titleInput.value;
      const content=event.target.elements.contentInput.value;


      switch ( requestType ) {
        case 'post':
          return axios.post('http://127.0.0.1:8000/api/profiles/', {
            first_name: title,
            last_name: content,
          })
          .then(res => console.log(res))
          .catch(error=> console.error(error));
        case 'put':
          console.log(articleID);
          return axios.put('http://127.0.0.1:8000/api/profiles/'+articleID+'/', {
            first_name: title,
            last_name: content,
          })
          .then(res => console.log(res))
          .catch(error=> console.error(error));
      }
    }

  render() {

    return (
      <div>
      <Form  onSubmit = {(event)=> this.handleSubmit (
        event,
        this.props.requestType,
        this.props.articleID
        )} >
        <Form.Item label="Title">
          <Input name = "titleInput"  />
        </Form.Item>

        <Form.Item label="Content">
          <Input name = "contentInput" placeholder ='Enter text here' />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            {this.props.btnText}
          </Button>
        </Form.Item>
      </Form>
      </div>
    );
  }
}

export default ProfilePost;
