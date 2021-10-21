import React from 'react';
import logo from './logo.svg';
import landingPic from './containers/landingPic.png'
import andyPic from './andyPic.jpg'
import pingPic from './pingPic.jpg'
import why1 from './why1.jpg'
import why2 from './why2.jpg'
import why3 from './why3.jpg'
import forge from './forge.png'
import uaci from './uaci.png'
import pic2 from './containers/LoginPage/calendar.svg';
import './LandingPageNew.css';
import { InstagramOutlined, AntDesignOutlined } from "@ant-design/icons";
import { Divider } from 'antd';


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
jpg
          <div className = "imageHolder">
            <img className = "image" src = {pic2} />
          </div>


          <div className = "headlineHolder">
            <div className = "mainHeadline">
              Turning Fans Into Storytellers
            </div>
            <div className = "smallHeadline">
              ShareOrb brings the authenticity of user expereince to local small business
              and community to those who love what these small businesses do
            </div>

          </div>

        </div>

        <div className = "circle1">
        </div>
jpg
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
            </div>    <Divider />

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


        <div className = "divider"/>

        <div className = "howItWorks">
          <div style ={{
              fontSize: '60px'}}>How it works</div>

          <div className = "featureHolder">
            <div className = "feature">There are no follower or following</div>
            <div className = "feature">Post your expereince directly under your favorite business</div>
            <div className = "feature">Fans are represented by organization they support</div>
            <div className = "feature">Find and connect with others in your community</div>
          </div>

      </div>


      <div className = "divider"/>

        <div className = "benefits">

          <div style = {{
              fontSize: '60px'
            }} >Why?</div>


          <div className = "whyHolders">

            <div className = "circleWidth">
              <div className = "mediumCircle">
                <img src = {why1} className = "whyImage" />
              </div>

            </div>

            <div className = "whyWidth">

              <div>
                <div className = "bigWhy">Support your local community</div>
                <div className = "smallWhy">You enjoy what they work hard for, why not show some love!</div>
              </div>


            </div>


          </div>

          <div className = "whyHolders">

            <div className = "whyWidth">

              <div>
                <div className = "bigWhy">Find others who also love what you love</div>
                <div className = "smallWhy">Live at the place or sitting on your couch find those who are sharing your experiences</div>
              </div>

            </div>

            <div className = "circleWidth" >

              <div className = "mediumCircle">
                <img src = {why2} className = "whyImage" />
              </div>

            </div>

        </div>


          <div className = "whyHolders">


            <div className = "circleWidth">
              <div className = "mediumCircle">
                <img src = {why3} style = {{
                    height: '100%',
                    position: 'relative',
                    right: '20%'
                  }} />
              </div>
            </div>

            <div className = "whyWidth">
              <div>
                <div className = "bigWhy">As a business you get to show off to others how amazing your fans are</div>
                <div className = "smallWhy">You provided an amzing product or service and people love it! Why not show it to the world</div>
              </div>
            </div>



          </div>




        </div>

        <div className = "divider"/>


        <div className = 'team'>

          <div style = {{
              fontSize: '60px'
            }}>Team</div>
          <div className = "nameHolderNew">
            <div >

              <div className = "miniNameHolder">
                <div className = "miniCircle">
                  <img src = {pingPic} className = "imagePicturesH" />

                </div>
                <div style = {{
                    fontSize: '40px'
                  }}>Ping</div>
                <div style = {{
                    fontSize: '25px'
                  }}>
                  I recently graduated from the University of Arizona. I majored
                  in computer science and I love strategy games. Chess and The Settlers of Catan are my favorite.

                </div>
              </div>

            </div>

            <div>

              <div className = "miniNameHolder">
                <div className = "miniCircle">
                  <img src = {andyPic} className = "imagePictures" />
                </div>
                <div style = {{
                    fontSize: '40px'
                  }}>Andy</div>
                <div style = {{
                    fontSize: '25px'
                  }}>
                  I also recently graduated from the University of Arizona. I majored
                  in pharmacudical science and I love working out. My life motto is
                  if you ain't struggling are you really living life.
                </div>

              </div>


            </div>
          </div>




          <div className = "incuHolder">
            <div className = "halfImageHolder">



                <img src = {forge} className = "incu"/>
                <img src = {uaci} className = "incu" />


            </div>


          </div>



        </div>

        <div className = "divider"/>


        <div className = "CTA">
          If you have any feedback, let's talk! Set a meeting with us!
          <div>Put link here</div>
        </div>

        <div className = "socialMedia">

          <div className = "copyRight">ShareOrb ©2020 Created by ShareOrb</div>
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
