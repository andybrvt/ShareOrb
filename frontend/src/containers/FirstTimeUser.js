import React from 'react';
import * as dateFns from 'date-fns';
import * as actions from '../store/actions/auth';
import axios from 'axios';
import {connect} from 'react-redux';
import { authAxios } from '../components/util';
import { Divider, Checkbox, Avatar, Statistic, Button, Modal, Timeline, Input, Steps, Card} from 'antd';
import introPic from './intro.png'
import intro2Pic from './intro2.png';
import InitialSuggestFollowers from './InitialSuggestFollowers';
const Step = Steps.Step
const steps = [{
  title: 'Welcome!',
  content: 'First-content',
}, {
  title: 'Features',
  content: 'Second-content',
}, {
  title: 'Followers',
  content: 'Last-content',
}];
const { Meta } = Card;



class FirstTimeUser extends React.Component{

  state ={
    checked:false,
    current: 0,
    // list will be the list of followers
    list: [],
    start: 10,
    counter: 5,
  }


  // For the follower page just make it similar to suggest
  // friends and put the follower list to be like a carousel
  // that shows the people and allows for them to follow

  


  toggleChecked = () => {
    this.setState({ checked: !this.state.checked });
  };


  next() {
    const current = this.state.current + 1;
    this.setState({ current });
  }

  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
  }


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
    console.log(this.state)
    let username = ""
    let firstName=""
    const curDate = dateFns.format(new Date(), "yyyy-MM-dd")
    if(this.props.username){
      username = this.props.username
    }
    if (this.props.firstName){
      firstName = this.props.firstName
    }
    let current=this.state.current
    let startModalText="Welcome to ShareOrb, "+firstName+"!"
    let showIntialInstructions = false;
    if(this.props.showIntialInstructions){
      showIntialInstructions = this.props.showIntialInstructions
    }
    console.log(showIntialInstructions)
      return (

        <Modal
           title={
             <Steps style={{padding:'10px'}} current={current}>
            {steps.map(item => <Step key={item.title} title={item.title} />)}
          </Steps>
             }
           visible={true} //showIntialInstructions
           // onOk={this.hideModal}
           okText={

               <div>{
                 current < steps.length - 1
                 && <Button type="primary" onClick={() => this.next()}>Next</Button>
               }
               {
                 current === steps.length - 1
                 && <Button type="primary" >Done</Button>
               }
               {
                 current > 0
                 && (
                 <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
                   Previous
                 </Button>
                 )
               }</div>

           }
         width={800}
           centered
           closable={false}
          // cancelText="取消"
          //  okButtonProps={{ disabled: !this.state.checked }}
          cancelButtonProps={{ style: { display: 'none' } }}
          //footer={(this.state.current==3)?null:''}
          footer={null}
           >


           <div class="firstTimeUserContainer">


           {
             (this.state.current==0)?
             <div style={{height:'90%'}}>
             <div class="firstTimeModalText">
               {startModalText} We believe every day is special. Think of ShareOrb like a
               scrapbook of memories and you're creating <b>only one</b> album per day.

             </div>
             <br/>
             <img class="firstTimeIntroPic" src={introPic} />
             </div>
             :

            <div>
              {
               (this.state.current==1)?

               <div class="firstTimeModalText" style={{marginBottom:'-25px'}}>
                 Let's dive into some of the core features:
                 <Timeline style={{marginLeft:'25px', marginTop:'25px'}}>
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
                     <img src={intro2Pic} width="75%"/>
                   </Timeline.Item>
                   <Timeline.Item>
                     <i style={{color:'#1890ff', marginRight:'5px'}}
                       class="fas fa-user-friends"></i>
                     Social Calendar: Your <b>public</b> calendar. Any pictures or events you create here
                     can be seen by anyone!
                   </Timeline.Item>
                 </Timeline>
               </div>


               :




               <div class="firstTimeModalText">
                 Let's follow some people
                 <br/>
                 <div class="suggestedPeopleIntro">
                   <InitialSuggestFollowers />
                   {/*
                     <Card
                        hoverable
                        style={{ width: 240 }}
                        cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
                      >
                        <Meta title="Europe Street beat" description="www.instagram.com" />
                      </Card>,

                      <Card
                        hoverable
                        style={{ width: 240 }}
                        cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
                      >
                        <Meta title="Europe Street beat" description="www.instagram.com" />
                      </Card>,
                     */}

                  </div>
               </div>

               }
             </div>
           }


           <div style={{float:'right'}}>
             {
               current > 0
               && (
               <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
                 Previous
               </Button>
               )
             }
             {
             current < steps.length - 1
             && <Button
             style={{ marginLeft: 8 }}
             type="primary" onClick={() => this.next()}>Next</Button>
           }
           {
             current === steps.length - 1
             && <Button
             style={{ marginLeft: 8 }}
             onClick={() => this.hideModal()} type="primary" >Done</Button>
           }

         </div>

           {/**
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
        */}




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
