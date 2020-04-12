import React from 'react';
import axios from 'axios';
import { authAxios } from '../components/util';
import { Calendar, Badge } from 'antd';
import './Container_CSS/Calendar.css';
import * as moment from 'moment';



class MyCalendar extends React.Component{

  constructor(props) {
    super(props);

  }

  state ={
    events: []
  }



  componentDidMount(){
    authAxios.get('http://127.0.0.1:8000/mycalendar/events')
    .then(res => {
      this.setState({
        events: res.data
      })



    })}

  componentWillReceiveProps(newProps){
    axios.get('http://127.0.0.1:8000/userprofile/list/')
    .then(res => {
      this.setState({
        evnets: res.data
      })
    })
  }

    getListData(value) {

      let listData;
      console.log(value)
      for (let i = 0; i < value.length; i++){
        const event = value[i]
        const stuff = event.start_time
        const date_stuff = moment(stuff)
        // console.log(event.content)
        // console.log(date_stuff.toArray())
        // console.log(stuff)
        switch(date_stuff.date()){
            case 9:
              listData = [
                {tile: event.title, content: event.content}
              ]
            default:
        }
      }
      // switch (value) {
      //   case 9:
      //     listData = [
      //       { type: 'warning', content: 'This is warning event.' },
      //     ];
      //     break;
      //   case 10:
      //     listData = [
      //       { type: 'warning', content: 'This is warning event.' },
      //       { type: 'success', content: 'This is usual event.' },
      //       { type: 'error', content: 'This is error event.' },
      //     ];
      //     break;
      //   case 16:
      //     listData = [
      //       { type: 'warning', content: 'This is warning event' },
      //       { type: 'success', content: 'This is very long usual event。。....' },
      //       { type: 'error', content: 'This is error event 1.' },
      //       { type: 'error', content: 'This is error event 2.' },
      //       { type: 'error', content: 'This is error event 3.' },
      //       { type: 'error', content: 'This is error event 4.' },
      //     ];
      //     break;
      //   default:
      // }
      return listData || [];
    }


    dateCellRender =(value,events) => {


       // const count = Number(value)
       // console.log(count)
       // const eventList = {state.events}
       // const listData = [
       //   { type: 'warning', content: 'This is warning event' },
       //   { type: 'success', content: 'This is very long usual event。。....' },
       //   { type: 'error', content: 'This is error event 1.' },
       //
       // ];
      // console.log(value)
      for(let i = 0; i < value.length; i++){
        // console.log(value[i])
        const stuff = value[i].start_time
        // console.log(stuff)
      }

      const listData = this.getListData(value);
      console.log(listData)
        return (
          <ul className="events">
            {listData.map(item => (
              <li key={item.title}>
                {item.title}
                {item.content}
              </li>
            ))}
          </ul>
        );
      }


    getMonthData(value) {
        if (value === 8) {
          return 1394;
        }
      }


    monthCellRender(value) {
      console.log(value)
        // const num = this.getMonthData(value)
        const num = 5
          return num ? (
            <div className="notes-month">
              <section>{num}</section>
              <span>Everything displayed in a month</span>
            </div>
          ) : null;
        }

  render() {
    console.log(this.state.events)
    const time = this.state.events
    console.log(time)
    console.log(this.props);
    console.log(this.props.monthCellRender)
    // <Calendar />
    // the datecellRender will run through each cell that is present in the current month, if the getListData is empty then it will not put anything
    // if there is something tho then it will put something on
    return (

      <Calendar dateCellRender={() => this.dateCellRender(this.state.events)} monthCellRender={this.monthCellRender}/>

    )
  };
};

export default MyCalendar;
