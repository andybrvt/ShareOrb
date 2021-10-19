import React from 'react';
import logo from './logo.svg';
import landingPic from './containers/landingPic.png'
import pic2 from './containers/LoginPage/calendar.svg';
import './LandingPageNew.css';


class LandingPageNew extends React.Component{

  render(){

    // sections that we need for the landing page
    // the main head line (this will be the biggest punch line and what we provide)
    // pretty much turning followers into Storytellers

    // Who are we --> this is where we tell people what we do (specifically)
    // this is the unique selling proposition

    // the problem we are trying to solve (the key pain points of organization)
    // and how do we fix it using our app (the benefits pretty much)
    // these two can go together (show what we do and how that can help)
    // Some pictures of what we do (benefits over features)

    // why you should trust us (we are part of forge uaci, give some credentials)

    // the team

    // place for people to contact us or reacth out to give feed back

    // put focus on non profits and how we can help them

    // use more images, offer value

    // make landing page shareable

    return(
      <div>


        <div className = "headline">
          Here will be the main headline
        </div>

        <div className = "problemList">
          List the problems here
        </div>

        <div className = "aboutUs">
          Here is where we tell people what we are
        </div>
        <div className = "howItWorks">
          How it works
        </div>

        <div className = "benefits">
          Here is where you give people the benefits and how it solves their problems
          this is like what we have and how organizations can benfit
          probally gonna be a bit longer
        </div>


        <div className = 'team'>
          Team
        </div>

        <div className = "CTA">
          Call to action here, set a meeting or give feedback
        </div>

        <div className = "socialMedia">
         a  place to find our social media
        </div>


        {/*
          <div class = "circle">
          </div>

        <div class="bigContainer">
          <div class="smallContainer1">
              <img src = {logo} width = "300"  />
          </div>
          <div class="smallContainer2">

              <div class = "bigText">
                Turning Followers Into Storytellers
              </div>
              <br/>
              <br/>
              <div class = 'smallText'>
                ShareOrb brings the authenticity of user expereince to the brand
                and community to those who love what the brands do.

              </div>

          </div>

        </div>


            <div class = "imageHolder">
              <img className = "image" src = {pic2} />
            </div>

        <div>
          Stuff here
        </div>

          */}







      </div>
    )

  }


}

export default LandingPageNew;
