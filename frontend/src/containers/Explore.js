import React from 'react';
import './Container_CSS/Explore.css';
import ExploreWebSocketInstance from '../exploreWebsocket';
import { connect } from 'react-redux';
import AllUsersNotCurrNotCurrFriends from './AllUsersNotCurrNotCurrFriends'



class Explore extends React.Component {
  constructor(props){
    super(props);
  }

  state = {

  }

  // initialiseExplore(){
  //   this.waitForSocketConnection(()=> {
  //     ExploreWebSocketInstance.fetchFollowerFollowing(
  //       this.props.id
  //     )
  //   })
  // }

  componentDidMount(){
    // ExploreWebSocketInstance.connect(this.props.username)
    this.showPanel(0, 'transparent')
    var tabs = document.getElementsByClassName('Tab');
    Array.prototype.forEach.call(tabs, function(tab) {
	       tab.addEventListener('click', setActiveClass);
    });

    function setActiveClass(evt) {
	       Array.prototype.forEach.call(tabs, function(tab) {
		          tab.classList.remove('active');
	           });

	            evt.currentTarget.classList.add('active');
            }

  }

  // waitForSocketConnection (callback) {
  //   const component = this;
  //   setTimeout(
  //     function(){
  //
  //       if (ExploreWebSocketInstance.state() === 1){
  //
  //         callback();
  //         return;
  //       } else{
  //
  //           component.waitForSocketConnection(callback);
  //       }
  //     }, 100)
  //
  // }

  showPanel = (panelIndex, colorCode) =>{
    var tabButtons= document.querySelectorAll('.tabContainer .buttonContainer .Tab')
    var tabPanels= document.querySelectorAll('.tabContainer .tabPanel')
    if (tabButtons.length > 0 && tabPanels.length > 0){
      tabButtons.forEach(function(node){
        node.style.backgroundColor = "";
        node.style.color = "";
      })
      tabButtons[panelIndex].style.backgroundColor = colorCode;
      tabButtons[panelIndex].style.color = '#363636';
      tabPanels.forEach(function(node){
        node.style.display = 'none'
      })
      tabPanels[panelIndex].style.display = 'block';
      tabPanels[panelIndex].style.backgroundColor = colorCode;

    }

  }





  render() {

    var tabs = document.getElementsByClassName('Tab');
    Array.prototype.forEach.call(tabs, function(tab) {
	       tab.addEventListener('click', setActiveClass);
    });

    function setActiveClass(evt) {
	       Array.prototype.forEach.call(tabs, function(tab) {
		          tab.classList.remove('active');
	           });

	            evt.currentTarget.classList.add('active');
            }


    return (
      <div className = 'tabContainer'>
        <div className = 'buttonContainer'>
          <div className = 'description_tab active Tab' onClick = {() => this.showPanel(0, 'transparent')} > People</div>
          <div className = 'description_tab Tab' onClick = {() => this.showPanel(1, 'transparent')}> Posts </div>
          <div className = 'description_tab Tab' onClick = {() => this.showPanel(2, 'transparent')}> Events </div>
          <div className = 'slider'></div>
        </div>
        <div className = 'tabPanel'>
          <AllUsersNotCurrNotCurrFriends />
         </div>
        <div className = 'tabPanel'> Tab 2: Content </div>
        <div className = 'tabPanel'> Tab 3: Content </div>
      </div>
    )


  }



}

const mapStateToProps = state =>{
  return {
    id: state.auth.id,
    username: state.auth.username
  }
}

export default Explore;
