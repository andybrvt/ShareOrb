import json
from channels.generic.websocket import JsonWebsocketConsumer
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from userprofile.models import User
from django.shortcuts import get_object_or_404

# This will be the consumer that we will use when you
# or persons access the album
class ColabAlbumConsumer(JsonWebsocketConsumer):


    def connect(self):
        self.selectedAlbum = self.scope['url_route']['kwargs']['albumId']
        grp = "colabAlbum_"self.selectedAlbum

        async_to_sync(self.channel_layer.group_add)(grp, self.channel_layer)
        self.accept()

    def disconnect(self, close_code):
        self.selectedAlbum = self.scope['url_route']['kwargs']['albumId']
        grp = "colabAlbum_"self.selectedAlbum

        async_to_sync(self.channel_layer.group_discard)(grp, self.channel_name)


    def receive(self, text_data= None, bytes_data = None, **kwargs):

        data = json.loads(text_data)
