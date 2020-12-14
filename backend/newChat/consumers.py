# This is for the consumer of the chat
import json
from channels.generic.websocket import JsonWebsocketConsumer
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from . import views
from .serializers import MessageSerializer
from .serializers import ChatSerializer
from .serializers import MiniChatSerializer
from .models import Chat
from .models import Message
from django.shortcuts import get_object_or_404
from userprofile.models import User
from django.utils import timezone
import pytz
from datetime import datetime



class NewChatSidePanelConsumer(JsonWebsocketConsumer):
    # This consumer will be incharge of the sidemenu and all the stuff
    # that goes on with it, like recieving new updates when people text you
    # updating the message that is shown when you type a text or some else
    # types a text in the chat

    # Use in conjunction with notifications for chats to work well.
    def send_fetch_all_user_chats(self, data):
        # This will fetch all the users chats
        if data['userId'] is not None:

            user = get_object_or_404(User, id = data['userId'])
            chats = user.chat_parti.all()
            # When you do many = True it will serialize the list of chat objects
            chatList = MiniChatSerializer(chats, many = True).data
            print(chatList)
            content = {
                'command': 'fetch_all_user_chats',
                'chats': chatList
            }
            self.send_json(content)

    def send_update_recent_chat(self, data):
        # This function will update the current with the current message sent,
        # person sent it and what time
        print("update chats")
        curChat = get_object_or_404(Chat, id = data['chatId'])
        sender = get_object_or_404(User, id = data['senderId'])

        timezone.activate(pytz.timezone("MST"))
        time = timezone.localtime(timezone.now()).strftime("%Y-%m-%d %H:%M:%S")


        curChat.recentMessage = data['message']
        curChat.recentSender = sender
        curChat.recentTime = time
        curChat.save()

        serializedChat = MiniChatSerializer(curChat).data
        print('right here')
        print(curChat.participants)
        for participant in serializedChat['participants']:
            # you will loop through the users and then send it to each of them
            # a new chat that is updated
            user = get_object_or_404(User, id = int(participant['id']))
            chats = user.chat_parti.all()
            # When you do many = True it will serialize the list of chat objects
            chatList = MiniChatSerializer(chats, many = True).data
            content = {
                "command": "update_chat_list",
                "chatList": chatList,
                "chatUserId": user.id
            }
            self.send_chats(content)

    def send_chats(self, chatListObj):
        # This function will leading to sending the chat list to the right person
        # in the front end
        # Pretty much getting the channel layer
        channel_layer = get_channel_layer()
        channel_recipient = chatListObj['chatUserId']
        channel = 'chats_list_'+str(channel_recipient)

        async_to_sync(self.channel_layer.group_send)(
            channel,
            {
                'type': 'new_chat_lists',
                'chatList': chatListObj
            }
        )

    def connect(self):
        # This will be used to connect into the chats,you chats so taht your
        # sidepanel can be working
        print("connect")

        self.chats_id = self.scope['url_route']['kwargs']['chatsOwnerId']
        grp = 'chats_list_'+self.chats_id
        async_to_sync(self.channel_layer.group_add)(grp, self.channel_name)
        self.accept()


    def disconnect(self, close_code):
        # This will be the disconnect when you wnat to disocnnect from your
        # chat, used mainly when exiting chats. I don't think i want to keep chat
        # open during the login... maybe
        print("disconnect")
        # Each channel layer will be specific to a user. It will be a channel layer
        # of the chats

        self.chats_id = self.scope['url_route']['kwargs']['chatsOwnerId']
        grp = 'chats_list_'+self.chats_id
        async_to_sync(self.channel_layer.group_discard)(grp, self.channel_name)


    def receive(self, text_data= None, bytes_data = None, **kwargs):
        # This is for when you are receivng information from other poeple and you
        # want to update your shit
        print(text_data)
        data = json.loads(text_data)
        print(data)
        if data['command'] == 'fetch_all_user_chats':
            self.send_fetch_all_user_chats(data)
        if data['command'] == 'update_recent_chat':
            self.send_update_recent_chat(data)

    def new_chat_lists(self, chatObj):
        # This will be sneding it to the front end
        chatListObj = chatObj['chatList']
        return self.send_json(chatListObj)

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

    def send_new_chat_created_message(self, data):
        # This will take care of making a new message for a chat that is already
        # created

        chatObj = get_object_or_404(Chat, id = data['chatId'])
        senderObj = get_object_or_404(User, id = data['senderId'])

        newMessage = Message.objects.create(
            chat = chatObj,
            body = data['message'],
            messageUser = senderObj
        )
        newMessage.save()

        serializedMessage = MessageSerializer(newMessage)

        content = {
            "command": "send_new_chat_created_message",
            "newMessage": serializedMessage.data,
            "chatId": data['chatId']
        }

        self.send_messsage(content)
        print(data)

    def send_messsage(self, newMessageObj):
        # This function will be sending information to the channel layer
        # it will send it to the appropriate chat giving the chatId
        channel_layer = get_channel_layer()
        channel_recipient = newMessageObj['chatId']
        channel = 'newChat_'+str(channel_recipient)

        async_to_sync(self.channel_layer.group_send)(
            channel,
            {
                'type': 'new_chat_message',
                'messageObj': newMessageObj
            }
        )

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
        if data['command'] == 'send_new_chat_created_message':
            self.send_new_chat_created_message(data)

    def new_chat_message(self, message):
        # This will be sending the chat message into the front end
        messageObj = message['messageObj']
        return self.send_json(messageObj)
