import React from 'react';
import { reset, Field, reduxForm } from 'redux-form';
import './labelCSS/ReduxForm.css'

const required = value => value ? undefined : '*Required'

const renderField = ({ input, label, type, meta: {touched, error, warning} }) => (
  <div>
    <label className = 'label'>{label}</label>
    <div>
      <input {...input} type = {type} placeholder ={label} />
      {touched && ((error && <span style = {{color: 'red'}}>{error}</span>) || (warning && <span style = {{ color: 'red'}}>{warning}</span>))}
    </div>
  </div>
  )


const afterSubmit = (result, dispatch) =>
  dispatch(reset('event sync add event'))

// So this form is when you pick a date and you want to schedule a time
class ReduxAddEventForm extends React.Component {
  render () {
    const {handleSubmit, pristine, reset, submitting, error } = this.props
    return (
      <form onSubmit = {handleSubmit}>
        <Field
        name = 'title'
        label = 'Title'
        component= {renderField}
        type= 'text'
        validate = {[ required ]}
        />
        <Field
        name = 'content'
        label = 'Content'
        component= {renderField}
        type= 'text'
        validate = {[ required ]}
        />
        <Field name = 'location'
        name = 'location'
        label = 'Location'
        component= {renderField}
        type= 'text'
        />
        {error && <strong style = {{color: 'red'}}>{error}</strong>}
      <div>
      <button type = 'submit' disabled = {submitting}> Submit </button>
      <button type = 'button' diabled = {pristine || submitting} onClick= {reset}>Clear Values</button>
      </div>
      </form>

    )
  }

}

ReduxAddEventForm = reduxForm ({
  form: 'event sync add event',
  onSubmitSuccess: afterSubmit
}) (ReduxAddEventForm)

export default ReduxAddEventForm;
