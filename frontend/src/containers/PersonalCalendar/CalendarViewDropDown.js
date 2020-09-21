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
    }
  }


  render() {
    console.log(this.props)

    return(
      <div>
      <Select
      onChange = {this.onCalTypeChange}
      value = {this.props.calType}
      style={{ width: 120 }}>
      <Option value = 'week'> Week </Option>
      <Option value = "day"> Day </Option>
      <Option value = 'month'> Month </Option>
      <Option value = "year"> Year </Option>
      </Select>

      </div>

    )
  }
}

export default CalendarViewDropDown;
