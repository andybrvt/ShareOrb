import json
from channels.generic.websocket import JsonWebsocketConsumer
from django.core import serializers
from django.forms import model_to_dict
from asgiref.sync import async_to_sync
from .serializers import NotificationSerializer
from .serializers import PostSerializer
from .serializers import NewPostSerializer
from .serializers import CommentSerializer
from .serializers import UserSerializer
from .serializers import FollowSerializer
from .serializers import FollowUserSerializer
from .serializers import UserSocialEventSerializer
from .models import CustomNotification
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from channels.layers import get_channel_layer
from userprofile.models import User
from .models import Post
from .models import Comment
from .models import UserFollowing
from .models import UserSocialNormPost
from mySocialCal.models import SocialCalCell
from mySocialCal.models import SocialCalComment
from mySocialCal.models import SocialCalEvent
from mySocialCal.models import SocialCalItems
from mySocialCal.serializers import SocialCalCellSerializer
from mySocialCal.serializers import SocialCalCommentSerializer
from mySocialCal.serializers import SocialCalEventSerializer
from .serializers import UserSocialCalSerializer
from django.utils import timezone



class NotificationConsumer(JsonWebsocketConsumer):
    ### THIS CONSUMER ALSO INCLUDES CHANNELS FOR EVENTS SYNC AND
    ### FRIEND REQUESTING NOTIFICATIONS and just for Notification in
    ### general



    # After going to def recieve, and if the command is 'fetch_friend_notifications'
    # it will then go to NotificationWebsocket.js which will check the command
    def fetch_notifications(self, data):

        user = self.scope['user']
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

        # Used for newsfeed notifcations + friends + follow
        user = self.scope['user']
        if data['command'] == 'send_friend_notification':
            recipient = get_object_or_404(User, username=data['recipient'])
            actor = get_object_or_404(User, username=data['actor'])
            notification = CustomNotification.objects.create(type="friend", recipient=recipient, actor=actor, verb="sent you friend request")
        if data['command'] == 'send_accepted_notification': ## For friends
            recipient = get_object_or_404(User, username=data['recipient'])
            actor = get_object_or_404(User, id=data['actor'])
            notification = CustomNotification.objects.create(type="accepted_friend", recipient=recipient, actor=actor, verb="accepted your friend request")
        if data['command'] == 'send_decline_notification': ## For friends
            recipient = get_object_or_404(User, username= data['recipient'])
            actor = get_object_or_404(User, id = data['actor'])
            notification = CustomNotification.objects.create(type="declined_friend", recipient = recipient, actor= actor, verb="declined  your friend request")
        if data['command'] == 'like_notification': ## Used for notifcation on newsfeed
            recipient = get_object_or_404(User, id = data['recipient'])
            actor = get_object_or_404(User, id = data['actor'])
            notification = CustomNotification.objects.create(type ='like_notification', recipient = recipient, actor = actor, verb = 'liked your post')
        if data['command'] == 'comment_notification': # for newsfeed
            recipient = get_object_or_404(User, id = data['recipient'])
            actor = get_object_or_404(User, id = data['actor'])
            notification = CustomNotification.objects.create(type = 'comment_notification', recipient = recipient, actor = actor, verb = 'commented on your post')
        if data['command'] == 'send_follow_notification': #this is just for following
            recipient = get_object_or_404(User, username = data['recipient'])
            actor = get_object_or_404(User, username = data['actor'])
            notification = CustomNotification.objects.create(type = 'follow_notification', recipient = recipient, actor = actor, verb = 'followed you')
        # CustomNotification.save(self)
        # The notification will be serilizered and then sent to the group send
        serializer = NotificationSerializer(notification)
        content = {
            "command": "new_notification",
            "notification": json.dumps(serializer.data),
            "recipient": recipient.username #important for group send (group name)
        }
        return self.send_new_notification(content)

    def send_event_sync_notification(self, data):
        # This is to send custom notification for event sync
        if data['command'] == 'send_friend_event_sync':
            recipient = get_object_or_404(User, username = data['recipient']['username'])
            actor = get_object_or_404(User, username = data['actor'])
            minDate = data['startDate']
            maxDate = data['endDate']
            notification = CustomNotification.objects.create(type="send_friend_event_sync",
             recipient = recipient,
             actor= actor,
             verb="wants to event sync with you",
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

    def send_personalCal_event_notification(self, data):
        #This method is to use for all the notificaiton for personal calendar
        # if data['command'] == "send_shared_event_notification":
        #     actor = get_object_or_404(User, id = data["actor"])
        #     # for recipients in data['recipient']:
        #     #     recipient = get_object_or_404(User, id = recipients['id'])
        #     #     notification = CustomNotification.objects.create(type = "shared_event",
        #     #     actor = actor,
        #     #     recipient = recipient,
        #     #     verb = "shared an event at "+data['eventDate'],
        #     #     minDate = data['eventDate'])
        #     #     serializer = NotificationSerializer(notification)
        #     #     content = {
        #     #         "command": "new_notification",
        #     #         "notification":json.dumps(serializer.data),
        #     #         "recipient": recipient.username,
        #     #     }
        #     #     self.send_new_notification(content)
        #     recipient = get_object_or_404(User, id = data['recipient'])
        #     notification = CustomNotification.objects.create(
        #     type = "shared_event",
        #     actor = actor,
        #     recipient = recipient,
        #     verb = "shared an event at "+data['eventDate'],
        #     minDate = data['eventDate'])
        #     serializer = NotificationSerializer(notification)
        #     content = {
        #         "command": "new_notification",
        #         "notification":json.dumps(serializer.data),
        #         "recipient": recipient.username,
        #     }
        #     self.send_new_notification(content)

        if data['command'] == 'send_accepted_shared_event':
            actor = get_object_or_404(User, id = data['actor'])
            recipient = get_object_or_404(User, id = data['recipient'])
            notification = CustomNotification.objects.create(type = "accepted_shared_event",
            actor = actor,
            recipient = recipient,
            verb = "accepted shared event",
            minDate = data['eventDate'],
            eventId = data['eventId']
            )
            serializer = NotificationSerializer(notification)
            content = {
                "command": "new_notification",
                "notification": json.dumps(serializer.data),
                "recipient": recipient.username
            }
            self.send_new_notification(content)
        if data['command'] == 'send_declined_shared_event':
            actor = get_object_or_404(User, id = data['actor'])
            recipient = get_object_or_404(User, id = data['recipient'])
            notification = CustomNotification.objects.create(type = "declined_shared_event",
            actor = actor,
            recipient = recipient,
            verb = "declined shared event",
            minDate = data['eventDate'],
            eventId = data['eventId'])
            serializer = NotificationSerializer(notification)
            content = {
                "command": "new_notification",
                "notification": json.dumps(serializer.data),
                "recipient": recipient.username
            }
            self.send_new_notification(content)
        if data['command'] == 'send_edited_event_notification':
            actor = get_object_or_404(User, id = data['actor'])
            for recipients in data['recipient']:
                recipient = get_object_or_404(User, username = recipients)
                notification = CustomNotification.objects.create(type = "edited_share_event",
                actor = actor,
                recipient = recipient,
                verb = "edited an event",
                minDate = data['eventDate'],
                eventId = data['eventId'])
                serializer = NotificationSerializer(notification)
                content = {
                    "command": "new_notification",
                    "notification": json.dumps(serializer.data),
                    "recipient": recipient.username,
                }
                self.send_new_notification(content)


    def send_social_cal_notification(self, data):
        # This method will be used for notifications related to the socialCalendar

        if data['command'] == 'send_pending_social_event':
            actor = get_object_or_404(User, id = data['socialEventObj']['curId'])
            recipient = get_object_or_404(User, id = data['socialEventObj']['calOwner'])
            eventObj = data['socialEventObj']
            notification = CustomNotification.objects.create(
                 type = "pending_social_event",
                 actor = actor,
                 recipient = recipient,
                 verb = "wants to post a social event",
                 pendingEventStartTime = eventObj['startTime'], #start time of event
                 pendingEventEndTime = eventObj['endTime'], #end time of event
                 pendingEventTitle = eventObj['title'],
                 pendingEventContent = eventObj['content'],
                 pendingEventLocation = eventObj['location'],
                 pendingEventCurId = eventObj['curId'],
                 pendingCalendarOwnerId = eventObj['calOwner'],
                 pendingEventDate = eventObj['date']
            )
            serializer = NotificationSerializer(notification)
            content = {
                "command": "new_notification",
                "notification": json.dumps(serializer.data),
                "recipient": recipient.username,
            }

            self.send_new_notification(content)
        if data['command'] == "send_pending_social_pics":
            # So the send pending social pics is a bit differnet from all the other
            # websocket becuase it involes sending images. So since the notification
            # for the pending pictures was already made we just have to call it
            # from the id
            notification = get_object_or_404(CustomNotification, id = data['notificationId'])

            serializer = NotificationSerializer(notification)
            content = {
                "command": "new_notification",
                "notification": json.dumps(serializer.data),
                "recipient": notification.recipient.username
            }

            self.send_new_notification(content)





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
        if data['command'] == 'send_follow_notification':
            self.send_notification(data)
        if data['command'] == 'send_shared_event_notification':
            self.send_personalCal_event_notification(data)
        if data['command'] == 'send_accepted_shared_event':
            self.send_personalCal_event_notification(data)
        if data['command'] == 'send_declined_shared_event':
            self.send_personalCal_event_notification(data)
        if data['command'] == 'send_edited_event_notification':
            self.send_personalCal_event_notification(data)
        if data['command'] == 'send_pending_social_event':
            self.send_social_cal_notification(data)
        if data['command'] == 'send_pending_social_pics':
            self.send_social_cal_notification(data)
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
        postObj = Post.objects.get(id = data['postId'])
        postObj.people_like.add(new_person_like)
        postObj.save()
        # postObj.people_like.add(new_person_like)
        # postObj.save()

        # So I am serialziing the like object because we want the list of user
        # in the peole_like to be list so we can open up a list of them
        newLikeObj = UserSerializer(new_person_like, many = False).data

        content = {
            'command': 'new_like',
            'postId': data['postId'],
            'user': newLikeObj
        }

        self.send_new_action(content)

    def unsend_one_like(self, data):
        # This function will be used remove one like from the post
        person_like = get_object_or_404(User,id = data['userId'])
        postObj = Post.objects.get(id = data['postId'])
        postObj.people_like.remove(person_like)
        postObj.save()

        unLikeObj = UserSerializer(person_like, many = False).data

        content = {
            'command': 'un_like',
            'postId': data['postId'],
            'user': unLikeObj

        }
        self.send_new_action(content)

    def send_comment(self, data):
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

    def delete_post(self, data):
        # This will delete the post
        Post.objects.get(id = data['postId']).delete()
        content = {
            'command':'delete_post',
            'postId': data['postId']
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
        if data['command'] == 'delete_post':
            self.delete_post(data)

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

    def fetch_profile(self, data):
        profile = get_object_or_404(User, username = data['username'])
        serializer = UserSerializer(profile).data

        content = {
            'command': 'user_profile',
            'profile': json.dumps(serializer)
        }
        self.send_json(content)


    def edit_profile(self, data):
        # This function will grab the current user that wants to change the
        # information in their profile. The first thing you want to do is
        # grab the current user. Then pull up the fields and then start
        # picking out the fields and changing them
        profile = get_object_or_404(User, id = data['editProfileObj']['userId'])

        profile.first_name = data['editProfileObj']['first_name']
        profile.last_name = data['editProfileObj']['last_name']
        profile.bio = data['editProfileObj']['bio']
        profile.phone_number = data['editProfileObj']['phone_number']
        profile.email = data['editProfileObj']['email']

        profile.save()

        # Now you are gonna get the updated profile

        updatedProfile = get_object_or_404(User, id = data['editProfileObj']['userId'])
        serializedProfile = UserSerializer(updatedProfile).data
        content = {
            'command': 'edited_profile',
            'editedProfile': serializedProfile,
            'reciever': serializedProfile['username']
        }

        self.send_new_explore(content)


    def create_social_event(self, data):
        # This will pretty much be like the create event view in teh mySocialCal
        # app

        # EventObj is a dictionary that contains all the event information
        eventObj = data['eventObj']

        user = get_object_or_404(User, id = eventObj['curId'])
        calOwner = get_object_or_404(User, id = eventObj['calOwner'])
        socialCalCell, created = SocialCalCell.objects.get_or_create(
            socialCalUser = calOwner,
            socialCaldate = eventObj['date'],
        )

        socialCalEvent = SocialCalEvent.objects.create(
            host = user,
            title = eventObj['title'],
            content = eventObj['content'],
            start_time = eventObj['startTime'],
            end_time = eventObj['endTime'],
            location = eventObj['location'],
            event_day = eventObj['date'],
            calCell = socialCalCell
        )
        socialCalEvent.persons.add(user)
        # This one you are just sending it to your self so its fine, I will have
        # to do one where we send it to the newsfeed, and one for persnal cal
        # probally gonna have to make a function where it creates a channel for when
        # an event is open

        socialCalCellObj = SocialCalCellSerializer(socialCalCell, many = False).data

        socialEventObj = SocialCalEventSerializer(socialCalEvent, many = False).data
        userObj = FollowUserSerializer(user, many = False).data
        ownerObj = FollowUserSerializer(calOwner).data


        content = {
            'command': 'send_social_event',
            'socialCalCellObj': socialCalCellObj,
            'created': created,
            'reciever': ownerObj['username']
        }

        self.send_new_explore(content)





    def add_user_social_event(self, data):
        # This is pretty much gonna be where you will use the eventId to get the
        # eventId and then you will use userId to get the user to add to the
        # event
        user = get_object_or_404(User, id = data['userId'])
        curSocialEvent = get_object_or_404(SocialCalEvent, id = data['eventId'])
        curSocialEvent.persons.add(user)
        curSocialCell = get_object_or_404(SocialCalCell, id = data['socialCalCellId'])


        socialCellObj = SocialCalCellSerializer(curSocialCell).data
        # get the whole event list instead so you can just replace everything --> faster
        socialCellEventList = socialCellObj['get_socialCalEvent']
        #  you need the username in order to send it to the right location
        socialCellOwner = socialCellObj['socialCalUser']['username']
        socialCellId = socialCellObj['id']


        content = {
            'command': 'add_user_social_event',
            'socialEventList': socialCellEventList,
            'socialCellId': socialCellId,
            'reciever': socialCellOwner
        }

        self.send_new_explore(content)


    def add_user_social_event_page(self, data):
        #Similar to the add_user_social_event but it will be used mainly for the
        # event pages, so you wanna limit certain infomation
        user = get_object_or_404(User, id = data['userId'])
        curSocialEvent = get_object_or_404(SocialCalEvent, id = data['eventId'])
        curSocialEvent.persons.add(user)

        # Owner fo the event page
        owner = get_object_or_404(User, id = data['ownerId'])

        serializedOwner = UserSocialEventSerializer(owner).data
        socialEventList = serializedOwner['get_socialEvents']
        socialEventPageOwner = serializedOwner['username']

        content = {
            'command': 'add_user_social_event_page',
            'socialEventList': socialEventList,
            'reciever': socialEventPageOwner
        }

        self.send_new_explore(content)

    # This will be removign the user from the event
    def remove_user_social_event(self, data):
        # Similar to adding users to event but now you are just removing

        user = get_object_or_404(User, id = data['userId'])
        curSocialEvent = get_object_or_404(SocialCalEvent, id = data['eventId'])
        curSocialEvent.persons.remove(user)
        curSocialCell = get_object_or_404(SocialCalCell, id = data['socialCalCellId'])



        socialCellObj = SocialCalCellSerializer(curSocialCell).data
        socialCellEventList = socialCellObj['get_socialCalEvent']

        # need username to know where to send
        socialCellOwner = socialCellObj['socialCalUser']['username']
        socialCellId = socialCellObj['id']

        content = {
            'command': 'remove_user_social_event',
            'socialEventList': socialCellEventList,
            'socialCellId': socialCellId,
            'reciever': socialCellOwner
        }

        self.send_new_explore(content)

    def remove_user_social_event_page(self, data):
        # This will be similar to the add_user_social_event_page but now you are
        #  just removing the user instead of adding them

        user = get_object_or_404(User, id = data['userId'])
        curSocialEvent = get_object_or_404(SocialCalEvent, id = data['eventId'])
        curSocialEvent.persons.remove(user)

        owner = get_object_or_404(User, id = data['ownerId'])

        serializedOwner = UserSocialEventSerializer(owner).data
        socialEventList = serializedOwner['get_socialEvents']
        socialEventPageOwner = serializedOwner['username']

        content = {
            'command': 'remove_user_social_event_page',
            'socialEventList': socialEventList,
            'reciever': socialEventPageOwner
        }

        self.send_new_explore(content)

        # CONTINUE HERE, IT SHOULD BE SIMILAR TO THE VIEWS IN MYSOCIALCAL
    def send_following(self, data):
        # This function is to set up the follow object inorder to be sent into the channel layer
        # just a reminder that the follower is the person sending the request
        #the following is the perosn that getting the follower
        follower = get_object_or_404(User,id = data['follower'])
        following = get_object_or_404(User, id = data['following'])
        followerObjSerial = FollowUserSerializer(follower, many = False).data
        followingObjSerial = FollowUserSerializer(following, many = False).data
        followerObj = UserFollowing.objects.create(person_following = follower, person_getting_followers = following)


        curUser = get_object_or_404(User, id = data['following'])
        hostObj = UserSerializer(curUser).data



        content = {
            'command': 'send_follower',
            'followerList': hostObj['get_followers'],
            'reciever': hostObj['username']
        }


        self.send_new_explore(content)

    def send_unfollowing(self, data):
        # This function is used to get the user objects and then will filter out the following
        # object and then delete the following
        # So the follower is the person doing the action and the following
        # is the person receiving the action
        follower = get_object_or_404(User, id = data['follower'])
        following = get_object_or_404(User, id = data['following'])
        followerObjSerial = FollowUserSerializer(follower, many = False).data
        followingObjSerial = FollowUserSerializer(following, many = False).data
        followerObj = UserFollowing.objects.filter(person_following = follower, person_getting_followers = following)
        followerObj.delete()

        # Following will be the host
        curUser = get_object_or_404(User, id = data['following'])
        hostObj = UserSerializer(curUser).data

        content = {
            'command': 'send_unfollower',
            'followerList': hostObj['get_followers'],
            'reciever': hostObj['username']
        }

        self.send_new_explore(content)

    def addUserCloseFriend(self, data):
        # This function is used to add a User to close friend which allows the
        # other person to post stuff on their social calendar
        # First you will get the current user. And then get the other user
        # then add the user to the many to many fields. Then return the friend list
        # of the cur user

        curUser = get_object_or_404(User, id = data['curId'])
        friend = get_object_or_404(User, id = data['friendId'])
        curUser.friends.add(friend)

        serializedFriendList = UserSerializer(curUser).data['friends']
        # After you add the friend, then you serialized the user and then grab the
        # userfriend list and then send it to the front end

        content = {
            'command': 'add_user_close_friend',
            'friendList': serializedFriendList,
            'reciever': friend.username
        }

        self.send_new_explore(content)

    def removeUserCloseFriend(self, data):
        # similar to addUserCloseFriend but you are removing a user from your
        # friendsList

        curUser = get_object_or_404(User, id = data['curId'])
        friend = get_object_or_404(User, id = data['friendId'])

        curUser.friends.remove(friend)

        serializedFriendList = UserSerializer(curUser).data['friends']

        # After you add the friend, then you serialized the user and then grab
        # grab the userfriend list and then send it to the frotn end

        content = {
            'command': 'remove_user_close_friend',
            'friendList': serializedFriendList,
            'reciever': friend.username
        }

        self.send_new_explore(content)

    def approve_social_pics(self, data):
        # This function will post the approved pictures on teh right place of the
        # social cal. This function will recieve the id of the custom notification
        # and the pull the pictuures and then add the pictures into the social
        # cal. Then information will be sent into the front end to update the social
        # cal
        # First thing is grab the notification
        notification = get_object_or_404(CustomNotification, id = data['notificationId'])
        serializedNotification = NotificationSerializer(notification).data

        # Now we will get the social cal cell
        calOwner = get_object_or_404(User, id = data['ownerId'])
        socialCalCell, created = SocialCalCell.objects.get_or_create(
            socialCalUser = calOwner,
            socialCaldate = data['eventDate']
        )

        # Then you will lopo through each of the picture that is in the custom notificaiton
        # and then add those into social cal items along with foreign key to the
        # social cal cell

        imgOwner = get_object_or_404(User, id = data['curId'])
        for items in serializedNotification['get_pendingImages']:
            image = items['itemImage']
            image = image.lstrip("/media")
            if socialCalCell.coverPic == "":
                socialCalCell.coverPic = image
                socialCalCell.save()

            SocialCalItems.objects.create(
                creator = imgOwner,
                itemUser = calOwner,
                itemImage = image,
                calCell = socialCalCell
            )

        socialCalCell.save()

        socialCalCellObj = SocialCalCellSerializer(socialCalCell).data
        content = {
            'command': 'approve_social_pics',
            'socialCelCellObj':socialCalCellObj,
            'created': created,
            'reciever': socialCalCellObj['socialCalUser']['username']

        }

        self.send_new_explore(content)

        # Add the path to send information into the front end here

    def send_new_follow(self, followObj):
        # This function is used to send follow objs into the websocket and to everyone
        # in the channel layer

        # THIS FORM NOW ON IS GONAN BE USED TO SEND ALL OBJECTS TO THE WEBSOCKET --> WHEN FINISHED
        # ILL CHANGE ALL THE NAMES
        channel_layer = get_channel_layer()
        channel_recipient = followObj['actorObjSerial']['username']
        channel = 'explore_'+channel_recipient


        # Thsi group send will be sent to your self (or the person doing the action)
        async_to_sync(self.channel_layer.group_send)(
            channel,
            {
                'type': 'new_follower_following',
                'followObj': followObj
            }
        )


    def send_new_explore(self, exploreObj):
        # This send will be used for the social cal and that in order for
        # this send to send we need to have a recive object in the content
        channel_layer = get_channel_layer()
        channel_recipient = exploreObj['reciever']
        channel = 'explore_'+channel_recipient


        # So we are reusing the new_follower_following to avoid giving more code
        # but all in all it still sends the same stuff in the front end
        async_to_sync(self.channel_layer.group_send)(
            channel,
            {
                'type': 'new_follower_following',
                'followObj': exploreObj
            }
        )




    def connect(self):
        # This will pretty much connect to the profils of each of the users
        # so when you login, it pretty much connects right away
        self.current_user = self.scope['url_route']['kwargs']['username']
        grp = 'explore_'+self.current_user
        async_to_sync(self.channel_layer.group_add)(grp, self.channel_name)
        self.accept()

    def disconnect(self, close_code):
        user = self.scope['user']
        self.current_user = self.scope['url_route']['kwargs']['username']
        grp = 'explore_'+self.current_user
        async_to_sync(self.channel_layer.group_discard)(grp, self.channel_name)

    def receive(self, text_data = None, bytes_data = None, **kwargs):
        data = json.loads(text_data)
        print(data)
        if data['command'] == 'fetch_profile':
            self.fetch_profile(data)
        if data['command'] == 'send_following':
            self.send_following(data)
        if data['command'] == 'send_unfollowing':
            self.send_unfollowing(data)
        if data['command'] == 'fetch_curUser_profile':
            self.fetch_curUser_profile(data)
        if data['command'] == 'send_social_like':
            self.send_social_like(data)
        if data['command'] == 'send_social_unlike':
            self.send_social_unlike(data)
        if data['command'] == 'send_social_comment':
            self.send_social_comment(data)
        if data['command'] == 'create_social_event':
            self.create_social_event(data)
        if data['command'] == 'add_user_social_event':
            self.add_user_social_event(data)
        if data['command'] == 'remove_user_social_event':
            self.remove_user_social_event(data)
        if data['command'] == 'add_user_social_event_page':
            self.add_user_social_event_page(data)
        if data['command'] == 'remove_user_social_event_page':
            self.remove_user_social_event_page(data)
        if data['command'] == 'edit_profile':
            self.edit_profile(data)
        if data['command'] == 'add_user_close_friend':
            self.addUserCloseFriend(data)
        if data['command'] == 'remove_user_close_friend':
            self.removeUserCloseFriend(data)
        if data['command'] == 'approve_social_pics':
            self.approve_social_pics(data)
    def new_follower_following(self, event):
        followObj = event['followObj']
        return self.send_json(followObj)



#  This consumer is for the post page alone
class UserPostConsumer(JsonWebsocketConsumer):
    #THIS IS USED FOR THE ALL THE FUNCTION OF THE POST PAGE SUCH AS
    # LIKING COMMENTING, CLIPPING AND SUCH LIKE THAT

    def fetch_user_post_info(self, data):
        post = get_object_or_404(Post, id = data['postId'])
        serializedPost = PostSerializer(post).data
        content = {
            'command': "user_post",
            'post': serializedPost
        }

        self.send_json(content)

    def send_user_post_like(self, data):
        post = get_object_or_404(Post, id = data['postId'])
        personLike = get_object_or_404(User, id = data['personLike'])


        post.people_like.add(personLike)
        post.save()


        serializedPost = PostSerializer(post).data
        likeList = serializedPost['people_like']

        username = serializedPost['user']['username']

        recipient = username+"_"+str(serializedPost['id'])

        content = {
            'command': 'send_user_post_like_unlike',
            'likeList': likeList,
            'recipient': recipient,
        }

        self.send_info_user_post(content)

    def send_user_post_unlike(self, data):
        post = get_object_or_404(Post, id = data['postId'])
        personUnlike = get_object_or_404(User, id = data['personUnlike'])

        post.people_like.remove(personUnlike)
        post.save()

        serializedPost = PostSerializer(post).data
        likeList = serializedPost['people_like']

        username = serializedPost['user']['username']

        recipient = username+"_"+str(serializedPost['id'])

        content = {
            'command': 'send_user_post_like_unlike',
            'likeList': likeList,
            'recipient': recipient,
        }

        self.send_info_user_post(content)

    def send_user_post_comment(self, data):
        # Similar to that of the social cal cell comment
        post = get_object_or_404(Post, id = data['postId'])

        personComment = get_object_or_404(User, id = data['curUser'])
        postComment = Comment.objects.create(
            post = post,
            commentUser = personComment,
            body = data['comment']
        )

        serializedPostComment = CommentSerializer(postComment).data
        username = post.user.username
        recipient = username+"_"+str(data['postId'])

        content = {
            'command': 'send_user_post_comment',
            'postComment': serializedPostComment,
            'recipient': recipient
        }

        self.send_info_user_post(content)

    def send_info_user_post(self, userPostObj):
        # This will send information ot the channel layer then intot he front end
        channel_layer = get_channel_layer()
        channel_recipient = userPostObj['recipient']
        channel = "post_"+channel_recipient

        async_to_sync(self.channel_layer.group_send)(
            channel,
            {
                'type': 'new_user_post_action',
                'userPostObj': userPostObj
            }
        )



    def connect(self):
        self.postUser = self.scope['url_route']['kwargs']['user']
        self.postId = self.scope['url_route']['kwargs']['postId']
        grp = 'post_'+self.postUser+'_'+self.postId
        async_to_sync(self.channel_layer.group_add)(grp, self.channel_name)
        self.accept()

    def disconnect(self, close_code):
        self.postUser = self.scope['url_route']['kwargs']['user']
        self.postId = self.scope['url_route']['kwargs']['postId']
        grp = 'post_'+self.postUser+'_'+self.postId
        async_to_sync(self.channel_layer.group_discard)(grp, self.channel_name)


    def receive(self, text_data=None, bytes_data=None, **kwargs):
        data = json.loads(text_data)
        if data['command'] == "fetch_user_post_info":
            self.fetch_user_post_info(data)
        if data['command'] == 'send_user_post_like':
            self.send_user_post_like(data)
        if data['command'] == 'send_user_post_unlike':
            self.send_user_post_unlike(data)
        if data['command'] == 'send_user_post_comment':
            self.send_user_post_comment(data)

    def new_user_post_action(self, action):
        userPostObj = action['userPostObj']
        return self.send_json(userPostObj)
