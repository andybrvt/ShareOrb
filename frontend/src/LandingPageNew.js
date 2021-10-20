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

          <div class = "circle">
          </div>



        <div className = "headline">


          <div className = "logoNew">
            <img src = {logo} width = "200" />
          </div>

          <div className = "imageHolder">
            <img className = "image" src = {pic2} />
          </div>


          <div className = "headlineHolder">
            <div className = "mainHeadline">
              Turning Fans Into Storytellers
            </div>
            <div className = "smallHeadline">
              ShareOrb brings the authenticity of user expereince to local small business
              and community to those who love what these small businesses do.
            </div>

          </div>

        </div>

        <div className = "circle1">
        </div>

        <div className = "circle2">
        </div>


        <div className = "problemList">

          <div className = "problemHolder">
            <div className = "question1">
              <div style = {{
                  fontSize: '55px'
                }}>
                How are you supporting the small business you love?
              </div>
              <div style = {{
                  fontSize: '20px'
                }}>
                A follower on social. A like? A comment?
                Does an extra follower, or some likes really help them out?
              </div>
            </div>
          </div>

          <div className = "problemHolder2">
              <div className = "question2">
                <div style = {{
                    fontSize: '55px'
                  }} >
                  Business, you have fans that love what you do!</div>
                <div
                  style = {{
                    fontSize: '20px'
                  }}
                  > But are you still dying for some authentic stories about the great service you provide?</div>
              </div>


          </div>

        </div>



        <div className = "aboutUs">
          <div style = {{
              fontSize: '60px',
            }}>What are we?</div>

          <div className = "whatAreWe">
              ShareOrb is a social media platform where your communities are represented by your expereinces.
              We bring the small businesses and their fans together by flipping traditional nature of sharing experiences.

            </div>


        </div>


        <div className = "howItWorks">
          <div style ={{
              fontSize: '60px'}}>How it works</div>

          <div className = "featureHolder">
            <div className = "feature">There are no follower or following</div>
            <div className = "feature">You don't post directly to your profile but to the buisness you love</div>
            <div className = "feature">Fans are represented by organization they love</div>
            <div className = "feature">And organization that represented by the people who love them</div>
            <div className = "feature">Eating at a resturant? Share your expereince to that resturant's orb(that's what we call each group ;)</div>
            <div className = "feature">Snap a picture, choose the orb, post, and show your love!</div>
          </div>

      </div>

        <div className = "benefits">

          <div style = {{
              fontSize: '60px'
            }} >Why?</div>
          <div className = "whyHolders">
            <div className = "miniCircle">
            </div>
            Support your local community
            <div>You enjoy what they work hard for, why not show some love!</div>
          </div>

          <div className = "whyHolders">
            Find others who also love what you love
            <div>Live at the place or sitting on your couch find those who are sharing your experiences</div>
            <div className = "miniCircle">
            </div>
        </div>


          <div className = "whyHolders">
            <div className = "miniCircle">
            </div>
          As a business you get to show off to others how amazing your fans are
            <div>You provided an amzing product or service and people love it! Why not show it to the world</div>
          </div>




        </div>


        <div className = 'team'>
          <div>
            Ping
            <div>
              I recently graduated from the University of Arizona. I majored
              in computer science and I love strategy games. Chess and The Settlers of Catan are my favorite.

            </div>
          </div>

          <div>
            Andy
            <div>
              I also recently graduated from the University of Arizona. I majored
              in pharmacudical science and I love working out. My life motto is
              if you ain't struggling are you really living life.
            </div>
          </div>

          <div>
            We both started ShareOrb in college. We are part of the University of Arizona
            Center for Innovation and Forge.
          </div>

        </div>


        <div className = "CTA">
          If you have any feedback, let's talk! Set a meeting with us!
          Put a link here.
        </div>

        <div className = "socialMedia">
          Put instagram here
          Put tiktok here
          Put twitter here
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
