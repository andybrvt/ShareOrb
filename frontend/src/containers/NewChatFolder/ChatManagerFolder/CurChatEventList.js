import React from 'react';
import { List, Avatar, Input, Divider } from 'antd';
import * as dateFns from 'date-fns';
import './ChatManager.css'
import userIcon from '../../../components/images/user.png';


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

        <div className = "chatEventShareLeft">
          <div className = "searchChatContainer">
            <form className = "searchForm">
              <Input
              placeHolder = "Search Events"
              className = "input"
               />
            </form>
          </div>

          <div className = "eventListContainer">
          <List
             itemLayout="horizontal"
             dataSource={eventList}
             renderItem={item => (
               <div
               style = {{
                 backgroundColor: item.color
               }}
               className = "chatEvent">

                <div className = "title">
                  {item.title}
                </div>

                <div className ="infoBox">
                  <div>
                    <div className = "date">
                      <i class="far fa-calendar"></i>
                      <span className = "text"> {dateFns.format(new Date(item.start_time), "MMM dd, yyyy")} </span>
                    </div>
                    <div className = "times">
                      <i class="far fa-clock"></i>
                      <span className = "text">{dateFns.format(new Date(item.start_time),'h:mm a')}-{dateFns.format(new Date(item.end_time),'h:mm a')}</span>
                    </div>
                  </div>
                    <div className = "numPeople">
                      <i class="far fa-user"></i>
                      <span className = "text">{item.person.length}</span>
                    </div>
                </div>

                <div className = "shareEventButton">
                  <i class="fas fa-user-plus"></i>
                </div>

               </div>



             )}
            />
            </div>
          </div>


          <Divider
          style = {{
            height: "500px",
            color: "black"
          }}
          type = "vertical"  />


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
