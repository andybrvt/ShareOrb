import React from 'react';
import { Field, reduxForm } from 'redux-form';
import * as navActions from '../store/actions/nav';
import * as calendarEventActions from '../store/actions/calendarEvent';
import { connect } from "react-redux";


// You can also validate the fields on the forms btw


// input component must be place in a Field component inorder to
// have props such as value, onChange and stuff be passed in
// Field basically replaces <input>


// So in order to have more control over your input types you can make
// your own components and pass them into the compoents of field
// The parameter can be pretty much anything
// Basically the field or parameter is basically all the props in the field is getting
// passed into the renderField
// With the props passed in, it makes it pretty 'universal' to all the Fields in the form
const renderField = (field) => {
  return (
  <input {...field.input} type = {field.type} placeholder = {field.placeholder} />
  )
}


class ReduxEditEventForm extends React.Component{

    render(){
      console.log(this.props)
      // handleSubmit will actually run this.prop.onSubmit
      const {handleSubmit} = this.props;
      // For the component of the fields you can create your own stateles function
      // to be put in there but it has to be outisde of your render
      // You can call an <input/> into the field component
      // You can put in initial values when you call the props initialValue
      // you can actually call it and modify it in a higher order component and it will change
      return(
        <form>
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
            <label htmlFor = 'start_time'>Start Time</label>
            <Field name = 'start_time' component= {renderField} type= 'date'/>
          </div>
          <div>
            <label htmlFor = 'end_time'>End Time</label>
            <Field name = 'end_time' component={renderField} type= 'date'/>
          </div>
          <div>
            <label htmlFor = 'location'>Location</label>
            <Field name = 'location' component= {renderField} type= 'text'/>
          </div>
          <button type = 'submit' onClick = {handleSubmit}>Submit</button>
          <button onClick = {(e) => this.props.onDelete(e,this.props.calendarId)}> Delete </button>
        </form>
      )
    }
  }

// So once you put everything in a field you will then put everything
// inside the reduxForm
// When you wrap your whole from around with redux form, redux form provides you
// will all sort of functions that is prep filled in redux form
// You can also design your own functions based on the given props to be put into the props too

// The redux form is what communicates with the store, it will provide props about
// the form state and functions to handle submission

// In order to modify this you have to call a constant outside the class
ReduxEditEventForm = reduxForm({
  form: 'edit event', //you will give the form a name
  enableReinitialize: true, //This will reintialzie the prestine values everytime, the props changes
})(ReduxEditEventForm);




// The gist of redux form is bascially the redux form can be modified and such and then
// you can pass those inputs into an action created by the redux form then those actions will
// be dispatched in into the reducers then the reduces will change the states and then if there is
// an onchange or whatever, changes the Fields in the forms
export default ReduxEditEventForm;
