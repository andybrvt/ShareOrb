import json
from channels.generic.websocket import JsonWebsocketConsumer
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from userprofile.models import User
from django.shortcuts import get_object_or_404
from .models import SocialCalEvent
from .models import SocialEventMessages
from .serializers import SocialCalEventSerializer
from .serializers import SocialEventMessagesSerializer

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

    def new_social_message(self, message):
        messageObj = message['eventMessage']
        return self.send_json(messageObj)
