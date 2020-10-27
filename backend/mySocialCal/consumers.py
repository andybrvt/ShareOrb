import json
from channels.generic.websocket import JsonWebsocketConsumer
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from userprofile.models import User
from django.shortcuts import get_object_or_404
from .models import SocialCalEvent
from .serializers import SocialCalEventSerializer

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
        print("receive")
        data = json.loads(text_data)
        if data["command"] == "fetch_social_event_messages":
            self.send_fetch_social_event_messages(data);
