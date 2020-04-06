import json
from channels.generic.websocket import JsonWebsocketConsumer
from django.core import serializers
from django.forms import model_to_dict
from asgiref.sync import async_to_sync
from .serializers import NotificationSerializer
from .models import CustomNotification

class FriendRequestConsumer(JsonWebsocketConsumer):
    # After going to def recieve, and if the command is 'fetch_friend_notifications'
    # it will then go to NotificationWebsocket.js which will check the command
    def fetch_messages(self, data):
        # user = self.scope['user']
        print(data)
        notifications = CustomNotification.objects.select_related('actor').filter(recipient=2,type="friend")
        serializer = NotificationSerializer(notifications, many=True)
        print(serializer.data)
        content = {
            'command': 'notifications',
            'notifications': json.dumps(serializer.data)
            # self.notifications_to_json(serializer.data)
            # json.dumps(serializer.data)
        }
        print(content)
        self.send_json(content)

    # this will then take all the notifications that comes in, turns it to json
    # then put it into a list and the return it
    def notifications_to_json(self, notifications):
        result = []
        for notification in notifications:
            result.append(self.notification_to_json(notification))
        return result

    # this def is just used to structure the notifications and put it into json
    # form
    # @staticmethod
    def notification_to_json(notification):
        return {
            'actor': serializers.serialize('json', [notification.actor]),
            'recipient': serializers.serialize('json', [notification.recipient]),
            'verb': notification.verb,
            'created_at': str(notification.timestamp)
        }

    # this is to connect to the websocket
    def connect(self):
        # this is to aunthenticate
        user = self.scope['user']
        grp = 'notifications_{}'.format(user.username)
        print(grp)
        self.accept()
        # so grp will be the group name and it will be set to teh self.channel_name
        async_to_sync(self.channel_layer.group_add(grp, self.channel_name))

    # just used to disconnect your websocekt
    def disconnect(self, close_code):
        user = self.scope['user']
        grp = 'notifications_{}'.format(user.username)
        async_to_sync (self.channel_layer.group_discard(grp, self.channel_name))

    def notify(self, event):
        self.send_json(event)

    # recieve information from NotificaitonWebsocket.js from fetchFriendRequests()
    def receive(self, text_data=None, bytes_data=None, **kwargs):
        data = json.loads(text_data)
        print(data)
        if data['command'] == 'fetch_friend_notifications':
            self.fetch_messages(data)
