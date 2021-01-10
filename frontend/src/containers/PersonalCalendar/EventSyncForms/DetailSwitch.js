import BannerAnim from 'rc-banner-anim';
import QueueAnim from 'rc-queue-anim';
import { TweenOneGroup } from 'rc-tween-one';
import Icon from 'antd/lib/icon';
import PropTypes from 'prop-types';
import React from "react";
import './DetailSwitch.css';
import { Select, Radio, Button, Input, List, Divider, Avatar, Card, message} from 'antd';
import dayPic from './dayPic.svg';
import friendsPic from './friends.svg';
import bicylePic from './bicycle.svg';
import gamingPic from './gaming.svg';
import notesPic from './notes.svg';
import * as dateFns from 'date-fns';
import { Form } from '@ant-design/compatible';
import { FireTwoTone } from '@ant-design/icons';
import {connect} from 'react-redux';
import Animate from 'rc-animate';

const { Option } = Select
const Element = BannerAnim.Element;
const { Meta } = Card;

let count=0;

let dataArray = [
  {
    color: '#faad14',
    background: '#fa8c16',
  },
  {
    color: '#1890ff',
    background: '#2f54eb',
  },



];

const success = () => {
  message.success('Sent out Event Sync Invite');
};

class DetailSwitch extends React.Component {


  static defaultProps = {
    className: 'details-switch-demo',
  };

  constructor(props) {
    super(props);
    this.state = {
      pageNum:0,
      isPageTween: false,
      show: true,
      friendPerson:null,
      rangeChoice: '',
      endDate: '',
      startDate: new Date(),
      showInt: 0,
      delay: 0,
      search: '',
      imgAnim: [
        { translateX: [0, 300], opacity: [1, 0] },
        { translateX: [0, -300], opacity: [1, 0] },
      ],
    };
    this.oneEnter = false;
  }

  capitalize (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  onChange = e => {
    console.log(e.target)
    const startDate = dateFns.startOfDay(this.state.startDate)
    this.setState({
      rangeChoice: e.target.value.rangeChoice,
      endDate: e.target.value.endDate,
    });
  };

  onFriendChange = (friend) => {

    this.setState({
      friendPerson: friend,
      isPageTween: true,
      show: !this.state.show,
    })



  }


  handleSubmit = (event) => {
    event.preventDefault();

    let submitContent = {}
    if (this.state.rangeChoice === 'day'){
      const newStartDate = dateFns.addDays(this.state.startDate, 1)
      submitContent = {
        friend: this.state.friendPerson,
        startDate: newStartDate,
        endDate: this.state.endDate
      }
    } else if (this.state.rangeChoice === 'week'){
      submitContent = {
        friend: this.state.friendPerson,
        startDate: this.state.startDate,
        endDate: this.state.endDate
      }
    }
    console.log(submitContent)
    this.props.onSubmit(submitContent)

  }

  renderEndDay = (range) => {
    // This function will pretty much get the endDay depending on
    // which week or day is selected
    const startDate = dateFns.startOfDay(this.state.startDate)

    let endDate = ''
    let dayStartDate = ''
    let statePack = {}
    if (range === 'week' ) {
      endDate = dateFns.addWeeks(startDate,1)
      endDate = dateFns.format(endDate, 'yyyy-MM-dd')
      statePack = {
        rangeChoice: 'week',
        endDate: endDate
      }
      return statePack
    } else if (range === 'day'){
      endDate = dateFns.addDays(startDate, 2)
      endDate = dateFns.format(endDate, 'yyyy-MM-dd')
      statePack = {
        rangeChoice: 'day',
        endDate: endDate
      }
      return statePack

    }
  }

  onChangeAnimation = () => {
    if (!this.oneEnter) {
      this.setState({ delay: 300 });
      this.oneEnter = true;
    }
  }


  onHandleChange = (e) => {
    this.setState ({
      search: e.target.value
    })
  }

  onLeft = () => {
    let showInt = this.state.showInt;
    showInt=showInt-1;
    console.log(showInt+" :this is before")
    const imgAnim = [
      { translateX: [0, -300], opacity: [1, 0] },
      { translateX: [0, 300], opacity: [1, 0] },
    ];
    if (showInt <= 0) {
      showInt = 0;
    }
    this.setState({ showInt, imgAnim });
    console.log(showInt+" :this is after")
    this.bannerImg.prev();
    this.bannerText.prev();

  };

  onRight = () => {
    let showInt = this.state.showInt;
    const imgAnim = [
      { translateX: [0, 300], opacity: [1, 0] },
      { translateX: [0, -300], opacity: [1, 0] },
    ];
    showInt += 1;
    if (showInt > dataArray.length - 1) {
      showInt = dataArray.length - 1;
    }
    this.setState({ pageNum:this.state.pageNum+1, showInt, imgAnim });
    console.log(this.state.pageNum)
    this.bannerImg.next();
    this.bannerText.next();
  };

  getDuration = (e) => {
    if (e.key === 'map') {
      return 800;
    }
    return 1000;
  };




  renderFriends = () => {
    let friends = []
    if(this.props.friends){
      for (let i = 0; i < this.props.friends.length; i++ ){
        friends.push(
          <Option
          key = {this.props.friends[i]}
          value = {this.props.friends[i]}>
            {this.props.friends[i]}
          </Option>
        )
      }
    }
    console.log(friends)

  }

  render() {
    console.log(this.props)
    console.log(this.state)
    console.log(this.props.currentProfile)
    let friends = this.props.friends
    let personPic1=`${global.IMAGE_ENDPOINT}`+this.props.currentProfile
    let picArray=[gamingPic, notesPic, personPic1]
    console.log(friends)
    let friend = this.state.search.trim().toLowerCase()
    if (friend.length > 0){
      friends = friends.filter(val => val.username.toLowerCase().match(friend))
    }
    console.log(this.bannerImg)
    const imgChildren = dataArray.map((item, i) => (


      <Element
        key={i}
        style={{
          background: item.color,
          height: '100%',
        }}
        leaveChildHide
       >

         {


           (this.state.pageNum==0)?

          <QueueAnim
            animConfig={this.state.imgAnim}
            duration={this.getDuration}
            delay={[!i ? this.state.delay : 7000, 0]}
            ease={['easeOutCubic', 'easeInQuad']}
            key="img-wrapper"
          >

          {/*if the page count is 1*/}
            <div className={`${this.props.className}-map map${i}`} key="map">
              <img style={{marginLeft:'100px'}} src={`${global.IMAGE_ENDPOINT}`+picArray[0]} width="100%" />
            </div>

            <div style={{marginTop:'225px' }} className={`${this.props.className}-map map${i}`} key="map">
              <img style={{marginLeft:'100px'}} src={`${global.IMAGE_ENDPOINT}`+picArray[1]} width="100%" />
            </div>
              {/*if the page count is 2*/}

          </QueueAnim>

          :
          <span>
            <QueueAnim
              animConfig={this.state.imgAnim}
              duration={this.getDuration}
              delay={[!i ? this.state.delay : 300, 0]}
              ease={['easeOutCubic', 'easeInQuad']}
              key="img-wrapper"
            >

            {/*if the page count is 1*/}
              <div className={`${this.props.className}-map map${i}`} key="map">

                <Card
                  hoverable

                  style={{ width: 225, height:260, left:'50%', marginTop:'-25px'}}
                  cover={

                    <span class="containImage">
                      <img alt="example" src={`${global.IMAGE_ENDPOINT}`+picArray[2]} />
                    </span>
                  }
                >
                  <Meta title="Ping Hsu" description="@admin" />
                </Card>

              </div>
                {/*if the page count is 2*/}

            </QueueAnim>

            {
              (this.state.friendPerson!=null)?
                <div style={{marginLeft:'157px', marginTop:'325px'}}>
                    <div class="fade-in">
                      <Card
                        hoverable
                        style={{ width: 225, height:260}}
                        cover={
                            <span class="containImage">
                              <img

                                alt="example" src={`${global.IMAGE_ENDPOINT}`+this.state.friendPerson.profile_picture} />
                            </span>
                        }
                      >
                        <Meta title="Ping Hsu" description={"@"+this.state.friendPerson.username} />
                      </Card>
                    </div>
                </div>
                :
                <div></div>
              }

            :
            <div></div>

          </span>

          }


      </Element>));

    const textChildren = dataArray.map((item, i) => {
      console.log(dataArray);
      const { title, content, background } = item;
      return (<Element key={i}>

        {
        (this.state.pageNum==0)?

        <div>
          <QueueAnim type="bottom"
            duration={1500}
             delay={[!i ? this.state.delay + 500 : 800, 0]}>

            <h1 style={{marginTop:'30px'}} key="h1">{'Day View'}</h1>
            <em key="em" style={{ background }} />
            <p key="p">{
              <div class="eventSyncForm">
                <div className = 'radioCon'>

                <Radio.Button
                  onClick={this.onRight}
                  className = 'dayEsync buttonGrow'
                  onChange={this.onChange}
                  style={{marginBottom:'20px'}}
                  value={this.renderEndDay('day')}>
                    <span className = 'syncTitle'>Day Event Sync </span>
                    <br />
                    <span>
                    ({
                      dateFns.format(
                        dateFns.addDays(new Date(),1),
                        'MM/dd'
                      )
                    })
                    </span>
                  </Radio.Button>
                </div>


              </div>
          }</p>


          </QueueAnim>


        <QueueAnim type="bottom"
          duration={1500}
           delay={[!i ? this.state.delay + 500 : 800, 0]}>

          <h1 style={{ marginTop:'125px'}} key="h1">{'Week View'}</h1>
          <em key="em" style={{ background }} />
          <p key="p">{
            <div class="eventSyncForm">
              <div className = 'radioCon'>
            <Radio.Button
              onClick={this.onRight}
              onChange={this.onChange}
              className = 'weekEsync buttonGrow'
              style={{marginBottom:'20px'}}
              value={this.renderEndDay('week')}
            >
              <span className = 'syncTitle'> Week Event Sync </span>
              <br />
              <span>
              ({dateFns.format(new Date(), 'MM/dd')}
              </span>
              -
              <span>
              {
                dateFns.format(
                  dateFns.addWeeks(new Date(),1),
                  'MM/dd'
                )
              })
              </span>
            </Radio.Button>

          </div>
        </div>
        }</p>


        </QueueAnim>
      </div>
        :

        <QueueAnim type="bottom"
          duration={1200}
          delay={[!i ? this.state.delay : 300, 0]}>

        <div>
          <Form
          onSubmit = {this.handleSubmit}
          className = 'eventSyncForm'
          >
            <Form.Item className = 'friendListCon'>
            <Input
              style={{width:'425px'}}
              value = {this.state.search}
              onChange = {this.onHandleChange}
              type = 'text'
              placeholder = 'Find a Friend'
             />


             <List
                  className = 'friendList'
                  dataSource={friends}
                  style={{padding:'1px',width:'425px'}}
                  renderItem={item => (
                    <List.Item
                    key={item.username}
                    className = {` friendItemHover  ${this.state.friend === item ? 'friendItem' : '' }`}
                    onClick = {() => this.onFriendChange(item)}
                    style={{padding:'15px'}}
                    >
                      <List.Item.Meta
                        avatar={
                          <Avatar
                          src={`${global.IMAGE_ENDPOINT}`+item.profile_picture} />
                        }
                        title={<a>{this.capitalize(item.first_name)+" "+this.capitalize(item.last_name)}</a>}
                        description={"@"+item.username}
                      />


                  </List.Item>

                  )}
                >
            </List>

            </Form.Item>

            <Form.Item>
            <Button
            style = {{
              backgroundColor:'dodgerblue',
              color: 'white',
              width:'425px',
            }}
            shape="round"
            onClick={success}
            htmlType = 'submit'
            disabled = {this.state.endDate === ''
            || this.state.friend === '' }
            block> Send Invite</Button>
            </Form.Item>

          </Form>

          <div style={{float:'right', marginTop:'100px', fontSize:'50px'}}>
            <i onClick={this.onLeft} class="fas fa-arrow-circle-left"></i>
          </div>

        </div>

      </QueueAnim>
      }
      </Element>
    );
    });

    // const textChildren2 = dataArray.map((item, i) => {
    //   console.log(dataArray);
    //   const { title, content, background } = item;
    //   return (<Element
    //     style={{
    //       background: item.color,
    //       height: '100%',
    //     }}
    //      key={i}>
    //
    //
    //     <div>
    //       <QueueAnim type="bottom"
    //         duration={1500}
    //          delay={[!i ? this.state.delay + 500 : 800, 0]}>
    //
    //         <h1 key="h1">{'Day View'}</h1>
    //         <em key="em" style={{ background }} />
    //         <p key="p">{
    //             <div>test</div>
    //
    //       }</p>
    //
    //
    //       </QueueAnim>
    //
    //
    //     <QueueAnim type="bottom"
    //       duration={1500}
    //        delay={[!i ? this.state.delay + 500 : 800, 0]}>
    //
    //       <h1 style={{ marginTop:'125px'}} key="h1">{'Week View'}</h1>
    //       <em key="em" style={{ background }} />
    //       <p key="p">{
    //         <div>test2</div>
    //     }</p>
    //
    //
    //     </QueueAnim>
    //   </div>
    //
    //   </Element>
    // );
    // });


    return (

      <div
      className={`${this.props.className}-wrapper`}
      style={{ background: dataArray[this.state.showInt].background }}
      >
      <div className={this.props.className}>
        <BannerAnim
          prefixCls={`${this.props.className}-img-wrapper`}
          sync
          type="across"
          duration={1000}
          ease="easeInOutExpo"
          arrow={false}
          thumb={false}
          ref={(c) => { this.bannerImg = c; }}
          onChange={this.onChangeAnimation}
          dragPlay={false}
        >
          {imgChildren}

        </BannerAnim>
        <BannerAnim
          prefixCls={`${this.props.className}-text-wrapper`}
          sync
          type="across"
          duration={1000}
          arrow={false}
          thumb={false}
          ease="easeInOutExpo"
          ref={(c) => { this.bannerText = c; }}
          dragPlay={false}
        >
          {textChildren}

        </BannerAnim>




      </div>
    </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    friends: state.auth.friends
  }
}


export default connect(mapStateToProps) (DetailSwitch);
