import json
from channels.generic.websocket import JsonWebsocketConsumer
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from userprofile.models import User
from django.shortcuts import get_object_or_404
from .models import SocialCalEvent
from .models import SocialEventMessages
from .models import SocialCalCell
from .models import SocialCalComment
from .serializers import SocialCalUserSerializer
from .serializers import SocialCalCellSerializer
from .serializers import SocialCalEventSerializer
from .serializers import SocialEventMessagesSerializer
from .serializers import SocialCalCommentSerializer

# This consumer is mostly used for managing the social events ie
# soical event page. Where as the other cosnumer that is in the
# userprofile is more for managing stuff in the profile, and since
# the socialcal is in the userprofile is part of that but for the event
# page, it is seperate so it gets it own serializer

class SocialCalandarConsumer(JsonWebsocketConsumer):

    def send_fetch_social_event_messages(self,data):
    # This will grab the information of the event
        viewSocialEvent = get_object_or_404(SocialCalEvent, id = data['socialEventId'])
        serializer = SocialCalEventSerializer(viewSocialEvent).data
        content = {
            "command": "fetch_social_event_info",
            "eventInfo": serializer
        }
        self.send_json(content)

    def send_social_event_message(self, data):
        # This will create the message object and then make a foreign key to the
        # correct event
        viewSocialEvent = get_object_or_404(SocialCalEvent, id = data['socialEventId'])
        user = get_object_or_404(User, id = data['userId'])

        # This will create the message
        socialEventMessage, created = SocialEventMessages.objects.get_or_create(
            eventObj = viewSocialEvent,
            body = data['message'],
            messageUser = user
        )

        # Now you will have to serialize the data

        serializer = SocialEventMessagesSerializer(socialEventMessage).data
        content = {
            "command": "send_social_event_message",
            "socialEventMessgaeObj": serializer,
            "socialEventId": data['socialEventId']
        }
        self.send_social_message(content)


    def send_social_edit_event_info(self, data):
        print(data)
        eventEdit = get_object_or_404(SocialCalEvent, id = data['editSocialEventObj']['eventId'])
        print(eventEdit)
        eventEdit.title = data['editSocialEventObj']['title']
        eventEdit.content = data['editSocialEventObj']['content']
        eventEdit.start_time = data['editSocialEventObj']['start_time']
        eventEdit.end_time = data['editSocialEventObj']['end_time']
        eventEdit.location = data['editSocialEventObj']['location']
        eventEdit.event_day = data['editSocialEventObj']['event_day']

        eventEdit.save()

        updatedEvent = get_object_or_404(SocialCalEvent, id = data['editSocialEventObj']['eventId'])
        serializer = SocialCalEventSerializer(updatedEvent)

        content = {
            "command": "edited_social_event",
            "editedSocialEvent": serializer.data,
            "socialEventId": data['editSocialEventObj']['eventId']
        }
        self.send_social_message(content)

    def send_social_event_delete(self, data):
        print(data)
        selectedEvent = get_object_or_404(SocialCalEvent, id = data['eventId'])
        serializer = SocialCalEventSerializer(selectedEvent).data
        personList = serializer['persons'].copy()
        personList.remove(serializer['host'])
        selectedEvent.delete();

        content = {
            "command": "delete_social_eventNotification",
            "socialEventId": data['eventId']
        }
        self.send_social_message(content)

    def send_social_message(self, socialEventMessage):
        # This will be for sending inforamtion inot the channel layer to the groups
        channel_layer = get_channel_layer()
        channel_recipient = socialEventMessage['socialEventId']
        channel = 'socialEvent_'+str(channel_recipient)

        async_to_sync(self.channel_layer.group_send)(
            channel,
            {
                'type': 'new_social_message',
                'eventMessage': socialEventMessage
            }
        )

    def connect(self):
        # self.scope will pull stuff from the channel instance, the url kwargs is
        # to specific info off the channel urls
        print("connect")
        self.selected_event = self.scope['url_route']['kwargs']['socialEventId']
        grp = 'socialEvent_'+self.selected_event
        async_to_sync(self.channel_layer.group_add)(grp, self.channel_name)
        self.accept()

    def disconnect(self, close_code):
        print("disconnect")
        # Pretty much the same as cnnnect but now you are disconnecting
        self.selected_event = self.scope['url_route']['kwargs']['socialEventId']
        grp = 'socialEvent_'+self.selected_event
        async_to_sync(self.channel_layer.group_discard)(grp, self.channel_name)

    def receive(self, text_data= None, bytes_data = None, **kwargs):

        data = json.loads(text_data)
        print(data)
        if data["command"] == "fetch_social_event_messages":
            self.send_fetch_social_event_messages(data);
        if data["command"] == "send_social_event_message":
            self.send_social_event_message(data)
        if data["command"] == "send_social_edit_event_info":
            self.send_social_edit_event_info(data)
        if data["command"] == "send_social_event_delete":
            self.send_social_event_delete(data)

    def new_social_message(self, message):
        messageObj = message['eventMessage']
        return self.send_json(messageObj)



class SocialCalCellConsumer(JsonWebsocketConsumer):
    # This is for the specific cells when you open them up, it will connect to
    # its own cell
    def send_fetch_social_cal_cell_info(self, data):
        # This will fetch the information of the cal cell page. It will use
        # the user name and date to filter that event. if there is no event
        # you will just return the user object so that it will fill up the page
        # but no event (hopefully if you filter and it is not there it will be empty)

        print (data)
        user = get_object_or_404(User, username = data['cellUser'])
        socialCell = SocialCalCell.objects.filter(
            socialCalUser = user,
            socialCaldate = data['cellDate']
        )

        if socialCell:
            # When the social cal cell does exist
            serializerCell = SocialCalCellSerializer(socialCell[0]).data
            content = {
                'command': 'fetch_social_cal_cell_info',
                'socialCalCell': serializerCell
            }
            print(content)
            self.send_json(content)
        else:
            # When the social cal cell does not exist
            serializerUser = SocialCalUserSerializer(user).data
            content = {
                'command': 'fetch_social_cal_cell_info',
                'socialCalCell': {'socialCalUser':serializerUser}
            }
            print(content)
            self.send_json(content)


    def send_social_cal_cell_like(self, data):
        # This will pretty much create a social cell object if it is not already
        # created and then add a like to itself.

        # So you will used get_or_create and then pass it it redux to the event page

        #  personLIke and cellowner will be in id form
        personLike = get_object_or_404(User, id = data['personLike'])
        calOwner = get_object_or_404(User, id = data['cellOwner'])
        print(personLike, calOwner )

        # So to save one space and such, you only want to create a social cal cell object
        # when there is a like or commment, pics or events. this si where get_or create comes in
        # handy
        socialCell, created = SocialCalCell.objects.get_or_create(
            socialCalUser = calOwner,
            socialCaldate = data['cellDate']
        )

        socialCell.people_like.add(personLike)
        socialCell.save()

        socialCalCellObj = SocialCalCellSerializer(socialCell).data

        # Unlike the older like, we will remove the testdate bc it will have
        # conflict in creating the object

        # When sending out the content you have to split it up so that it matches
        # the right websocket that you are sending it to

        # The format --> socialCalCell_username_year_month_day

        dateList = data['cellDate'].split("-")
        username = calOwner.username
        print(dateList)
        print(username)

        # You will use recipient to attach the group name
        recipient = username+"_"+dateList[0]+"_"+dateList[1]+"_"+dateList[2]

        print(recipient)
        content = {
            'command': 'send_social_cal_cell_like_unlike',
            'likeList': socialCalCellObj['people_like'],
            'recipient': recipient
        }


        self.send_info_cal_cell(content)

    def send_social_cal_cell_unlike(self, data):
        # This is pretty much simialr to the social cal cell like but you just
        # remove the user from the like list
        personUnlike = get_object_or_404(User, id = data['personUnlike'])
        calOwner = get_object_or_404(User, id = data['cellOwner'])


        # Since in order to unlike something you have to already have liked it
        # so that means the object is already created. So to avoid errors. I will
        # not do a get or create... maybe do a get_object_or_404

        socialCell = get_object_or_404(SocialCalCell,
            socialCalUser = calOwner,
            socialCaldate = data['cellDate']
        )

        socialCell.people_like.remove(personUnlike)
        socialCell.save()

        socialCalCellObj = SocialCalCellSerializer(socialCell).data

        # Now we will create the tag name for the channel group
        dateList = data['cellDate'].split("-")
        username = calOwner.username

        # You will the use the recipient to attach to the group name
        recipient = username+"_"+dateList[0]+"_"+dateList[1]+"_"+dateList[2]

        content = {
            'command': 'send_social_cal_cell_like_unlike',
            'likeList': socialCalCellObj['people_like'],
            'recipient': recipient
        }

        self.send_info_cal_cell(content)

    def send_social_cal_cell_comment(self, data):
        # This will make teh social comment objects
        # You will get_or_create on this one because you can have a chance of
        # making a soical cal cell
        personComment = get_object_or_404(User, id = data['personComment'])
        calOwner = get_object_or_404(User, id = data['cellOwner'])

        # First you will create or get the cell
        socialCell, created = SocialCalCell.objects.get_or_create(
            socialCalUser = calOwner,
            socialCaldate = data['cellDate']
        )

        # Unlike the likin gyou do not need to add stuff into the object but rather
        # you will create the social comment
        socialComment = SocialCalComment.objects.create(
            calCell = socialCell,
            body = data['comment'],
            commentUser = personComment
        )

        # Now you will serialize teh comment and then you can just send it
        # You probally don't need to send the whole cell because you just
        # gotta replace teh get_comments

        socialCalCellComment = SocialCalCommentSerializer(socialComment).data

        print(socialCalCellComment)

        # Now we will create the tag name for the channel group
        dateList = data['cellDate'].split("-")
        username = calOwner.username

        # You will the use the recipient to attach to the group name
        recipient = username+"_"+dateList[0]+"_"+dateList[1]+"_"+dateList[2]

        content = {
            'command': 'send_social_cal_cell_comment',
            'socialComment': socialCalCellComment,
            'recipient': recipient
        }

        self.send_info_cal_cell(content)





    def send_info_cal_cell (self, calCellObj):
        # This will be used ot send the info into the front end
        channel_layer = get_channel_layer()
        channel_recipient = calCellObj['recipient']
        channel = 'socialCalCell_'+channel_recipient

        async_to_sync(self.channel_layer.group_send)(
            channel,
            {
                'type': 'new_social_cal_cell_action',
                'socialCalAction': calCellObj
            }
        )

    def connect(self):
        # gotta connect it properly, the code or name of the social cal cell will
        # be the combination of the user name, year, month and day
        print("connect")
        self.selectedUser = self.scope['url_route']['kwargs']['user']
        self.selectedYear = self.scope['url_route']['kwargs']['year']
        self.selectedMonth = self.scope['url_route']['kwargs']['month']
        self.selectedDay = self.scope['url_route']['kwargs']['day']
        grp = 'socialCalCell_'+self.selectedUser+'_'+self.selectedYear+'_'+self.selectedMonth+'_'+self.selectedDay
        print(grp)

        async_to_sync (self.channel_layer.group_add)(grp, self.channel_name)
        self.accept()


    def disconnect(self, close_code):
        print("disconnect")
        self.selectedUser = self.scope['url_route']['kwargs']['user']
        self.selectedYear = self.scope['url_route']['kwargs']['year']
        self.selectedMonth = self.scope['url_route']['kwargs']['month']
        self.selectedDay = self.scope['url_route']['kwargs']['day']
        grp = 'socialCalCell_'+self.selectedUser+'_'+self.selectedYear+'_'+self.selectedMonth+'_'+self.selectedDay
        async_to_sync(self.channel_layer.group_discard)(grp, self.channel_name)


    def receive(self, text_data= None, bytes_data = None, **kwargs):
        data = json.loads(text_data)
        print(data)
        if data['command'] == 'fetch_social_cal_cell_info':
            self.send_fetch_social_cal_cell_info(data)
        if data['command'] == 'send_social_cal_cell_like':
            self.send_social_cal_cell_like(data)
        if data['command'] == 'send_social_cal_cell_unlike':
            self.send_social_cal_cell_unlike(data)
        if data['command'] == 'send_social_cal_cell_comment':
            self.send_social_cal_cell_comment(data)

    def new_social_cal_cell_action(self, action):
        socialCalCellObj = action['socialCalAction']
        return self.send_json(socialCalCellObj)
