import React from 'react';
import { Modal } from 'antd';
import * as eventSyncActions from '../store/actions/eventSync';
import { connect } from 'react-redux';
import axios from 'axios';
import { authAxios } from './util';


// Unlike the event sync modal, this is where you would pick the
// time you would like to be good to meet up
// The eventsyncmodal is just to send the request


class PickEventSyncModal extends React.Component{
  constructor(props){
    super(props);
  }

  state = {
    syncEvents: []
  }

  componentDidMount () {
    const person = this.props.userFriend
    const date_min = this.props.minDate
    const date_max = this.props.maxDate
    console.log(person, date_min, date_max)
    authAxios.get('http://127.0.0.1:8000/mycalendar/testEvents/', {
      params:{
        person,
        date_min,
        date_max
      }
    }) .then(res =>{
      console.log(res)
    })
  }

  componentWillReceiveProps (newProps){
    // friend is the person you are sending the request to
    // Person is the person sending the request
    // You want to get both events from both people and then add it to the
    // same list so then you can render then on a min week check box
    const friend = newProps.userFriend
    const date_min = newProps.minDate
    const date_max = newProps.maxDate
    const person = newProps.currentUser
    let combineEvents = []
    authAxios.get('http://127.0.0.1:8000/mycalendar/testEvents/', {
      params:{
        person,
        date_min,
        date_max
      }
    }) .then(res =>{
      for(let i = 0; i<res.data.length; i++){
        combineEvents.push(res.data[i])
      }
    })
    authAxios.get('http://127.0.0.1:8000/mycalendar/testEvents/', {
      params:{
        friend,
        date_min,
        date_max
      }
    }) .then(res =>{
      for(let i = 0; i<res.data.length; i++){
        combineEvents.push(res.data[i])
      }
    })
    console.log(combineEvents)
    this.setState({
      syncEvents: combineEvents
    })
  }

  // Now that you can pull the data from both users, now you will make a mincalendar
  // where you can pick a date (remeber to use websocket so it sends over properly)

  render () {
    console.log(this.props)
    console.log(this.state)
    return(
      <div>
        <Modal
          centered
          footer = {null}
          visible = {this.props.isVisble}
          onCancel = {this.props.close}>
          {this.props.currentUser}
          <br />
          {this.props.userFriend}
          <br />
          {this.props.minDate}
          <br />
          {this.props.maxDate}
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return{
    currentUser: state.auth.username,
    userFriend: state.eventSync.userFriend,
    minDate: state.eventSync.minDate,
    maxDate: state.eventSync.maxDate
  }
}

export default connect(mapStateToProps)(PickEventSyncModal);
