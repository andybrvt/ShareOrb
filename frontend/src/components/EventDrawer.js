import { Drawer, List, Avatar, Divider, Col, Row } from 'antd';
import React, { Component } from 'react';
import CalendarForm from './CalendarForm';
import ReduxAddEventForm from './ReduxAddEventForm';

const pStyle = {
  fontSize: 16,
  lineHeight: '24px',
  display: 'block',
  marginBottom: 16,
};

const DescriptionItem = ({ title, content }) => (
  <div
    className="site-description-item-profile-wrapper"
    style={{
      fontSize: 14,
      lineHeight: '22px',
      marginBottom: 7,
    }}
  >
    <p
      className="site-description-item-profile-p"
      style={{
        marginRight: 8,
        display: 'inline-block',
      }}
    >
      {title}:
    </p>
    {content}
  </div>
);

class EventDrawer extends React.Component {
  // closable={this.props.closable}
  render() {
    console.log(this.props)
    return (
      <div>
        <Drawer
          width={640}
          placement="right"
          onClose={this.props.onClose}
          visible={this.props.visible}
        >
        <ReduxAddEventForm {...this.props}/>
        </Drawer>
      </div>
    );
  }
}

export default EventDrawer;
