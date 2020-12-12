from django.shortcuts import render
from rest_framework import generics
from . import models
from . import serializers
from userprofile.models import User
from rest_framework import permissions
from django.shortcuts import get_object_or_404

# Create your views here.

# get the last 10 messages in the chat
# def get_last_10_messages(chatId):
#     chat = get_object_or_404(models.Chat, id = chatId)
#     return chat.get_messages()[:10]

# to check out the chat view and the message view first
class ChatView(generics.ListAPIView):
    # This will show the chat view
    queryset = models.Chat.objects.all()
    serializer_class = serializers.ChatSerializer


class MessageView(generics.ListAPIView):
    # This will show the messages
    queryset = models.Message.objects.all()
    serializer_class = serializers.MessageSerializer


# This view will get all the chats pretaining to a specific user
# if you wanna search up a speicfic user chats use ($username=username)

class NewChatListView(generics.ListAPIView):
    serializer_class = serializers.ChatSerializer
    permission_classes = (permissions.AllowAny,)

    def get_queryset(self):
        # Pretty much call all the chats if there is no username called
        queryset = models.Chat.objects.all()
        # This is used to get the userId from the url. It wont show on urls but
        # you can add it on
        userId = self.request.query_params.get("userId", None)
        if userId is not None:
            user = get_object_or_404(User, id = userId)
            # you can call the related name of a modal to call the modal
            queryset = user.chat_parti.all()
        return queryset
