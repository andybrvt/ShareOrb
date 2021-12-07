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
import icon1 from './icon1.svg';
import './LandingPageNew.css';
import { InstagramOutlined, AntDesignOutlined,UsergroupDeleteOutlined, IdcardOutlined,HomeOutlined, ApartmentOutlined  } from "@ant-design/icons";
import { Divider } from 'antd';
import { Layout, Button, Menu } from 'antd';
const { Header, Footer, Sider, Content } = Layout;


class LandingPageNew extends React.Component {
  navSubmitVideo = () => {
    console.log("hi")
      this.props.history.push('/uploadVid/')
  }
  render(){

    // sections that we need for the landing page
    // the main head line (this will be the biggest punch line and what we provide)
    // pretty much turning followers into Storytellers

    // Who are we --> this is where we tell people what we do (specifically)
    // this is the unique selling proposition

    // the problem we are trying to solve (the key pain points of organization)
    // and how do we fix it using our app jpg(the benefits pretty much)
    // these two can go together (show what we do and how that can help)
    // Some pictures of what we do (benefits over features)

    // why you should trust us (we are part of forge uaci, give some credentials)

    // the team

    // place for people to contact us or reacth out to give feed back

    // put focus on non profits and how we can help them

    // use more images, offer value

    // make landing page shareable

    return(

        <Layout>

          <Header style = {{
              background: 'transparent',
              width: "100vw",
              padding: "0px",
              paddingLeft: '20px',
              paddingRight: '20px',
            }}>

            <div style = {{
                float: 'left'
              }}>
              <img src = {logo} width = "150" />
            </div>
            <div style = {{
                float: 'right'
              }}>
              <Menu
                style = {{
                  background: 'transparent'
                }}
                theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
                {new Array(3).fill(null).map((_, index) => {
                  const key = index + 1;
                  if(index === 0){
                      return <Menu.Item style = {{
                          width: '100px',
                          textAlign: 'center',
                          background: 'transparent',
                          color: 'black'
                        }} key={key}>About</Menu.Item>;
                  }
                  if(index === 1){
                      return <Menu.Item
                        style = {{
                          width: '100px',
                          textAlign: 'center',
                          background: 'transparent',
                          color: 'black'

                        }}
                        key={key}>Recker</Menu.Item>;
                  }
                  if(index === 2){
                      return <Menu.Item
                        style = {{
                          width: '100px',
                          textAlign: 'center',
                          background: 'transparent',
                          color: 'black'

                        }}
                        key={key}>Contact</Menu.Item>;
                  }



                })}
              </Menu>
            </div>

          </Header>
          <div class = "submitVideo">
            <Button type="primary" shape="round"
              onClick ={() =>this.navSubmitVideo()}
               style={{width:300, height:55}}
              class="buttonInSubmitVideo"
              >
              <div style={{fontSize:25, }}>Submit a Video </div>
            </Button>
          </div>
           <Content
             style = {{
               background: 'pink',
               width: '100vw',
             }}
             >
             <div style = {{
                 position: 'relative',
                 width: '100%',
                 background: 'lightgray',
                 height: '600px',
                 overflow: 'hidden'
               }}>
              <div class = "circle" />
              <div class = "circle1" />
              <div className = "imageHolder">
                <img className = "image" src = {icon1} />
              </div>

              <div className = "headlineHolder">

                <div className = "smallHeadline">
                  ShareOrb brings the authenticity of user experience to local small businesses
                  and community to those who love what these small businesses do
                </div>

              </div>
             </div>

             {/*
             <div style = {{
               position: 'relative',
               width: '100%',
               background: 'white',
               height: '600px',
               overflow: 'hidden'
               }}>

             </div>
             */}




           </Content>
           <Footer style = {{
               width: '100vw',
               textAlign: 'center'
             }}>ShareOrb ©2021 Created by ShareOrb</Footer>

            {/*
              <div>





                <div className = "headline">

                </div>

                <div className = "circle1">
                </div>

                <div className = "circle2">
                </div>


                <div className = "problemList">

                  <div className = "problemHolder">
                    <div className = "question1">
                      <div className = "problem1Text">
                        How are you supporting the small businesses you love?
                      </div>
                      <div className = "problemText2">
                        A follower on social media? A like? A comment?
                        Does an extra follower, or some likes really help them out?
                      </div>
                    </div>

                  </div>

                  <div className = "problemHolder2">
                      <div className = "question2">
                        <div className = "problem1Text">
                          Businesses, you have fans that love what you do!</div>
                        <div
                        className = "problemText2"
                          > But are you still dying for some authentic stories about the great service you provide?</div>
                      </div>


                  </div>

                </div>



                <div className = "aboutUs">
                  <div className = "whatAreWeTitle">What are we?</div>

                  <div className = "whatAreWe">
                      ShareOrb is a social media platform where your communities are represented by your experience.
                      We bring small businesses and their fans together by flipping the traditional way of sharing experiences.

                    </div>


                </div>


                <div className = "divider"/>

                <div className = "howItWorks">
                  <div className = "whatAreWeTitle">How it works</div>

                  <div className = "featureHolder">
                    <div className = "feature">
                      <UsergroupDeleteOutlined className = "icon"/>
                      There are no follower or following</div>
                    <div className = "feature">
                      <HomeOutlined className = "icon"/>
                      Post your expereince directly under your favorite business
                    </div>
                    <div className = "feature">
                      <IdcardOutlined className = "icon"/>
                      Fans are represented by businesses they support
                    </div>
                    <div className = "feature">
                      <ApartmentOutlined  className = "icon"/>
                      Find and connect with others in your local community
                    </div>
                  </div>

              </div>


              <div className = "divider"/>

                <div className = "benefits">

                  <div className = "whatAreWeTitle" >Why?</div>


                  <div className = "whyHolders">

                    <div className = "circleWidth">
                      <div className = "mediumCircle">
                        <img src = {why1} className = "whyImage" />
                      </div>

                    </div>

                    <div className = "whyWidth">

                      <div>
                        <div className = "bigWhy">Support your local community</div>
                        <div className = "smallWhy">You enjoy what they worked hard for, why not show them some love!</div>
                      </div>


                    </div>


                  </div>

                  <div className = "whyHolders">

                    <div className = "circleWidth" >

                      <div className = "mediumCircle">
                        <img src = {why2} className = "whyImage" />
                      </div>

                    </div>

                    <div className = "whyWidth">

                      <div>
                        <div className = "bigWhy">Find others who also love what you love</div>
                        <div className = "smallWhy">At the resturant or sitting on your couch find those who are sharing your experiences</div>
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
                        <div className = "bigWhy">As a business you get to show off how amazing your fans are</div>
                        <div className = "smallWhy">You provided an amzing service and people love it! Why not show it to the world!</div>
                      </div>
                    </div>



                  </div>




                </div>

                <div className = "divider"/>


                <div className = 'team'>

                  <div className = "whatAreWeTitle">Team</div>
                  <div className = "nameHolderNew">
                    <div >

                      <div className = "miniNameHolder">
                        <div className = "miniCircle">
                          <img src = {pingPic} className = "imagePicturesH" />

                        </div>
                        <div className = "bigWhy">Ping</div>
                        <div className = 'smallWhy'>
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
                        <div className = "bigWhy">Andy</div>
                        <div className = 'smallWhy'>
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
                  <br />
                  <a
                    href = "https://calendly.com/pinghsu520-1"
                     style = {{color: 'lightblue'}}>Click here</a>
                </div>

                <div className = "socialMedia">

                  <div className = "copyRight">ShareOrb ©2020 Created by ShareOrb</div>
                </div>

                  </div>


              */}

        </Layout>













    )

  }


}

export default LandingPageNew;
