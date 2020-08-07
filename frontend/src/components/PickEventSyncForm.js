import React from 'react';
import { reset, Field, reduxForm } from 'redux-form';
import './labelCSS/ReduxForm.css';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Input } from 'antd';
import { AimOutlined, ArrowRightOutlined } from '@ant-design/icons';


const { TextArea } = Input

const required = value => value ? undefined : '*Required'

const renderField = (field) => {
return (
    <Input
    {...field.input}
    type = {field.type}
    placeholder= {field.placeholder}
    className = 'box'/>
  )
}

const renderTextArea = (field) => {
  return (
    <TextArea
    {...field.input}
    type = {field.type}
    placeholder= {field.placeholder}
    rows = {4}
    className = 'box'
    />
  )
}

const renderEventColor = (field) => {
  // This is just used to render the color of the event
  return (
    <Input
    type = 'color'
    className = 'reduxColor'
    name = 'eventColor'
    defaultValue = '#01D4F4'
    {...field.input}/>
  )
}

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const config = {
  rules: [{ type: 'object', required: true, message: 'Please select time!' }],
};

const rangeConfig = {
  rules: [{ type: 'array', required: true, message: 'Please select time!' }],
};




const afterSubmit = (result, dispatch) =>
  dispatch(reset('event sync add event'))
// This is to reset the values of the form


// So this form is when you pick a date and you want to schedule a time
class ReduxAddEventForm extends React.Component {
  render () {
    console.log(this.props)
    const {handleSubmit, pristine, invalid, reset, submitting, error } = this.props
    return (
      <form className = 'eventSyncPickerForm'>
      <div className = 'reduxTitle'>
        <Field
        name = 'title'
        label = 'Title'
        component= {renderField}
        type= 'text'
        validate = {required }
        placeholder = 'Title'
        />
      </div>
      <div className = 'reduxContent'>
        <Field
        name = 'content'
        label = 'Content'
        component= {renderTextArea}
        type= 'text'
        validate = {required}
        placeholder = 'Description'
        />
      </div>
      <div className = 'reduxLocation'>
        <Field name = 'location'
        name = 'location'
        label = 'Location'
        component= {renderField}
        type= 'text'
        validate = {required}
        placeholder = 'Location'
        />
        <AimOutlined className = 'aim'/>
        <Field
          name = 'eventColor'
          component = {renderEventColor}
          type = 'text'
          // validate = {}
          />
      </div>
      {error && <strong style = {{color: 'red'}}>{error}</strong>}
      <div className = 'eventSyncButton'>
      <div className = 'clearButton' >
        <Button
        diabled = {pristine}
        onClick= {reset}>Clear Values</Button>
      </div>
      <div className = 'eventSyncButton'>
        <Button
          type = 'primary'
          onClick = {handleSubmit}
          disabled = {invalid || this.props.active === null}>
          Send Event
        </Button>
      </div>
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
