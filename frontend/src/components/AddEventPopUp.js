import React from 'react';
import { Modal } from 'antd';
import CalendarForm from './CalendarForm';
import EditEventForm from './EditEventForm';
import ReduxFormTest from './ReduxFormTest';
import * as navActions from '../store/actions/nav';
import * as calendarEventActions from '../store/actions/calendarEvent';
import { connect } from "react-redux";
import * as dateFns from 'date-fns';



class AddEventPopUp extends React.Component {
  //         <EditEventForm  {...this.props}/>
  submit = (values) => {
    console.log(values)
  }

  // So you pass the intial values into your form but you will have to pass
  // it as a dictioanry with each one being a key corresponding with each input
  getInitialValue = () => {
    console.log(dateFns.format(new Date(this.props.start_time), 'yyyy-MM-dd'))
    return{
      title: this.props.title,
      content: this.props.content,
      start_time: dateFns.format(new Date(this.props.start_time), 'yyyy-MM-dd'),
      end_time: dateFns.format(new Date(this.props.end_time), 'yyyy-MM-dd'),
      location: this.props.location
    }
  }


  render () {
    console.log(this.props)
    return (
      <div>
        <Modal
          centered
          footer = {null}
          visible = {this.props.isVisible}
          onCancel= {this.props.close}
        >
        <ReduxFormTest
        onSubmit = {this.submit}
        initialValues = {this.getInitialValue()}  />
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    title: state.calendarEvent.title,
    content: state.calendarEvent.content,
    start_time: state.calendarEvent.start_time,
    end_time: state.calendarEvent.end_time,
    location: state.calendarEvent.location,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    closePopup: () => dispatch(navActions.closePopup()),
    changeEvent: (e) => dispatch(calendarEventActions.changeCalendarEvent(e))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddEventPopUp);
