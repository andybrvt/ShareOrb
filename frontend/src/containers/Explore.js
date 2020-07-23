import React from 'react';
import './Container_CSS/Explore.css';
import ExploreWebSocketInstance from '../exploreWebsocket';
import { connect } from 'react-redux';



class Explore extends React.Component {
  constructor(props){
    super(props);
  }

  state = {

  }

  initialiseExplore(){
    this.waitForSocketConnection(()=> {
      ExploreWebSocketInstance.fetchFollowerFollowing(
        this.props.id
      )
    })
  }

  componentDidMount(){
    ExploreWebSocketInstance.connect(this.props.username)
  }

  waitForSocketConnection (callback) {
    const component = this;
    setTimeout(
      function(){

        if (ExploreWebSocketInstance.state() === 1){

          callback();
          return;
        } else{

            component.waitForSocketConnection(callback);
        }
      }, 100)

  }



  render() {
    var tabButtons= document.querySelectorAll('.tabContainer .buttonContainer button')
    var tabPanels= document.querySelectorAll('.tabContainer .tabPanel')

    console.log(tabButtons)
    console.log(tabPanels)
    function showPanel(panelIndex, colorCode){
      if (tabButtons.length > 0 && tabPanels.length > 0){
        tabButtons.forEach(function(node){
          node.style.backgroundColor = "";
          node.style.color = ""
        })
        tabButtons[panelIndex].style.backgroundColor = colorCode;
        tabButtons[panelIndex].style.color = 'white';
        tabPanels.forEach(function(node){
          node.style.display = 'none'
        })
        tabPanels[panelIndex].style.display = 'block';
        tabPanels[panelIndex].style.backgroundColor = colorCode;

      }

    }

    return (
      <div className = 'tabContainer'>
        <div className = 'buttonContainer'>
          <button onClick = {() => showPanel(0, 'blue')} > Tab 1 </button>
          <button onClick = {() => showPanel(1, 'green')}> Tab 2 </button>
          <button onClick = {() => showPanel(2, 'orange')}> Tab 3 </button>
          <button onClick = {() => showPanel(3, 'pink')}> Tab 4 </button>
        </div>
        <div className = 'tabPanel'> Tab 1: Content </div>
        <div className = 'tabPanel'> Tab 2: Content </div>
        <div className = 'tabPanel'> Tab 3: Content </div>
        <div className = 'tabPanel'> Tab 4: Content </div>
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
