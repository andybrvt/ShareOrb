import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createStore, compose, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import authReducer from './store/reducers/auth';
import navReducer from './store/reducers/nav';
import messageReducer from './store/reducers/messages';
import notificationsReducer from './store/reducers/notifications';
import calendarReducer from './store/reducers/calendars';
import calendarEventReducer from './store/reducers/calendarEvent';
import eventSyncReducer from './store/reducers/eventSync'
import {reducer as formReducer } from 'redux-form';
const composeEnhances = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose


// you can combine reducers into one reducing function using combineReducer() so you can
// pass it into create store
// The form reducer only has to be put in once for all the redux forms
const rootReducer = combineReducers({
  auth: authReducer,
  nav: navReducer,
  message: messageReducer,
  notifications: notificationsReducer,
  calendar: calendarReducer,
  calendarEvent: calendarEventReducer,
  form: formReducer,
  eventSync: eventSyncReducer
})
//store takes in reducer and an enhancer to handle the middleware

// if you are doing a webosocket, you want to throw callbacks into the app.js

const store = createStore(
   rootReducer,
   composeEnhances(applyMiddleware(thunk)
));

const app = (
    <Provider store={store}>
        <App />
    </Provider>
)

ReactDOM.render(app, document.getElementById('root'));
serviceWorker.unregister();
