import React from 'react';
import { List, Avatar, Input } from 'antd';
import * as dateFns from 'date-fns';
import './ChatManager.css'


// This will be used to display the list and search of the events
// that you can share with the person that you are chatting with

class CurChatEventList extends React.Component{
  capitalize (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }




  render(){
    console.log(this.props)


    let eventList = []
    if(this.props.eventList){
      eventList = this.props.eventList
    }

      return(
        <div className = "chatEventShare">
        <div className = "searchChatContainer">
          <form className = "searchForm">
            <Input
            className = "input"
             />
          </form>
        </div>

        <div className = "eventListContainer">
        <List
           itemLayout="horizontal"
           dataSource={eventList}
           renderItem={item => (
             <div className = "chatEvent">
              <div className = "title">
                {item.title}
              </div>
              <div className = "times">
              {dateFns.format(new Date(item.start_time),'h:mm a')}-{dateFns.format(new Date(item.end_time),'h:mm a')}
              </div>
              <div className = "numPeople">
              {item.person.length}
              </div>
              <div className = "location">
              {item.location}
              </div>

             </div>
           )}
          />
          </div>


          <div
          className = "chatEventButton"
          >
            <button> Create shared event </button>
          </div>

        </div>
      )
    }
  }

export default CurChatEventList;
