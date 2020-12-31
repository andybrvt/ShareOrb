import React from 'react';
import * as dateFns from 'date-fns';
import {connect} from 'react-redux';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Select, Radio, Button, Input, List, Avatar } from 'antd';
import 'antd/dist/antd.css';
import '../PersonalCalCSS/EventSync.css';
import { FireTwoTone } from '@ant-design/icons';
import DetailSwitch from './DetailSwitch.js';


const { Option } = Select

class EventSyncReactForm extends React.Component {
  constructor (props){
    super(props);
    // The time value will be whichever time range decide, 1 for week range
    // 2 for the next day
    this.state = {
      rangeChoice: '',
      endDate: '',
      friend: '',
      search: '',
      startDate: new Date(),
    }
  }

  capitalize (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  onHandleChange = (e) => {
    this.setState ({
      search: e.target.value
    })
  }

  onChange = e => {
    console.log(e.target)
    const startDate = dateFns.startOfDay(this.state.startDate)
    // console.log(startDate)
    // console.log(new Date(e.target.value))

    this.setState({
      rangeChoice: e.target.value.rangeChoice,
      endDate: e.target.value.endDate,
    });
  };

  onFriendChange = (friend) => {
    console.log(friend)
    this.setState({
      friend: friend
    })

  }

  onFriendClick = (friend) => {
    console.log(friend)
  }

  renderFriends = () => {
    let friends = []
    if(this.props.friends){
      for (let i = 0; i < this.props.friends.length; i++ ){
        friends.push(
          <Option
          key = {this.props.friends[i]}
          value = {this.props.friends[i]}>
            {this.props.friends[i]}
          </Option>
        )
      }
    }
    console.log(friends)

  }


  renderEndDay = (range) => {
    // This function will pretty much get the endDay depending on
    // which week or day is selected
    const startDate = dateFns.startOfDay(this.state.startDate)

    let endDate = ''
    let dayStartDate = ''
    let statePack = {}
    if (range === 'week' ) {
      endDate = dateFns.addWeeks(startDate,1)
      endDate = dateFns.format(endDate, 'yyyy-MM-dd')
      statePack = {
        rangeChoice: 'week',
        endDate: endDate
      }
      return statePack
    } else if (range === 'day'){
      endDate = dateFns.addDays(startDate, 2)
      endDate = dateFns.format(endDate, 'yyyy-MM-dd')
      statePack = {
        rangeChoice: 'day',
        endDate: endDate
      }
      return statePack

    }
  }

  onClear = () => {
    this.setState({
      friend: '',
      endDate: ''
    })
  }

  handleSubmit = (event) => {
    event.preventDefault();

    let submitContent = {}
    if (this.state.rangeChoice === 'day'){
      const newStartDate = dateFns.addDays(this.state.startDate, 1)
      submitContent = {
        friend: this.state.friend,
        startDate: newStartDate,
        endDate: this.state.endDate
      }
    } else if (this.state.rangeChoice === 'week'){
      submitContent = {
        friend: this.state.friend,
        startDate: this.state.startDate,
        endDate: this.state.endDate
      }
    }
    console.log(submitContent)
    this.onClear()
    this.props.onSubmit(submitContent)

  }



  render() {
    console.log(this.props)
    console.log(this.state)
    let friends = this.props.friends
    console.log(friends)
    let friend = this.state.search.trim().toLowerCase()
    if (friend.length > 0){
      friends = friends.filter(val => val.username.toLowerCase().match(friend))
    }

    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };

    const friendListChild = this.renderFriends()


    return (
      <div>
      <DetailSwitch {...this.props}/>
      </div>
    )
  }
}


const mapStateToProps = state => {
  return {
    friends: state.auth.friends,
    currentProfile: state.auth.profilePic,
  }
}


export default connect(mapStateToProps) (EventSyncReactForm);
