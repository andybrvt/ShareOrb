import json
from channels.generic.websocket import JsonWebsocketConsumer
from asgiref.sync import async_to_sync
from userprofile.models import User
from django.shortcuts import get_object_or_404
from channels.layers import get_channel_layer

class RequestCommentConsumer(JsonWebsocketConsumer):

    def connect(self):
        self.requestItem = self.scope['url_route']['kwargs']['requestId']
        grp = "requestComments_"+self.requestItem
        async_to_sync(self.channel_layer.group_add)(grp, self.channel_name)
        self.accept()


    def disconnect(self, close_code):
        self.requestItem = self.scope['url_route']['kwargs']['requestId']
        grp = "requestComments_"+self.requestItem
        async_to_sync(self.channel_layer.group_discard)(grp, self.channel_name)


    def receive(self, text_data= None, bytes_data = None, **kwargs):
        data = json.loads(text_data)
        print(data)
