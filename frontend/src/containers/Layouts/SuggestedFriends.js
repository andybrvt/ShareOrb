import { List, Avatar, Button, Skeleton } from 'antd';
import './SuggestedFriends.css';
import Icon from '@ant-design/icons';
import {
DownloadOutlined,
SearchOutlined
} from '@ant-design/icons';
// import reqwest from 'reqwest';
import React from 'react';
import { authAxios } from '../../components/util';
import NotificationWebSocketInstance from '../../notificationWebsocket';



class SuggestedFriends extends React.Component {
  state = {
    initLoading: true,
    loading: false,
    data: [],
    list: [],
    start: 5,
    counter:5,

  };



  componentDidMount() {
    console.log("made it")
    this.getData(res => {

      this.setState({
        initLoading: false,
        list: res.data,
      });
    });
  }

  getData = callback => {
    authAxios.get(`${global.API_ENDPOINT}/userprofile/everyoneSuggested`)
        .then(res=> {

          this.setState({
            list:res.data,
         });
       });
       console.log(this.state.list)

  };



  profileDirect = (user) => {
    this.props.history.push('/explore/'+user)
  }

  onLoadMore = () => {
    console.log(this.state.counter)
    console.log(this.state.data)
    console.log(this.state.list)

    const start = this.state.start
    const end = this.state.counter

    this.setState({
      loading: true
    })
    authAxios.get(`${global.API_ENDPOINT}/userprofile/loadSuggested`,{
      params:{
        start,
        end
      }
    })
    .then(res => {
      console.log(res)
      this.setState({
        list:this.state.list.concat(res.data),
        start: this.state.start+this.state.counter,
        loading: false
      })
    })

    // this.setState({
    //   loading: true,
    //   // list: this.state.data.concat([...new Array(2)].map(() => ({ loading: true, get_followers:[]}))),
    //   counter:this.state.counter+1,
    // });


    // console.log(this.state.counter)
    //       const data = this.state.list.concat(this.state.data.slice(this.state.counter+1, this.state.counter+3));
    //       console.log(this.state.data)
    //       this.setState({
    //         list: data,
    //         loading: false,
    //         counter: this.state.counter+2
    //      },
    //        () => {
    //          // Resetting window's offsetTop so as to display react-virtualized demo underfloor.
    //          // In real scene, you can using public method of react-virtualized:
    //          // https://stackoverflow.com/questions/46700726/how-to-use-public-method-updateposition-of-react-virtualized
    //          window.dispatchEvent(new Event('resize'));
    //
    //          },
    //    )
    }

  onFollow = (privatePro, follower, following) => {
    // This function will be used to handle the follow or request
    // The parameter privatePro will be used to see if the account is private or not
    // to send the right request
    // The parameterfollower will you, and following will be the person you are
    // trying to follow.

    console.log(privatePro, follower, following)
    if(privatePro === true) {
      // if true then the perosn profile will be private and then when you click
      // follow it will show a reqeust instead of followed

      // Make an axios call here that creates taht sent request event and update
      // it in the front end and then send a notification to the other person

      authAxios.post(`${global.API_ENDPOINT}/userprofile/sendFollowRequest`, {
        follower: follower,
        following: following
      })
      .then(res => {
        console.log(res.data)

        // update your redux first and then send a notificaiton to the other person
        // and update their auth too as well
        this.props.updateSentRequestList(res.data)


        const notificationObject = {
          command: 'send_follow_request_notification',
          actor: follower,
          recipient: following
        }
        // ADD THE NOTIFICATIONI HERE TO UPDATE THE FOLLOWING AUTH
        NotificationWebSocketInstance.sendNotification(notificationObject)


      })
      // const notificationObject = {
      //   command: 'send_follow_request_notification',
      //   actor: follower,
      //   recipient: following
      // }
      //
      // // add auth here
      //
      // // Simlar to the personal profile but without sending it throught he weboscket
      // NotificationWebSocketInstance.sendNotification(notificationObject)


    } else {
      // This will be for when it is not a private event

      authAxios.post(`${global.API_ENDPOINT}/userprofile/onFollow`, {
        follower: follower,
        following: following
      })
      .then(res => {
        console.log(res.data)
        this.props.updateFollowing(res.data)
        // Send a notification to the other person here

        const notificationObject = {
          command: 'send_follow_notification',
          actor: follower,
          recipient: following
        }

        NotificationWebSocketInstance.sendNotification(notificationObject)

      })
    }
  }

  onUnfollow = (follower, following) => {
    // This will unfollow the person

    authAxios.post(`${global.API_ENDPOINT}/userprofile/onUnfollow`, {
      follower: follower,
      following: following
    })
    .then(res => {
      console.log(res.data)
      this.props.updateFollowing(res.data)

      // This will unsend the follow notification if the person decides to unfollow
      const notificationObject = {
        command: 'unsend_follow_notification',
        actor: follower,
        recipient: following
      }
      NotificationWebSocketInstance.sendNotification(notificationObject)

    })

  }

  onUnsendRequest = (follower, following) => {
    // axios then notification after wards
    authAxios.post (`${global.API_ENDPOINT}/userprofile/unsendFollowRequest`, {
      follower: follower,
      following: following
    })
    .then(res => {
      this.props.updateSentRequestList(res.data)

      const notificationObject = {
        command: 'unsend_follow_request_notification',
        actor: follower,
        recipient: following
      }

      NotificationWebSocketInstance.sendNotification(notificationObject)


    })
  }


  render() {
    console.log(this.state)
    console.log(this.props)
    let following = []
    let sentRequestList = []
    let requestList = []

    if(this.props.following){
      for(let i = 0; i< this.props.following.length; i++){
        following.push(
          this.props.following[i].id
        )
      }
    }
    if(this.props.requestList){
      for(let i = 0; i< this.props.requestList.length; i++){
        requestList.push(
          this.props.requestList[i].id
        )
      }
    }
    if(this.props.sentRequestList){
      for(let i = 0; i< this.props.sentRequestList.length; i++){
        sentRequestList.push(
          this.props.sentRequestList[i].id
        )
      }
    }

    const { initLoading, loading, list } = this.state;
    const loadMore =
       !initLoading && !loading ? (
         <div
           style={{
             textAlign: 'center',
             marginTop: 12,
             height: 32,
             lineHeight: '32px',
           }}
         >
        </div>
      ) : null;

    console.log(following, requestList)

    return (
      <div>
        <List
          className="demo-loadmore-list scrollableFeature"
          style={{marginTop:'-10px'}}
          itemLayout="horizontal"
          loadMore={loadMore}
          dataSource={list}
          locale={{emptyText:<span/>}}
          renderItem={item => (

            <List.Item>

              <Skeleton avatar title={false} loading={item.loading} active>

              <List.Item.Meta

                avatar={
                  <Avatar
                    style = {{
                      cursor: "pointer"
                    }}
                    onClick = {() => this.profileDirect(item.username)}
                     src={item.profile_picture} />
                }
                title={<span
                  style = {{cursor: "pointer"}}
                   onClick = {() => this.profileDirect(item.username)}> {item.first_name} {item.last_name}</span>}
                description={
                  <span class="followerFollowingStat"> {item.get_followers.length +" followers"}</span>
                  }
              />

            {
              following.includes(item.id) ?

              <Button
                onClick = {() => this.onUnfollow(this.props.id, item.id ) }
                style={{fontSize:'14px'}} size="small" shape="round" type="primary">
                Following
              </Button>

              :

              sentRequestList.includes(item.id) ?

              <Button
                onClick = {() => this.onUnsendRequest(this.props.id, item.id ) }
                style={{fontSize:'14px'}} size="small" shape="round" type="primary">
                Requested
              </Button>

              :

              <Button
                onClick = {() => this.onFollow(item.private, this.props.id, item.id ) }
                style={{fontSize:'14px'}} size="small" shape="round" type="primary">
                Follow
              </Button>

            }



              </Skeleton>
            </List.Item>
          )}
        />
      <div style={{padding:'30px'}}>
        {((list.length)<=30)?

          <Button style={{left:'35%', float:'bottom'}} onClick={() => this.onLoadMore()}>
            Load More</Button>

          :

            <div></div>
        }
        </div>

      </div>
    );
  }
}

export default SuggestedFriends;
