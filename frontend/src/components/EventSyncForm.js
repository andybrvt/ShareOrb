import React from 'react';
import { reset, Field, reduxForm } from 'redux-form';
import {connect} from 'react-redux';


const renderField = (field) => {
  return (
      <input {...field.input} type = {field.type} placeholder = {field.placeholder}/>
  )
}

const afterSubmit = (result, dispatch) =>
  dispatch(reset('event sync'))

class EventSyncForm extends React.Component {
  render () {
    console.log(this.props)
    const {handleSubmit} = this.props
    return (
      <form onSubmit = {handleSubmit}>
      <h2> Event Sync </h2>
      <div>
        <label htmlFor = 'minDate'> Min Date </label>
        <Field
        name = 'minDate'
        type = 'date'
        component = {renderField}
        />
      </div>
      <div>
        <label htmlFor = 'maxDate'> Max Date </label>
        <Field
        name = 'maxDate'
        type = 'date'
        component = {renderField}
        />
      </div>

      <div>
        <label htmlFor = 'friendSelect'> Friend </label>
        <Field
        name = 'friend'
        component ='select' >
          <option></option>
          {this.props.friends ? this.props.friends.map(friends =>
            <option value = {friends}> {friends} </option>) : <option></option>}
        </Field>
      </div>
      <button type = 'submit'> Submit</button>
      </form>
    )
  }
}

EventSyncForm = reduxForm ({
  form: 'event sync',
  onSubmitSuccess: afterSubmit,
})(EventSyncForm)

const mapStateToProps = state => {
  return{
    friends: state.auth.friends
  }
}

export default connect(mapStateToProps)(EventSyncForm);
