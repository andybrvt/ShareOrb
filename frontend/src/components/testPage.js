import React from 'react';
import PersonalProfile from './UserProfiles/PersonalProfile';
import SocialCalendar from '../containers/SocialCalendarFolder/SocialCalendar';
import UserPostList from '../containers/UserPostTabFolder/UserPostList';
import { Route, useLocation, Switch, Link } from 'react-router-dom';

const Profile = () => <div>Youre on the Profile Tab</div>;
const Comments = () => <div>Youre on the Comments Tab</div>;
const Contact = () => <div>Youre on the Contact Tab</div>;

class TestPage extends React.Component{


  render(){
    return(
      <div>
        <div>
        <h1> Hi there everyone </h1>
          <div>
          <Link to = {'/test'}> Profile </Link>
          <Link to = {'/test/posts'}> posts </Link>
          <Link to = {'/test/events'}> events </Link>
          </div>

          <div>
            <Switch>
              <Route path = {'/test'} exact component = {Profile} />
              <Route path = {'/test/posts'} exact component = {Comments} />
            </Switch>
          </div>

        </div>
      </div>
    )
  }

}

export default TestPage;
