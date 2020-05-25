import React from 'react';
import { reset, Field, reduxForm } from 'redux-form';


const renderField = (field) => {
  return (
    <input {...field.input} type = {field.type} placeholder ={field.placeholder} />
  )
}

const afterSubmit = (result, dispatch) =>
  dispatch(reset('event sync add event'))

// So this form is when you pick a date and you want to schedule a time
class ReduxAddEventForm extends React.Component {

  render () {
    const {handleSubmit} = this.props
    return (
      <form onSubmit = {handleSubmit}>
      <div>
        <label htmlFor = 'title'> Title</label>
        <br />
        <Field
        name = 'title'
        component= {renderField}
        type= 'text'
        />
      </div>
      <div>
        <label htmlFor = 'content'> Content</label>
        <br />
        <Field
        name = 'content'
        component= {renderField}
        type= 'text'/>
      </div>
      <div>
        <label htmlFor = 'location'>Location</label>
        <br />
        <Field name = 'location' component= {renderField} type= 'text'/>
      </div>
      <button type = 'submit'> Submit </button>
      </form>

    )
  }

}

ReduxAddEventForm = reduxForm ({
  form: 'event sync add event',
  onSubmitSuccess: afterSubmit
}) (ReduxAddEventForm)

export default ReduxAddEventForm;
