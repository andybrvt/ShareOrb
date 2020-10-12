import React from 'react';
import './EventPage.css';
import {Button} from 'antd';
import ReduxEditEventForm from '../EditCalEventForms/ReduxEditEventForm';

class EventInfo extends React.Component{

  constructor(props){
    super(props);


  }

  state = {
    edit: false
  }

  onEditClick = () => {
    // This will activate the edit so that you can start editing events
    this.setState({
      edit: true
    })
  }

  onCancelEventClick = () => {
    this.setState({
      edit: false
    })
  }

  render(){
    console.log(this.props)
    let username = ''
    let title = ''
    let content = ''
    let start_time = ''
    let end_time = ''
    let color = ''
    if(this.props.info){
      if(this.props.info.host){
        username = this.props.info.host.username
      }
      if(this.props.info.title){
        title = this.props.info.title
      }
      if(this.props.info.content){
        content = this.props.info.content
      }
      if(this.props.info.start_time){
        start_time = this.props.info.start_time
      }
      if(this.props.info.end_time){
        end_time = this.props.info.end_time
      }
      if(this.props.info.color){
        color = this.props.info.color
      }

    }

    return(
      <div className = 'eventInfoContainer'>
      {
        this.state.edit ?
        <div>
        <ReduxEditEventForm />

          <div>
          <Button
          onClick = {() => this.onCancelEventClick()}
          >
            Cancel
          </Button>
          </div>
        </div>
        :

        <div>
          Host: {username}
          <br />
          Title: {title}
          <br />
          Content: {content}
          <br />
          Start time: {start_time}
          <br />
          End time: {end_time}

          <div>
            <Button
            onClick= {() => this.onEditClick()}
            >
            Edit
            </Button>
          </div>
        </div>


      }





      </div>

    )
  }
}

export default EventInfo;
