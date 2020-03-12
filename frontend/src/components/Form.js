import React from 'react'
import { Form, Input, Button, Select } from 'antd';
import axios from 'axios';
import { connect } from 'react-redux';
const { Option } = Select;


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


// Form used to make submissions for new post into the post
// list
class ProfilePost extends React.Component {
  // action that takes in 3 parameter event, requestType,
  // articleID. Depending on ArticleDetailView or ArticleListView
  // the handle submit will either post or put
  handleSubmit = (event, requestType, articleID) => {

      const title=event.target.elements.titleInput.value;
      const content=event.target.elements.contentInput.value;
      axios.defaults.headers = {
				"Content-Type": "application/json",
				Authorization: this.props.token,
			}

      switch ( requestType ) {
        case 'post':
        // access the post function in that api url
          return axios.post('http://127.0.0.1:8000/api/newsfeed/', {
            first_name: title,
            last_name: content,
          })
          .then(res => console.log(res))
          .catch(error=> console.error(error));
        case 'put':
        // access the put function in that api url
          return axios.put('http://127.0.0.1:8000/api/newsfeed/'+articleID+'/', {
            first_name: title,
            last_name: content,
          })
          .then(res => console.log(res))
          .catch(error=> console.error(error));
      }
    }

//the onSubmit for will call an annoymous form and will take
// in 3 parameters when they are called in the ArticleDetailView and
// ArticleListView
  render() {
    return (
      <div>
      <Form  onSubmit = {(event)=> this.handleSubmit (
        event,
        this.props.requestType,
        this.props.articleID
        )}
        className = 'login-form'>
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

const mapStateToProps = state => {
  return {
    token: state.token
  }
}

export default connect(mapStateToProps)(ProfilePost);
