import React from 'react';
import axios from 'axios';
import { authAxios } from '../components/util';
import { Calendar, Badge } from 'antd';
import './Container_CSS/Calendar.css';



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

  // componentWillReceiveProps(newProps){
  //   axios.get('http://127.0.0.1:8000/userprofile/list/')
  //   .this(res => {
  //     this.setState({
  //       evnets: res.data
  //     })
  //   })
  // }

    getListData(value) {
      console.log(value)
      let listData;
      switch (value) {
        case 8:
          listData = [
            { type: 'warning', content: 'This is warning event.' },
            { type: 'success', content: 'This is usual event.' },
          ];
          break;
        case 10:
          listData = [
            { type: 'warning', content: 'This is warning event.' },
            { type: 'success', content: 'This is usual event.' },
            { type: 'error', content: 'This is error event.' },
          ];
          break;
        case 15:
          listData = [
            { type: 'warning', content: 'This is warning event' },
            { type: 'success', content: 'This is very long usual event。。....' },
            { type: 'error', content: 'This is error event 1.' },
            { type: 'error', content: 'This is error event 2.' },
            { type: 'error', content: 'This is error event 3.' },
            { type: 'error', content: 'This is error event 4.' },
          ];
          break;
        default:
      }
      return listData || [];
    }


    dateCellRender(value) {
  console.log(value)
       const count = Number(value)

       const listData = [
         { type: 'warning', content: 'This is warning event' },
         { type: 'success', content: 'This is very long usual event。。....' },
         { type: 'error', content: 'This is error event 1.' },

       ];
        // const listData = this.getListData(count);
        return (
          <ul className="events">
            {listData.map(item => (
              <li key={item.content}>
                <Badge status={item.type} text={item.content} />
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
        const count = Number(value)

        const num = 5;
          return num ? (
            <div className="notes-month">
              <section>{num}</section>
              <span>Everything displayed in a month</span>
            </div>
          ) : null;
        }

  render() {
    console.log(this.state)
    const time = this.state.events
    console.log(time)
    console.log(this.props);
    console.log(this.props.monthCellRender)
    // <Calendar />

    return (

      <Calendar dateCellRender={this.dateCellRender} monthCellRender={this.monthCellRender}/>

    )
  };
};

export default MyCalendar;
