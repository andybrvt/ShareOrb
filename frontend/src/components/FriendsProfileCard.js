import React from "react";
import { Card } from 'antd';
import {Button} from 'antd';
import { authAxios } from '../components/util';

const { Meta } = Card;

// DELETE THIS SOON


class FriendProfileCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: true};
  }

  onClickSend = (e) => {
    // const username = this.props.data.username;
    // console.log(this.props)
  // this.setState({value: e.target.value});
    }
  // this is a card that displays the profile picture and user name
  render() {
    console.log(this.props)
    return (

    <Card
    hoverable
    style={{ width: 240 }}
    cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
    >
      <a href={'/userview/'+this.props.data}>{this.props.data}</a>
      <Button type="primary" onClick ={this.onClickSend} disabled={!this.state.value}>E Sync </Button>
    </Card>


    );

  }
}

export default FriendProfileCard;
