import React from 'react';
import { Field, reduxForm } from 'redux-form';

// input component must be place in a Field component inorder to
// have props such as value, onChange and stuff be passed in
// Field basically replaces <input>
class ReduxFormTest extends React.Component{

    onSubmit = () => {
      console.log('hi')
    }

    render(){
      console.log(this.props)
      const {handleSubmit} = this.props;
      return(
        <form onSubmit= {handleSubmit}>
          <div>
            <label htmlFor = 'title'> Title</label>
            <Field name = 'title' component= 'input' type= 'text'/>
          </div>
          <div>
            <label htmlFor = 'content'> Content</label>
            <Field name = 'content' component= 'input' type= 'text'/>
          </div>
          <div>
            <label htmlFor = 'strat_time'>Start Time</label>
            <Field name = 'start_time' component= 'input' type= 'date'/>
          </div>
          <div>
            <label htmlFor = 'end_time'>Email</label>
            <Field name = 'end_time' component= 'input' type= 'date'/>
          </div>
          <div>
            <label htmlFor = 'location'>Email</label>
            <Field name = 'location' component= 'input' type= 'text'/>
          </div>
          <button type = 'submit'>Submit</button>
        </form>
      )
    }
  }

// So once you put everything in a field you will then put everything
// inside the reduxForm
// When you wrap your whole from around with redux form, redux form provides you
// will all sort of functions that is prep filled in redux form
// You can also design your own functions based on the given props to be put into the props too
ReduxFormTest = reduxForm({
  form: 'contact', //you will give the form a name
})(ReduxFormTest);

export default ReduxFormTest;
