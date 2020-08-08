
import React from 'react';
import {connect} from 'react-redux';
import 'antd/dist/antd.css';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Select, Radio, Button, Input, List, Avatar } from 'antd';
import * as dateFns from 'date-fns';
import './labelCSS/EventSync.css';



const { Option } = Select

class EventSyncReactForm extends React.Component {
  constructor (props){
    super(props);
    // The time value will be whichever time range decide, 1 for week range
    // 2 for the next day
    this.state = {
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
    console.log(this.state)
    let friends = this.props.friends
    let friend = this.state.search.trim().toLowerCase()
    if (friend.length > 0){
      friends = friends.filter(val => val.toLowerCase().match(friend))
    }
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };

    const friendListChild = this.renderFriends()


    return (
      <Form
      onSubmit = {this.handleSubmit}
      className = 'eventSyncForm'
      >

      <Form.Item className = 'radioCon'>
        <Radio.Group onChange={this.onChange} value={this.state.endDate}>
          <Radio.Button

          className = 'dayEsync'
          value={this.renderEndDay('day')}>
            <span className = 'syncTitle'>Day Event Sync </span>
            <br />
            <span>({
              dateFns.format(new Date(), 'yyyy-MM-dd')
            } </span>
            -
            <span>
            {
              dateFns.format(
                dateFns.addDays(new Date(),1),
                'yyyy-MM-dd'
              )
            })
            </span>
          </Radio.Button>
          <br />
          <Radio.Button
          className = 'weekEsync'
          value={this.renderEndDay('week')}
          >
            <span className = 'syncTitle'> Week Event Sync </span>
            <br />
            <span>
            ({dateFns.format(new Date(), 'yyyy-MM-dd')}
            </span>
            -
            <span>
            {
              dateFns.format(
                dateFns.addWeeks(new Date(),1),
                'yyyy-MM-dd'
              )
            })
            </span>
          </Radio.Button>
        </Radio.Group>
      </Form.Item>
      <Form.Item className = 'friendListCon'>
      <Input
        value = {this.state.search}
        onChange = {this.onHandleChange}
        type = 'text'
        placeholder = 'Search Friends'
       />
       <List
            className = 'friendList'
            dataSource={friends}
            renderItem={item => (
              <List.Item
              key={item.username}
              className = {` friendItemHover  ${this.state.friend === item ? 'friendItem' : '' }`}
              onClick = {() => this.onFriendChange(item)}>
                <List.Item.Meta
                  avatar={
                    <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                  }
                  title={<a href="https://ant.design">{this.capitalize(item)}</a>}
                  // description={item.email}
                />
                <div>Content</div>
              </List.Item>
            )}
          >
      </List>

      </Form.Item>

      <Form.Item className ='syncButtonCon'>
      <Button
      style = {{
        backgroundColor:'dodgerblue',
        color: 'white'
      }}
      className = 'syncButton'
      htmlType = 'submit'
      disabled = {this.state.endDate === ''
      || this.state.friend === '' }
      block> Sync </Button>
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
