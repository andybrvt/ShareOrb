import json
from channels.generic.websocket import JsonWebsocketConsumer
from asgiref.sync import async_to_sync
from userprofile.models import User
from django.shortcuts import get_object_or_404
from channels.layers import get_channel_layer
from .models import UserRequest
from .models import RequestComment
from .serializers import RequestItemCommentSerializer

class RequestCommentConsumer(JsonWebsocketConsumer):

    def fetch_comment_request_info(self, data):

        request = get_object_or_404(UserRequest, id = data['requestId'])

        requestComment = RequestComment.objects.filter(
            request = request
        )

        serializedComments = RequestItemCommentSerializer(requestComment, many = True).data

        content = {
            'command': 'fetch_request_item_comment',
            'itemComments': serializedComments
        }

        self.send_json(content)

    def send_request_item_comment(self, data):

        request = get_object_or_404(UserRequest, id = data['requestId'])
        user = get_object_or_404(User, id = data['userId'])


        requestComment = RequestComment.objects.create(
            request = request,
            body = data['comment'],
            commentUser = user
        )

        serializedComments = RequestItemCommentSerializer(requestComment, many = False).data

        content = {
            'command':'send_request_item_comment',
            'requestComment': serializedComments,
            'requestId': data['requestId']
        }

        self.send_request_info_comment(content)

    def send_request_info_comment(self, commentObj):
        channel_layer = get_channel_layer()
        channel_recipient = str(commentObj['requestId'])
        channel = "requestComments_"+channel_recipient


        async_to_sync(self.channel_layer.group_send)(
            channel,
            {
                "type": "new_request_comment_action",
                "commentAction": commentObj
            }
        )



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
        if data['command'] == 'fetch_comment_request_info':
            self.fetch_comment_request_info(data)
        if data['command'] == "send_request_item_comment":
            self.send_request_item_comment(data)

    def new_request_comment_action(self, action):
        commentObj = action['commentAction']
        return self.send_json(commentObj)
