// This websocket is gonna be used for the event. This includes the inofmraiton
// for the socialevent, editing the soical events, with group chats and inviting
// sharing etc... more social features

class WebSocketSocialEventPage{
  static instance = null;
  callbacks = {};

  static getInstance() {
    if(!WebSocketSocialEventPage.instance){
      WebSocketSocialEventPage.instance = new WebSocketSocialEventPage();
    }

    return WebSocketSocialEventPage.instance
  }


}
