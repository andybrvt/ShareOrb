import React from 'react';
import * as dateFns from 'date-fns';
import moment from 'moment';
import { Select } from 'antd';

const { Option } = Select;


class CalendarViewDropDown extends React.Component{



  render() {
    console.log(this.props)

    const calTypeChildren = this.renderDifferentCals()

    return(
      <div>
      <Select style={{ width: 120 }}>
      <Option value = "year"> Year </Option>
      <Option value = "week"> Week </Option>
      <Option value = "day"> Day </Option>
      </Select>

      </div>

    )
  }
}

export default CalendarViewDropDown;
