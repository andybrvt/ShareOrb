import json
from channels.generic.websocket import JsonWebsocketConsumer
from django.core import serializers
from django.forms import model_to_dict
from asgiref.sync import async_to_sync
from .serializers import NotificationSerializer
from .serializers import PostSerializer
from .serializers import NewPostSerializer
from .serializers import CommentSerializer
from .models import CustomNotification
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from channels.layers import get_channel_layer
from userprofile.models import User
from .models import Post
from .models import Comment




class NotificationConsumer(JsonWebsocketConsumer):
    ### THIS CONSUMER ALSO INCLUDES CHANNELS FOR EVENTS SYNC AND
    ### FRIEND REQUESTING NOTIFICATIONS and just for Notification in
    ### general



    # After going to def recieve, and if the command is 'fetch_friend_notifications'
    # it will then go to NotificationWebsocket.js which will check the command
    def fetch_notifications(self, data):

        user = self.scope['user']
        # print('first')
        # print(user)
        # This is where all the notifications get pulled
        notifications = CustomNotification.objects.select_related('actor').filter(recipient=data['userId']).order_by('-timestamp')
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
        serializer = NotificationSerializer(notifications, many=True)
        content = {
            'command': 'notifications',
            'notifications': json.dumps(serializer.data),
            'recipient': data['currentUser']
            # self.notifications_to_json(serializer.data)
            # json.dumps(serializer.data)
        }
        self.send_new_notification(content)

# Type is important, it will run the function in consumers under that type name
# The differences is in the type of notification that is created, the type will then be
# run through if statements in the notifications.js and will print out stuff accordingly
# This function will be used to make the actual notification object
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
        if data['command'] == 'send_decline_notification':
            recipient = get_object_or_404(User, username= data['recipient'])
            actor = get_object_or_404(User, id = data['actor'])
            notification = CustomNotification.objects.create(type="declined_friend", recipient = recipient, actor= actor, verb="declined  your friend request")
        if data['command'] == 'like_notification':
            recipient = get_object_or_404(User, id = data['recipient'])
            actor = get_object_or_404(User, id = data['actor'])
            notification = CustomNotification.objects.create(type ='like_notification', recipient = recipient, actor = actor, verb = 'liked your post')
        if data['command'] == 'comment_notification':
            recipient = get_object_or_404(User, id = data['recipient'])
            actor = get_object_or_404(User, id = data['actor'])
            notification = CustomNotification.objects.create(type = 'comment_notification', recipient = recipient, actor = actor, verb = 'commented on your post')
        # CustomNotification.save(self)
        # The notification will be serilizered and then sent to the group send
        serializer = NotificationSerializer(notification)
        content = {
            "command": "new_notification",
            "notification": json.dumps(serializer.data),
            "recipient": recipient.username #important for group send (group name)
        }
        print('send_notification')
        return self.send_new_notification(content)

    def send_event_sync_notification(self, data):
        # This is to send custom notification for event sync
        if data['command'] == 'send_friend_event_sync':
            recipient = get_object_or_404(User, username = data['recipient'])
            actor = get_object_or_404(User, username = data['actor'])
            minDate = data['startDate']
            maxDate = data['endDate']
            notification = CustomNotification.objects.create(type="send_friend_event_sync", recipient = recipient, actor= actor, verb="wants to event sync with you",
            minDate = minDate, maxDate = maxDate)
        if data['command'] == 'send_decline_event_sync_notification':
            # since you decline it the notification will pretty much have a normal decline
            recipient = get_object_or_404(User, username= data['recipient'])
            actor = get_object_or_404(User, id = data['actor'])
            notification = CustomNotification.objects.create(type="declined_event_sync", recipient = recipient, actor= actor, verb="declined your event sync request")
        if data['command'] == 'send_accepted_event_sync_notification':
            # since you are sending an accept notificaiton, you want to have the exact minDate and maxDate for the filter
            recipient = get_object_or_404(User, username= data['recipient'])
            actor = get_object_or_404(User, id = data['actor'])
            minDate = data['minDate']
            maxDate = data['maxDate']
            notification = CustomNotification.objects.create(type="accepted_event_sync", recipient = recipient, actor= actor, verb="accepted your event sync request",
            minDate = minDate, maxDate = maxDate)
        if data['command'] == 'send_new_event_sync_notification':
            recipient = get_object_or_404(User, username = data['recipient'])
            actor = get_object_or_404(User, username = data['actor'])
            minDate = data['minDate']
            maxDate = data['minDate']
            notification = CustomNotification.objects.create(type='new_event', recipient = recipient, actor = actor, verb = 'picked a time',
            minDate = minDate, maxDate = maxDate)
        serializer = NotificationSerializer(notification)
        content = {
            "command": "new_notification",
            "notification": json.dumps(serializer.data),
            "recipient": recipient.username, #important for group send (group name)
        }
        return self.send_new_notification(content)

#So this one is to delete the friend request notificaton, so since recipeint for this person
# is the person receive the friend request but once recipient accpets it then they are the actor
# but in the models for that notification the reicipeint should be the actor in this case
    def accept_notification (self, data):
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

# This fucntion is to accept the send_decline_notification command by the frontend from
#notifications to notificationswebsocket to here
    def decline_notification (self, data):
        recipient = get_object_or_404(User, id = data['actor'])
        actor = get_object_or_404(User, username = data['recipient'])
        notification = CustomNotification.objects.filter(recipient = recipient, actor = actor, type = 'friend')
        notification.delete()
        content = {
            'command': 'send_decline_notification',
            'actor': data['actor'],
            'recipient': data['recipient']
        }
        self.send_notification(content)

# This function is to send the other user a request for  event Sync
# This function is usually used to delete or do anything that doesnt have to do with
# sending the notificaiton itself
    def send_friend_event_sync (self, data):
        content = {
            'command': 'send_friend_event_sync',
            'actor': data['actor'],
            'recipient': data['recipient'],
            'range': data['range'],
            'startDate': data['startDate'],
            'endDate': data['endDate']
        }

        self.send_event_sync_notification(content)


    def decline_event_sync (self, data):
        # This is to delete the existing request
        # You want to have the minDate and maxDAte on this too so that you delete the exact notification
        recipient = get_object_or_404(User, id = data['actor'])
        actor = get_object_or_404(User, username = data['recipient'])
        minDate = data['minDate']
        maxDate = data['maxDate']
        notification = CustomNotification.objects.filter(recipient = recipient, actor = actor, type = 'send_friend_event_sync', minDate = minDate, maxDate = maxDate)
        # You are deleting the current notification that you click accept or declien to
        # and once you are done with that you then send the new notificaiton to the other person
        notification.delete()
        content = {
            'command': 'send_decline_event_sync_notification',
            'actor': data['actor'],
            'recipient': data['recipient']
        }
        self.send_event_sync_notification(content)

    def accept_event_sync (self, data):
        # This is to delete the exisitng request
        recipient = get_object_or_404(User, id = data['actor'])
        actor = get_object_or_404(User, username = data['recipient'])
        minDate = data['minDate']
        maxDate = data['maxDate']
        notification = CustomNotification.objects.filter(recipient = recipient, actor = actor, type = 'send_friend_event_sync', minDate = minDate, maxDate = maxDate)
        notification.delete()
        # You want to include the minDate and maxDate on this one is to have in your Event sync notificaiton
        # so that you can then use it to filter it out
        content = {
            'command': 'send_accepted_event_sync_notification',
            'actor': data['actor'],
            'recipient': data['recipient'],
            'minDate': data['minDate'],
            'maxDate': data['maxDate']
        }
        self.send_event_sync_notification(content)

    def send_new_event_sync_notification (self, data):
        content = {
            'command': 'send_new_event_sync_notification',
            'actor': data['actor'],
            'recipient': data['recipient'],
            'minDate': data['date'],
        }
        # basically change the name of the function and try to pass it to the front end
        self.send_event_sync_notification(content)

    def send_new_notification(self, notification):
        # Send message to room group
        # You want to send it to the right group channel layer so because of that
        # you will have to pull the right username of the logged in person
        channel_layer = get_channel_layer()
        channel_recipient = notification['recipient']
        channel = "notifications_"+channel_recipient
        # _{}".format(recipient.username)
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
        self.send_json(notification)

    # recieve information from NotificaitonWebsocket.js from fetchFriendRequests()
    def receive(self, text_data=None, bytes_data=None, **kwargs):
        data = json.loads(text_data)
        if data['command'] == 'fetch_friend_notifications':
            self.fetch_notifications(data)
        if data['command'] == 'send_friend_notification':
            self.send_notification(data)
        if data['command'] == 'accept_friend_request_notification':
            self.accept_notification(data)
        if data['command'] == 'decline_friend_request_notification':
            self.decline_notification(data)
        if data['command'] == 'send_friend_event_sync':
            self.send_friend_event_sync(data)
        if data['command'] == 'decline_event_sync':
            self.decline_event_sync(data)
        if data['command'] == 'accept_event_sync':
            self.accept_event_sync(data)
        if data['command'] == 'send_new_event_sync_notification':
            self.send_new_event_sync_notification(data)
        if data['command'] == 'like_notification':
            self.send_notification(data)
        if data['command'] == 'comment_notification':
            self.send_notification(data)
    def new_notification(self, event):
        notification = event['notification']
        # THE PROBLEM IS HERE
        # Send message to WebSocket
        return self.send_json(notification)


class LikeCommentConsumer(JsonWebsocketConsumer):
    ### This class will cover all the channels that has to do with commenting
    ### and liking a post, and each instance (channel) will pretty much be a post
    ### in in of it self
    def fetch_posts(self, data):

        post_list = Post.objects.all().order_by('-created_at', '-updated_at')
        # num_likes = Post.objects.filter(id = data['postId'])
        serializer = PostSerializer(post_list, many= True)
        # likes = num_likes[0]['like_count']
        # serializer =
        contentLike = {
            'command': 'fetch_posts',
            'likes_num': json.dumps(serializer.data),
        }
        self.send_json(contentLike)
        # self.send_json(content)

    def send_one_like(self, data):
        new_person_like = get_object_or_404(User, id = data['userId'])
        print(new_person_like)
        postObj = Post.objects.get(id = data['postId'])
        postObj.people_like.add(new_person_like)
        postObj.save()
        # postObj.people_like.add(new_person_like)
        # postObj.save()
        content = {
            'command': 'new_like',
            'postId': data['postId'],
            'user': data['userId']
        }

        self.send_new_action(content)

    def unsend_one_like(self, data):
        # This function will be used remove one like from the post
        person_like = get_object_or_404(User,id = data['userId'])
        postObj = Post.objects.get(id = data['postId'])
        postObj.people_like.remove(person_like)
        postObj.save()

        content = {
            'command': 'un_like',
            'postId': data['postId'],
            'user': data['userId']

        }
        self.send_new_action(content)

    def send_comment(self, data):
        print('send_comment hit')
        postObj = get_object_or_404(Post, id = data['postId'])
        person = User.objects.get(id = data['userId']).username
        comment = Comment.objects.create(post = postObj,
        name = person, body = data['comment']  )
        # Post.save()
        serializer = CommentSerializer(comment)
        content = {
            'command': 'new_comment',
            'comment': json.dumps(serializer.data)
        }
        return self.send_new_action(content)



    def send_new_action(self, postAction):
        # Send a message or whatever to the who channel group
        # Since pretty much everyone is on the same channel layer
        # you will send it and the sort it afterwards
        channel_layer = get_channel_layer()
        channel = 'newsfeed'
        async_to_sync(self.channel_layer.group_send)(
            channel,
            {
                'type': 'send_post_action',
                'action': postAction
            }
        )



    def connect(self):
        # self.current_post = self.scope['url_route']['kwargs']['postId']
        # The group name will pretty much be the name for each post
        # grp = 'post_'+self.current_post
        grp = 'newsfeed'
        async_to_sync (self.channel_layer.group_add)(grp, self.channel_name)
        self.accept()

    def disconnect(self, close_code):
        # self.current_post = self.scope['url_route']['kwargs']['postId']
        # grp = 'post_'+self.current_post
        grp = 'newsfeed'
        async_to_sync(self.channel_layer.group_discard)(grp, self.channel_name)

    def receive(self, text_data=None, bytes_data =None, **kwargs):
        data = json.loads(text_data)
        if data['command'] == 'fetch_posts':
            self.fetch_posts(data)
        if data['command'] == 'send_one_like':
            self.send_one_like(data)
        if data['command'] == 'unsend_one_like':
            self.unsend_one_like(data)
        if data['command'] == 'send_comment':
            self.send_comment(data)

    def send_post_action(self, postActions):
        postAction = postActions['action']
        # This will just send the information into the front end, you would
        # still need to send it through the group too
        return self.send_json(postAction)

class ExploreConsumer(JsonWebsocketConsumer):
    ### This class will cover most of the things in the explore tab in the
    ### front end. This also includes the add friend function as well. This
    ### will include the event exploring function (maybe --> depends )and also
    ### the add to event function (this is also a maybe because I am not sure yet)

    ### Probally gonna be the websocket for profiles too as well

    def connect(self):
        # This will pretty much connect to the profils of each of the users
        # so when you login, it pretty much connects right away
        self.current_user = self.scope['url_route']['kwargs']['username']
        grp = 'explore_'+self.current_user
        async_to_sync(self.channel_layer.group_add)(grp, self.channel_name)
        self.accept()

    def disconnect(self, close_code):
        user = self.scope['user']
        self.current_user = self.scope['url_route']['kwarg']['username']
        grp = 'explore_'+self.current_user
        async_to_sync(self.channel_layer.group_discard)(grp, self.channel_name)

    def recieve(self, text_data = None, bytes_data = None, **kwargs):
        data = json.loads(text_data)
