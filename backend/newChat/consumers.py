# This is for the consumer of the chat
import json
from channels.generic.websocket import JsonWebsocketConsumer
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from . import views
from .serializers import MessageSerializer
from .serializers import ChatSerializer
from .models import Chat
from django.shortcuts import get_object_or_404


class NewChatConsumer(JsonWebsocketConsumer):
    # This consumer well be used to manage the backend for sending text
    # messages within the group chats

    def send_fetch_new_chat_messages(self, data):
        # This will fetch the messages of the current chat that is open
        # print('fetch')
        # messages = views.get_last_10_messages(data['chatId'])
        #
        # content = {
        #     'command': 'fetch_messages',
        #     'messages': self.serializedMessages(messages)
        # }
        # self.send_json(content)

        chat = get_object_or_404(Chat, id = data['chatId'])
        serializedChat = ChatSerializer(chat).data
        messages = serializedChat['get_messages'][:10]
        content = {
            'command': 'fetch_messages',
            'messages': messages
        }
        self.send_json(content)

    def serializedMessages(self, messages):
        result = []
        for message in messages:
            result.append(MessageSerializer(message).data)

        return result

    def connect(self):
        # This will connect to the correct chat weboscket
        print("connect")
        # get the channel name
        self.chat_id = self.scope['url_route']['kwargs']['newChatId']
        grp = 'newChat_'+self.chat_id
        # now create the group and then connect to the group name
        async_to_sync(self.channel_layer.group_add)(grp, self.channel_name)
        self.accept()


    def disconnect(self, close_code):
        #This will be the disconnect in order to disconnect the channel
        # and connect to a  new one
        print("disconnect")
        # pretty much the same as connect but now you are just disconnecting
        self.chat_id = self.scope['url_route']['kwargs']['newChatId']
        grp = 'newChat_'+self.chat_id
        async_to_sync(self.channel_layer.group_discard)(grp, self.channel_name)

    def receive(self, text_data= None, bytes_data = None, **kwargs):
        # This is for receiving information from the front end

        data = json.loads(text_data)
        print(data)
        if data['command'] == 'fetch_new_chat_messages':
            self.send_fetch_new_chat_messages(data)
