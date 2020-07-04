import React from 'react';
import {connect} from 'react-redux';
import { Form,  Select, Radio, Button} from 'antd';
import * as dateFns from 'date-fns';


const { Option } = Select

class EventSyncReactForm extends React.Component {
  constructor (props){
    super(props);
    // The time value will be whichever time range decide, 1 for week range
    // 2 for the next day
    this.state = {
      endDate: '',
      friend: '',
      startDate: new Date(),
    }
  }

  onChange = e => {
    console.log(e.target)
    this.setState({
      endDate: e.target.value,
    });
  };

  onFriendChange = (friend) => {
    console.log(friend)
    this.setState({
      friend: friend
    })
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

    return friends
  }


  renderEndDay = (range) => {
    // This function will pretty much get the endDay depending on
    // which week or day is selected
    const startDate = dateFns.startOfDay(this.state.startDate)

    let endDate = ''
    if (range === 'week' ) {
      endDate = dateFns.addWeeks(startDate,1)
      endDate = dateFns.format(endDate, 'yyyy-MM-dd')
      return endDate
    } else if (range === 'day'){
      endDate = dateFns.addDays(startDate, 1)
      endDate = dateFns.format(endDate, 'yyyy-MM-dd')
      return endDate
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

    const submitContent = {
      friend: this.state.friend,
      startDate: this.state.startDate,
      endDate: this.state.endDate
    }
    this.onClear()
    this.props.onSubmit(submitContent)

  }



  render() {
    console.log(this.props)
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };

    const friendListChild = this.renderFriends()


    return (
      <Form
      onSubmit = {this.handleSubmit}
      >

      <Form.Item>
        <Radio.Group onChange={this.onChange} value={this.state.endDate}>
          <Radio.Button
          style = {{
          height: '60px',
          border: 'none',
          borderLeft: '1px solid lightgrey'}}
          className = 'dayEsync'
          value={this.renderEndDay('day')}>
            Day Event Sync
            <br />
            <span>{
              dateFns.format(new Date(), 'yyyy-MM-dd')
            } </span>
            -
            <span>
            {
              dateFns.format(
                dateFns.addDays(new Date(),1),
                'yyyy-MM-dd'
              )
            }
            </span>
          </Radio.Button>
          <br />
          <Radio.Button
          style = {{
          height: '60px',
          border: 'none'}}
          className = 'weekEsync'
          value={this.renderEndDay('week')}
          >
            Week Event Sync
            <br />
            <span>
            {dateFns.format(new Date(), 'yyyy-MM-dd')}
            </span>
            -
            <span>
            {
              dateFns.format(
                dateFns.addWeeks(new Date(),1),
                'yyyy-MM-dd'
              )
            }
            </span>
          </Radio.Button>
        </Radio.Group>
      </Form.Item>
      <Form.Item>
      <Select
      size='large'
      style={{ width: 200 }}
      onChange = {this.onFriendChange}
      value = {this.state.friend}
      >
          {friendListChild}
        </Select>
      </Form.Item>

      <Form.Item>
      <Button htmlType = 'submit'> Sync </Button>
      </Form.Item>
      </Form>
    )
  }
}


const mapStateToProps = state => {
  return {
    friends: state.auth.friends
  }
}


export default connect(mapStateToProps) (EventSyncReactForm);
