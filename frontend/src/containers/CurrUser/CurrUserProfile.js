import React from 'react';
import { Tabs, Statistic } from 'antd';
import axios from 'axios';
import { authAxios } from '../../components/util';
import './CurrUserProfile.css';
import SocialCalendar from '../SocialCalendar'

import {
  Button,
  Label,
  FormGroup,
  Input,
  NavItem,
  NavLink,
  Nav,
  TabContent,
  TabPane,
  Container,
  Row,
  Col
} from "reactstrap";


// Function: Profile of the current user

class CurrUserProfile extends React.Component{
  constructor(props) {
    super(props);
  }
  state = {
    id:'',
		username:'',
		first_name: '',
		last_name: '',
		bio: '',
    friends: [],
  }

  async componentDidMount(){
    const username = this.props.match.params.username;
    const userID = this.props.match.params.id;
    await authAxios.get('http://127.0.0.1:8000/userprofile/current-user/')
      .then(res=> {
        this.setState({
          id:res.data.id,
          username: res.data.username,
          first_name: res.data.first_name,
          last_name: res.data.last_name,
          bio: res.data.bio,
          friends: res.data.friends,
       });
     });
   }

  render(){
        const { TabPane } = Tabs;
        function callback(key) {
          console.log(key);
        }
      return(
        <div>

          <div className="section profile-content">

          <Container >
            <div class="timeline-cover">

            </div>

            <div className="owner">
              <div className="avatar">
                <img
                  alt="..."
                  className="img-circle img-no-padding img-responsive test3"
                  src={"https://images.unsplash.com/photo-1544294932-57834439d0ba?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80"}
                />
              </div>
              <div className="name">
                <h4 className="title test">
                  Jane Faker<br />
                </h4>
                <h6 className="description">Music Producer</h6>
                  <Statistic title="Connections" value={332} />
                  <Statistic title="Following" value={23} />
                  <Statistic title="Followers" value={112893} />
              </div>
            </div>
            <Row>
              <Col className="ml-auto mr-auto text-center test2" md="6">
                <p>
                  An artist of considerable range, Jane Faker — the name taken by
                  Melbourne-raised, Brooklyn-based Nick Murphy — writes, performs
                  and records all of his own music, giving it a warm, intimate
                  feel with a solid groove structure.
                </p>
                <br />
                <Button className="btn-round" color="default" outline>
                  <i className="fa fa-cog" /> Settings
                </Button>
              </Col>
            </Row>
            <br />
            <div className="nav-tabs-navigation">
              <div className="nav-tabs-wrapper">
                <Nav role="tablist" tabs>
                  <NavItem>

                  </NavItem>
                  <NavItem>

                  </NavItem>
                </Nav>
              </div>
            </div>
            {/* Tab panes */}
            <TabContent className="following">
              <TabPane tabId="1" id="follows">
                <Row>
                  <Col className="ml-auto mr-auto" md="6">
                    <ul className="list-unstyled follows">
                      <li>
                        <Row>
                          <Col className="ml-auto mr-auto" lg="2" md="4" xs="4">

                          </Col>
                          <Col className="ml-auto mr-auto" lg="7" md="4" xs="4">
                            <h6>
                              Flume <br />
                              <small>Musical Producer</small>
                            </h6>
                          </Col>
                          <Col className="ml-auto mr-auto" lg="3" md="4" xs="4">
                            <FormGroup check>
                              <Label check>
                                <Input
                                  defaultChecked
                                  defaultValue=""
                                  type="checkbox"
                                />
                                <span className="form-check-sign" />
                              </Label>
                            </FormGroup>
                          </Col>
                        </Row>
                      </li>
                      <hr />
                      <li>
                        <Row>
                          <Col className="mx-auto" lg="2" md="4" xs="4">

                          </Col>
                          <Col lg="7" md="4" xs="4">
                            <h6>
                              Banks <br />
                              <small>Singer</small>
                            </h6>
                          </Col>
                          <Col lg="3" md="4" xs="4">
                            <FormGroup check>
                              <Label check>
                                <Input defaultValue="" type="checkbox" />
                                <span className="form-check-sign" />
                              </Label>
                            </FormGroup>
                          </Col>
                        </Row>
                      </li>
                    </ul>
                  </Col>
                </Row>
              </TabPane>
              <TabPane className="text-center" tabId="2" id="following">
                <h3 className="text-muted">Not following anyone yet :(</h3>
                <Button className="btn-round" color="warning">
                  Find artists
                </Button>
              </TabPane>
            </TabContent>


          </Container>
          <Tabs
          style = {{
            // backgroundColor:'blue',
            textAlign: 'center'
            // position: 'relative',
            // left: '200px'
          }}
           onChange={callback}
           type="card"
           centered = {true}>
            <TabPane
            style = {{
              // backgroundColor: 'red',
              width: '1760px'
            }}
            tab="Social Calendar" key="1">
              <SocialCalendar />
            </TabPane>
            <TabPane tab="Pictures" key="2">
              Picture album
            </TabPane>
            <TabPane tab="Profile" key="3">
              Profile
            </TabPane>
          </Tabs>
          </div>
        </div>
      )
    }
  };

export default CurrUserProfile;
