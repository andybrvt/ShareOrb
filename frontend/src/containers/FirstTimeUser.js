import React from 'react';
import * as dateFns from 'date-fns';
import * as actions from '../store/actions/auth';
import axios from 'axios';
import {connect} from 'react-redux';
import { authAxios } from '../components/util';
import { Divider, Checkbox, Avatar, Statistic, Button, Modal, Timeline, Input} from 'antd';

class FirstTimeUser extends React.Component{

  state ={
    checked:false,
  }

  toggleChecked = () => {
    this.setState({ checked: !this.state.checked });
  };


  onChange = e => {
    console.log('checked = ', e.target.checked);
    this.setState({
      checked: e.target.checked,
    });
  };

  hideModal = () => {

		let curId = ""
		if(this.props.curId){
			curId = this.props.curId
		}

		authAxios.post(`${global.API_ENDPOINT}/userprofile/unShowIntialInstructions/`+curId)
		.then(res => {
			// Now just change the showIntialInstructions to false
			this.props.unShowIntialInstructions(res.data)

		})




  };


  render() {
    console.log(this.props)
    let username = ""
    let firstName=""
    const curDate = dateFns.format(new Date(), "yyyy-MM-dd")
    if(this.props.username){
      username = this.props.username
    }
    if (this.props.firstName){
      firstName = this.props.firstName
    }

    let startModalText="Welcome to ShareOrb, "+firstName+"!"
    let showIntialInstructions = false;
    if(this.props.showIntialInstructions){
      showIntialInstructions = this.props.showIntialInstructions
    }
    console.log(showIntialInstructions)
      return (

        <Modal
           title={startModalText}
           visible={true} //showIntialInstructions
           onOk={this.hideModal}
           okText="Let's Go!"
           width={625}
           centered
           closable={false}
          // cancelText="取消"
            okButtonProps={{ disabled: !this.state.checked }}
          cancelButtonProps={{ style: { display: 'none' } }}
           >
        <div class="firstTimeModalText">
          We believe every day is special. Think of ShareOrb like a scrapbook and you're creating <b>only one</b> album per day.
          Let's dive into some of the features:
          <br/>
          <br/>

            <Timeline style={{marginLeft:'25px'}}>
              <Timeline.Item>
                <i style={{color:'#1890ff', marginRight:'5px'}}
                  class="fas fa-home"></i>
                Home: Every post on the newsfeed is an entire day of pictures. Let's say today is Febuary 27th right?
                Any pictures you add today will be inside today's album (on the 27th)!

              </Timeline.Item>
              <Timeline.Item>
                <i style={{color:'#1890ff', marginRight:'5px'}}
                  class="far fa-comment"></i>
                Chats: Message and schedule events with friends
              </Timeline.Item>
              <Timeline.Item>
                <i style={{color:'#1890ff', marginRight:'5px'}}
                  class="far fa-calendar-alt"></i>
                Personal Calendar: Your <b>private</b> calendar, sync with friends and plan your day
              </Timeline.Item>
              <Timeline.Item>
                <i style={{color:'#1890ff', marginRight:'5px'}}
                  class="fas fa-user-friends"></i>
                Social Calendar: Your <b>public</b> calendar. Any pictures or events you create here
                can be seen by anyone!
              </Timeline.Item>
            </Timeline>

            <Checkbox
              checked={this.state.checked}
              onChange={this.onChange}>
              Cool, I got it!
            </Checkbox>

        </div>

      </Modal>

      )
  }



}



const mapStateToProps = state => {
  return {
		firstName: state.auth.firstName,
		currentUser: state.auth.username,
    token: state.auth.token,
		curId: state.auth.id,
		profilePic: state.auth.profilePic,
		currentProfile: state.explore.profile,
		following: state.auth.following,
		sentRequestList: state.auth.sentRequestList,
		requestList: state.auth.requestList,
		showIntialInstructions: state.auth.showIntialInstructions
  }
}
const mapDispatchToProps = dispatch => {
	// function: grab user ID and username to put into forms
  return {
    grabUserCredentials: () => dispatch(actions.grabUserCredentials()),
		unShowIntialInstructions: (bool) => dispatch(actions.unShowIntialInstructions(bool))
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(FirstTimeUser);
