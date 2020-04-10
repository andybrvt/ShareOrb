import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  events: []
}

const addEvent = (state, action)=> {
  return updateObject(state,{
      events: [...state.events, action.events]
  })
}

const loadEvents = (state, action) =>{
  return updateObject(state, {
    events: action.events
  })
}



const reducer = (state = initialState, action) => {
  switch(action.type){
    case actionTypes.LOAD_EVENTS_CALENDAR:
      return loadEvents(state, action);
    case actionTypes.ADD_EVENT_CALENDAR:
      return addEvent(state, action);
    default:
      return state;
  }
}


export default reducer;

// once you are done with reducers, add it into index.js
