import React from 'react';
import * as dateFns from 'date-fns';
import moment from 'moment';
import { Select } from 'antd';

const { Option } = Select;


class CalendarViewDropDown extends React.Component{
// For the drop down I will be using the current day to make the decison to loop through
// each of cal


  // onWeekClick = () => {
  //   console.log('here')
  //   if (this.props.calType === "week"){
  //     console.log('right here buddy')
  //     this.props.history.push('/personalcalendar/w/2020/9/20')
  //   }
  // }

  onCalTypeChange = (calType) => {
    console.log(calType)
    if(this.props.calType === 'week'){
      // This is for when the week cal that is when it shows up for the week
      // calendar
      const selectYear  = this.props.match.params.year;
      const selectMonth  = this.props.match.params.month;
      const selectDay  = this.props.match.params.day;
      if(calType === 'week'){
        this.props.history.push('/personalcalendar/w/'
        +selectYear+'/'+selectMonth+'/'+selectDay)
      } else if (calType === 'day'){
        this.props.history.push('/personalcalendar/'+selectYear
        +'/'+selectMonth+'/'+selectDay);
      } else if (calType === 'month'){
        this.props.history.push('/personalcalendar/'+selectYear
      +'/'+selectMonth);
    } else if (calType === 'year' ){
        this.props.history.push('/personalcalendar/'+selectYear);
      }
    } else if(this.props.calType === 'month'){
      // This will be the drop down selection for the week cal
      const curDate = new Date();
      const selectYear  = this.props.match.params.year;
      const selectMonth = this.props.match.params.month;
      // The selectedFirstday will get the first day of the
      const selectFirstDay = dateFns.getDate(dateFns.startOfWeek(curDate)).toString();
      const selectDay = dateFns.getDate(curDate).toString()
      if(calType === 'week'){
        this.props.history.push('/personalcalendar/w/'+
      selectYear + '/'+selectMonth +'/'+selectFirstDay)
      } else if (calType === 'day'){
        this.props.history.push('/personalcalendar/'+selectYear+
      '/'+selectMonth+'/'+selectDay)
      } else if (calType === 'month'){
        this.props.history.push('/personalcalendar/'+selectYear
        +'/'+selectMonth)
      } else if (calType === 'year'){
        this.props.history.push('/personalcalendar/'+selectYear)
      }
    } else if(this.props.calType === 'day'){

      // This will be the drop down selection for the day cal
      const curDay = this.props.curDate
      const firstDayWeek = dateFns.startOfWeek(curDay)
      const firstWeekDay = dateFns.getDate(firstDayWeek).toString()
      const firstWeekMonth = (dateFns.getMonth(firstDayWeek)+1).toString()
      const firstWeekYear = dateFns.getYear(firstDayWeek).toString()
      const selectYear  = this.props.match.params.year;
      const selectMonth  = this.props.match.params.month;
      const selectDay  = this.props.match.params.day;
      if (calType === 'week'){
        this.props.history.push('/personalcalendar/w/'
        +firstWeekYear+'/'+firstWeekMonth+'/'+firstWeekDay)
      } else if(calType === 'day'){
        this.props.history.push('/personalcalendar/'+selectYear+
      '/'+selectMonth+'/'+selectDay)
      } else if(calType === 'month'){
        this.props.history.push('/personalcalendar/'+selectYear
        +'/'+selectMonth)
      } else if(calType === 'year'){
        this.props.history.push('/personalcalendar/'+selectYear)
      }
    } else if(this.props.calType === 'year'){
      // This will be the drop down selection for the year
      const curDate = new Date();
      const selectDayYear = dateFns.getYear(curDate).toString();
      const selectYear = this.props.match.params.year;
      const selectMonth = (dateFns.getMonth(curDate)+1).toString();
      const selectFirstWeekMonth = (dateFns.getMonth(dateFns.startOfWeek(curDate))+1).toString()
      const selectFirstDay = dateFns.getDate(dateFns.startOfWeek(curDate)).toString();
      const selectDay = dateFns.getDate(curDate).toString()
      if (calType === 'week'){
        this.props.history.push('/personalcalendar/w/'+
      selectDayYear + '/'+selectFirstWeekMonth +'/'+selectFirstDay)
      } else if(calType === 'day'){
        this.props.history.push('/personalcalendar/'+selectDayYear+
      '/'+selectMonth+'/'+selectDay)
      } else if(calType === 'month'){
        this.props.history.push('/personalcalendar/'+selectDayYear
        +'/'+selectMonth)
      } else if(calType === 'year'){
        this.props.history.push('/personalcalendar/'+selectYear)
      }
    }
  }


  render() {
    console.log(this.props)

    return(
      <div>
      <Select
        onChange = {this.onCalTypeChange}
        value = {this.props.calType}
        style={{ width: 175, fontSize:'16px',color:'black', }}
      >
        <Option value = 'week'> <b>Week</b> </Option>
        <Option value = "day"> <b>Day</b> </Option>
        <Option value = 'month'> <b>Month</b> </Option>
        <Option value = "year"> <b>Year</b> </Option>
      </Select>

      </div>

    )
  }
}

export default CalendarViewDropDown;
