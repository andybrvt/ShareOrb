import React from 'react';
import { reset, Field, reduxForm } from 'redux-form';
import { DatePicker } from 'antd';

const { MonthPicker, RangePicker } = DatePicker

// The reason you want to get the props to change is because even though you are
// adding stuff in and changing the values of the different events, the props does
// not change if you dont make a change to it so therefore I am making a new form and
// modifiying the modals to change the props
// The reason also I switch to props is because with states, it doesnt change right
// away when you edit events and later on we have to be working with sharing events
// and stuff so states will not work

const renderField = (field) => {
  return (
  <input {...field.input} type = {field.type} placeholder = {field.placeholder} />
  )
}

const renderTimeField = (field) => {
  return (
    <div>
    <RangePicker showTime format="YYYY-MM-DD HH:mm:ss"/>
    </div>
  )
}

// this will delete the iunputs after submit
const afterSubmit = (result, dispatch) =>
  dispatch(reset('add event'));


class ReduxAddEventForm extends React.Component {

  render () {
    const {handleSubmit, pristine, submitting, reset} = this.props
    return (
      <form onSubmit= {handleSubmit}>
        <div>
          <label htmlFor = 'title'> Title</label>
          <Field
          name = 'title'
          component= {renderField}
          type= 'text'
          />
        </div>
        <div>
          <label htmlFor = 'content'> Content</label>
          <Field name = 'content' component= {renderField} type= 'text'/>
        </div>
        <div>
          <label htmlFor = 'start_date'>Start Time</label>
          <Field name = 'start_date' component= {renderField} type= 'date'/>
        </div>
        <div>
          <label htmlFor = 'end_date'>End Time</label>
          <Field name = 'end_date' component={renderField} type= 'date'/>
        </div>
        <div>
          <label htmlFor = 'location'>Location</label>
          <Field name = 'location' component= {renderField} type= 'text'/>
        </div>
        <div>
        <Field
        name = 'time'
        type = 'text'
        component = {renderTimeField} />
        </div>
        <button type = 'submit'>Submit</button>
        <button type = 'button' disabled = {pristine || submitting} onClick = {reset}>
        Clear Values
        </button>
      </form>
    )
  }
}


ReduxAddEventForm = reduxForm ({
  form: 'add event',
  onSubmitSuccess: afterSubmit,
})(ReduxAddEventForm);

export default ReduxAddEventForm;
