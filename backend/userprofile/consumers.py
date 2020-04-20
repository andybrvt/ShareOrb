import json
from channels.generic.websocket import JsonWebsocketConsumer
from django.core import serializers
from django.forms import model_to_dict
from asgiref.sync import async_to_sync
from .serializers import NotificationSerializer
from .models import CustomNotification
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from channels.layers import get_channel_layer
from userprofile.models import User




class FriendRequestConsumer(JsonWebsocketConsumer):
    # After going to def recieve, and if the command is 'fetch_friend_notifications'
    # it will then go to NotificationWebsocket.js which will check the command
    def fetch_notifications(self, data):
        user = self.scope['user']
        # print('first')
        # print(user)
        notifications = CustomNotification.objects.select_related('actor').filter(recipient=data['userId'])
        serializer = NotificationSerializer(notifications, many=True)
        content = {
            'command': 'notifications',
            'notifications': json.dumps(serializer.data)
            # self.notifications_to_json(serializer.data)
            # json.dumps(serializer.data)
        }
        self.send_json(content)

    def refetch_notifications(self,data):
        notifications = CustomNotification.objects.select_related('actor').filter(recipient=data['userId'])
        print(notifications)
        serializer = NotificationSerializer(notifications, many=True)
        content = {
            'command': 'notifications',
            'notifications': json.dumps(serializer.data),
            'recipient': data['currentUser']
            # self.notifications_to_json(serializer.data)
            # json.dumps(serializer.data)
        }
        self.send_new_notification(content)

# type is important, it will run the function in consumers under that type name
    def send_notification (self, data):
        user = self.scope['user']

        if data['command'] == 'send_friend_notification':
            recipient = get_object_or_404(User, username=data['recipient'])
            actor = get_object_or_404(User, username=data['actor'])
            notification = CustomNotification.objects.create(type="friend", recipient=recipient, actor=actor, verb="sent you friend request")
        if data['command'] == 'send_accepted_notification':
            recipient = get_object_or_404(User, username=data['recipient'])
            actor = get_object_or_404(User, id=data['actor'])
            notification = CustomNotification.objects.create(type="accepted_friend", recipient=recipient, actor=actor, verb="accepted your friend request")
        # CustomNotification.save(self)
        serializer = NotificationSerializer(notification)
        content = {
            "command": "new_notification",
            "notification": json.dumps(serializer.data),
            "recipient": recipient.username #different here
        }
        print('send_notification')
        return self.send_new_notification(content)

#So this one is to delete the friend request notificaton, so since recipeint for this person
# is the person receive the friend request but once recipient accpets it then they are the actor
# but in the models for that notification the reicipeint should be the actor in this case
    def act_notification (self, data):
        recipient = get_object_or_404(User, id = data['actor'])
        actor = get_object_or_404(User, username = data['recipient'])
        notification = CustomNotification.objects.filter(recipient = recipient, actor = actor, type = 'friend')
        notification.delete()
        content = {
            'command': 'send_accepted_notification',
            'actor': data['actor'],
            'recipient':data['recipient']
        }
        fetch_content = {
            'userId': data['actor'],
            'currentUser': actor.username
        }
        # self.refetch_notifications(fetch_content)
        self.send_notification(content)

# coment here

    def send_new_notification(self, notification):
        # Send message to room group
        # You want to send it to the right group channel layer so because of that
        # you will have to pull the right username of the logged in person
        channel_layer = get_channel_layer()
        channel_recipient = notification['recipient']
        channel = "notifications_"+channel_recipient
        # _{}".format(recipient.username)
        print('send_new_notification')
        async_to_sync(self.channel_layer.group_send)(
            channel,
            {
                'type': 'new_notification',
                'notification': notification
            }
        )



    # this will then take all the notifications that comes in, turns it to json
    # then put it into a list and the return it
    @staticmethod
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

        # So once everyone logs in they have their own group that holds their
        # stuff, so you send something in that group, evyerone in the group will recieve
        #receive that message you sent
        self.current_user = self.scope['url_route']['kwargs']['username']
        grp = 'notifications_'+self.current_user
        print(grp)
        async_to_sync(self.channel_layer.group_add)(grp, self.channel_name)

        # {}'.format(user.username)
        self.accept()


        # so grp will be the group name and it will be set to teh self.channel_name

    # just used to disconnect your websocekt
    def disconnect(self, close_code):
        user = self.scope['user']
        self.current_user = self.scope['url_route']['kwargs']['username']
        grp = 'notifications_'+self.current_user
        # _{}'.format(user.username)
        async_to_sync (self.channel_layer.group_discard)(grp, self.channel_name)

    def notify(self, event):
        notification = event['notification']
        print('notify')
        self.send_json(notification)

    # recieve information from NotificaitonWebsocket.js from fetchFriendRequests()
    def receive(self, text_data=None, bytes_data=None, **kwargs):
        data = json.loads(text_data)
        if data['command'] == 'fetch_friend_notifications':
            self.fetch_notifications(data)
        if data['command'] == 'send_friend_notification':
            self.send_notification(data)
        if data['command'] == 'act_friend_request_notification':
            self.act_notification(data)
    def new_notification(self, event):
        notification = event['notification']
        print(notification)
        # THE PROBLEM IS HERE
        # Send message to WebSocket
        return self.send_json(notification)
