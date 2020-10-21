import BannerAnim from 'rc-banner-anim';
import QueueAnim from 'rc-queue-anim';
import { TweenOneGroup } from 'rc-tween-one';
import Icon from 'antd/lib/icon';
import PropTypes from 'prop-types';
import React from "react";
import './DetailSwitch.css';
import { Select, Radio, Button, Input, List, Avatar } from 'antd';
import dayPic from './dayPic.svg';
import weekPic from './weekPic.svg';
import * as dateFns from 'date-fns';
const Element = BannerAnim.Element;

const textData2 = {
  content: 'WEEK VEIW',
  title: 'Week View',
};
const textData = {
  content: 'Send a request to your friend to compare availibilities',
  title: 'Day View',
};
let count=0;
let picArray=[dayPic, weekPic]
let dataArray = [
  {
    pic: 'https://zos.alipayobjects.com/rmsportal/ogXcvssYXpECqKG.png',
    map: 'dayPic',
    color: '#FFF43D',
    background: '#F6B429',
  },
  {
    pic: 'https://zos.alipayobjects.com/rmsportal/iCVhrDRFOAJnJgy.png',
    map: 'https://zos.alipayobjects.com/rmsportal/XRfQxYENhzbfZXt.png',
    color: '#FF4058',
    background: '#FC1E4F',
  },
  {
    pic: 'https://zos.alipayobjects.com/rmsportal/zMswSbPBiQKvARY.png',
    map: 'https://zos.alipayobjects.com/rmsportal/syuaaBOvttVcNks.png',
    color: '#9FDA7F',
    background: '#64D487',
  },
];
let dataArray2= [
  {
    pic: 'https://zos.alipayobjects.com/rmsportal/ogXcvssYXpECqKG.png',
    map: 'weekPic',
    color: '#FFF43D',
    background: '#F6B429',
  },

];
dataArray = dataArray.map(item => ({ ...item, ...textData }));
dataArray2 = dataArray2.map(item => ({ ...item, ...textData2 }));

class DetailSwitch extends React.Component {


  static defaultProps = {
    className: 'details-switch-demo',
  };

  constructor(props) {
    super(props);
    this.state = {
      rangeChoice: '',
      endDate: '',
      startDate: new Date(),
      showInt: 0,
      delay: 0,
      imgAnim: [
        { translateX: [0, 300], opacity: [1, 0] },
        { translateX: [0, -300], opacity: [1, 0] },
      ],
    };
    this.oneEnter = false;
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

  onChange = () => {
    if (!this.oneEnter) {
      this.setState({ delay: 300 });
      this.oneEnter = true;
    }
  }

  onLeft = () => {
    let showInt = this.state.showInt;
    showInt -= 1;
    const imgAnim = [
      { translateX: [0, -300], opacity: [1, 0] },
      { translateX: [0, 300], opacity: [1, 0] },
    ];
    if (showInt <= 0) {
      showInt = 0;
    }
    this.setState({ showInt, imgAnim });
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
    this.setState({ showInt, imgAnim });
    this.bannerImg.next();
    this.bannerText.next();
  };

  getDuration = (e) => {
    if (e.key === 'map') {
      return 800;
    }
    return 1000;
  };


  render() {
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
        <QueueAnim
          animConfig={this.state.imgAnim}
          duration={this.getDuration}
          delay={[!i ? this.state.delay : 300, 0]}
          ease={['easeOutCubic', 'easeInQuad']}
          key="img-wrapper"
        >
          <div className={`${this.props.className}-map map${i}`} key="map">
            <img src={picArray[0]} width="100%" />
          </div>

          <div style={{marginTop:'200px' }} className={`${this.props.className}-map map${i}`} key="map">
            <img src={picArray[1]} width="100%" />
          </div>

        </QueueAnim>
      </Element>));

    const textChildren = dataArray.map((item, i) => {
      console.log(dataArray);
      const { title, content, background } = item;
      return (<Element key={i}>
        <QueueAnim type="bottom" duration={1000} delay={[!i ? this.state.delay + 500 : 800, 0]}>
          <h1 key="h1">{'Day View'}</h1>
          <em key="em" style={{ background }} />
          <p key="p">{'Check day availibilities'}</p>
        </QueueAnim>
        <QueueAnim type="bottom" duration={1500} delay={[!i ? this.state.delay + 500 : 800, 0]}>
          <h1 style={{ marginTop:'200px'}} key="h1">{'Week View'}</h1>
          <em key="em" style={{ background }} />
          <p key="p">{'Check week availibilities'}</p>
        </QueueAnim>
      </Element>
    );
    });

    const textChildren2 = dataArray2.map((item, i) => {
      console.log(dataArray2);
      const { title, content, background } = item;
      return (<Element key={i}>
        <QueueAnim type="bottom" duration={1000} delay={[!i ? this.state.delay + 500 : 800, 0]}>
          <h1 key="h1">{title}</h1>
          <em key="em" style={{ background }} />
          <p key="p">{content}</p>
        </QueueAnim>
      </Element>
    );
    });


    return (<div
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
          onChange={this.onChange}
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
          style={{marginTop:'200px'}}
        >

          {textChildren2}
        </BannerAnim>
        <TweenOneGroup enter={{ opacity: 0, type: 'from' }} leave={{ opacity: 0 }}>
          {this.state.showInt && <Icon type="left" key="left" onClick={this.onLeft} />}
          {this.state.showInt < dataArray.length - 1 && <Icon type="right" key="right" onClick={this.onRight} />}
        </TweenOneGroup>
      </div>
    </div>);
  }
}

export default DetailSwitch;
