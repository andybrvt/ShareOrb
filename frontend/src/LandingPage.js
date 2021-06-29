import React from 'react';


class LandingPage extends React.Component{
  constructor(props){

    super(props)
  }


  state = {
    email: ''
  }

  handleEmailChange = e => {
    console.log(e.target.value)
    this.setState({
      email: e.target.value
    })
  }

  render(){
    return(
      <div>
        <div>
          <form>
            <label>
              Email:
              <input
                type ="text"
                placeholder = "example@mail.com"
                onChange = {this.handleEmailChange}
                value = {this.state.email}
                />
              <button> Join </button>
            </label>

          </form>

          <button> Check place in line </button>

        </div>

      </div>
    )
  }

}

export default LandingPage;
