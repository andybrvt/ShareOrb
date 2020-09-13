import React from 'react';
import './Container_CSS/Explore.css';
import ExploreWebSocketInstance from '../exploreWebsocket';
import { connect } from 'react-redux';
import * as calendarActions from '../store/actions/calendars';


class TodayEvents extends React.Component {
  constructor(props){
    super(props);
  }

  state = {
    events: [],
  }


  componentDidMount(){

    this.props.getEvents()
    console.log(this.props)
  }





  render() {


    return (
      <span >
      sdfsdfssdfsfd
        Hifffff
      </span>
    )


  }



}

const mapStateToProps = state => {
  return{
    events: state.calendar.events,


  }
}


const mapDispatchToProps = dispatch => {
  return {

    getEvents: () => dispatch(calendarActions.getUserEvents()),
  }
}
export default connect(mapStateToProps,mapDispatchToProps) (TodayEvents);
