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
      console.log(value.date())
      switch(value.date()){
          case 15:
            listData = [
              {tile: 'sup bro', content: 'going fishing'}
            ]
          default:
      }
      return listData || [];
    }


    dateCellRender =(value) => {

      console.log(value)
      const listData = []
      for(let i = 0; i < value.length; i++){
        // console.log(value[i])
        const stuff = moment(value[i])
        // const listData = this.getListData(value);
        listData.push(stuff)


      }

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
    const value = ['2020-04-15','2020-04-16','2020-04-22','2020-04-28','2020-05-11','2020-07-07','2020-07-09','2020-07-15','2020-08-18','2020-08-20','2020-08-25','2020-09-02','2020-09-07',
'2020-09-21',
'2020-09-28',
'2020-09-29',
'2020-10-14',
'2020-10-26',
'2020-11-04',
'2020-11-05',
'2020-12-02',
'2020-12-08',
'2020-12-15',
'2020-12-18',
'2020-12-31',]
    console.log(time)
    console.log(this.props);
    console.log(this.props.monthCellRender)
    // <Calendar />
    // the datecellRender will run through each cell that is present in the current month, if the getListData is empty then it will not put anything
    // if there is something tho then it will put something on
    return (

      <Calendar dateCellRender={() => this.dateCellRender(value)} monthCellRender={this.monthCellRender}/>

    )
  };
};

export default MyCalendar;
