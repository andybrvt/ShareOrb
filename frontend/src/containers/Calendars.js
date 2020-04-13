import React from 'react';
import axios from 'axios';
import { authAxios } from '../components/util';
import { Calendar, Badge, Alert } from 'antd';
import './Container_CSS/Calendar.css';
import * as moment from 'moment';



class MyCalendar extends React.Component{

  constructor(props) {
    super(props);

  }

  state = {
    value: moment('2017-04-25'),
    selectedValue: moment('2017-04-25'),
  };



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


  onPanelChange = value => {
    this.setState({ value });
  };

  onSelect = value => {
    this.setState({
      value,
      selectedValue: value,
    });
  };

    getListData(value) {
      console.log(value)
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




      const testvalue= moment('2017-04-25');
      const listData2 = [
        {tile: 'sup my sister', content: 'going bowling'}
      ]

      const testData=listData2['content'];





      console.log(value)
      const listData = [
        {tile: 'sup bro', content: 'going fishing'}
      ]
      // const listData = [] ADD THIS BAKC IN WHEN ITS NOT HARDCORDED
      for(let i = 0; i < value.length; i++){

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





            <li key='blah'>
              {testData}
            </li>


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


    const { value, selectedValue } = this.state;


    // <Calendar />
    // the datecellRender will run through each cell that is present in the current month, if the getListData is empty then it will not put anything
    // if there is something tho then it will put something on
    //
    //
    // to SELECT a date: <Calendar value={value} onSelect={(e)=>{console.log(e)}}/>
    return (


      <div>
        <Alert
          message={`You selected date: ${selectedValue && selectedValue.format('YYYY-MM-DD')}`}
        />
        <Calendar value={value}  dateCellRender={() => this.dateCellRender(value)} monthCellRender={this.monthCellRender} onSelect={this.onSelect} onPanelChange={this.onPanelChange}/>
      </div>





    )
  };
};

export default MyCalendar;
