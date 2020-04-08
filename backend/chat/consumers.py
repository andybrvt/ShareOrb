import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from .models import Message
from userprofile.models import User
from . import views

# so you want to first pull all your data first and then put them in a dictionary
#then you would return the cotent in a json formation and that function for the json
#format can be made in another funciton

#for certain actions you will need an event to  occur and its usually in a scope (which has like type
#and stuff and that type calls the funciton you want to get and the data is all the other shit in that
#scope)

class ChatConsumer(WebsocketConsumer):

    def fetch_messages(self, data):
        messages = views.get_last_10_messages(data['chatID'])
        content = {
            'command': 'messages',
            'messages': self.messages_to_json(messages)

        }
        self.send_message(content)
 # to get the message you first have go get the message then save it to the right chat
 # you can either pass it through the parameters or pass it through the data (get the chat id)
    def new_message(self, data):
        user_contact = views.get_user_contact(data['from'])
        message = Message.objects.create(
            contact = user_contact,
            content = data['message'] )
        current_chat = views.get_current_chat(data['chatId'])
        current_chat.messages.add(message)
        current_chat.save()
        content = {
            'command': 'new_message',
            'message': self.message_to_json(message)
        }

        return self.send_chat_message(content)


    def messages_to_json(self, messages):
        result = []
        for message in messages:
            result.append(self.message_to_json(message))
        return result

    def message_to_json (self, message):
        return {
            'id': message.id,
            'author': message.contact.user.username,
            'content': message.content,
            'timestamp':str(message.timestamp)
        }

    # throw your commands into a dictionary and then you can call them whenever
    commands  = {
        'fetch_messages': fetch_messages,
        'new_message': new_message,
    }

    def connect(self):
        print(self.scope['user'])
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name

        # Join room group
        async_to_sync (self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        # Leave room group
        async_to_sync (self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    def receive(self, text_data):
        data = json.loads(text_data)
        self.commands[data['command']](self,data)


    def send_chat_message(self, message):
        # Send message to room group
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message
            }
        )

    def send_message(self, message):
        self.send(text_data = json.dumps(message))


    # Receive message from room group
    def chat_message(self, event):
        message = event['message']

        # Send message to WebSocket
        self.send(text_data=json.dumps(message))
