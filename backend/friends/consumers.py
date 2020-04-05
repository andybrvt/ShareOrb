import json
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from django.core import serializers
from django.forms import model_to_dict

from .serializers import NotificationSerializer
from .models import CustomNotification

class FriendRequestConsumer(AsyncJsonWebsocketConsumer):
    # After going to def recieve, and if the command is 'fetch_friend_notifications'
    # it will then go to NotificationWebsocket.js which will check the command
    async def fetch_messages(self):
        user = self.scope['user']
        notifications = CustomNotification.objects.select_related('actor').filter(recipient=user,
                                                                                  type="friend")
        serializer = NotificationSerializer(notifications, many=True)
        content = {
            'command': 'notifications',
            'notifications': json.dumps(serializer.data)
        }

        await self.send_json(content)

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
    async def connect(self):
        # this is to aunthenticate
        user = self.scope['user']
        grp = 'notifications_{}'.format(user.username)
        await self.accept()
        # so grp will be the group name and it will be set to teh self.channel_name
        await self.channel_layer.group_add(grp, self.channel_name)

    # just used to disconnect your websocekt
    async def disconnect(self, close_code):
        user = self.scope['user']
        grp = 'notifications_{}'.format(user.username)
        await self.channel_layer.group_discard(grp, self.channel_name)

    async def notify(self, event):
        await self.send_json(event)

    # recieve information from NotificaitonWebsocket.js from fetchFriendRequests()
    async def receive(self, text_data=None, bytes_data=None, **kwargs):
        data = json.loads(text_data)
        if data['command'] == 'fetch_friend_notifications':
            await self.fetch_messages()
