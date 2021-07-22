import json
from channels.generic.websocket import JsonWebsocketConsumer
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from userprofile.models import User
from django.shortcuts import get_object_or_404
from .models import ColabAlbum
from .serializers import ColabAlbumSerializer
# This will be the consumer that we will use when you
# or persons access the album
class ColabAlbumConsumer(JsonWebsocketConsumer):

    # This function use to grab the inital pictures in the colab album
    def send_fetch_colab_album(self, data):
        # pretty much just grab album and then serialize it and return it
        album = get_object_or_404(ColabAlbum, id = data['albumId'])

        # serialize
        serialize = ColabAlbumSerializer(album).data
        content = {
            'command': 'fetch_colab_album',
            'albumInfo': serialize
        }

        self.send_json(content)


    def connect(self):
        self.selectedAlbum = self.scope['url_route']['kwargs']['albumId']
        grp = "colabAlbum_"+str(self.selectedAlbum)

        async_to_sync(self.channel_layer.group_add)(grp, self.channel_name)
        self.accept()

    def disconnect(self, close_code):
        self.selectedAlbum = self.scope['url_route']['kwargs']['albumId']
        grp = "colabAlbum_"+str(self.selectedAlbum)

        async_to_sync(self.channel_layer.group_discard)(grp, self.channel_name)


    def receive(self, text_data= None, bytes_data = None, **kwargs):

        data = json.loads(text_data)
        print(data)
        if data['command'] == "fetch_colab_album":
            self.send_fetch_colab_album(data)
