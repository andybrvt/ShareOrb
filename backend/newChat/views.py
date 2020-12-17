from django.shortcuts import render
from rest_framework import generics
from . import models
from . import serializers
from userprofile.models import User
from rest_framework import permissions
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone
import pytz

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


# DELETE LATER
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

class CreateNewChatView(APIView):
    # This class will be used to create a new chat and then return the chatId
    # to redirect to the correct chat and then be used to send out the new
    # created chat to the other users

    def post(self, request, *args, **kwargs):
        print('new chats')
        print(request.data)

        recentSender = get_object_or_404(User, id = request.data['senderId'])

        timezone.activate(pytz.timezone("MST"))
        time = timezone.localtime(timezone.now()).strftime("%Y-%m-%d %H:%M:%S")

        # Create chat
        chat = models.Chat.objects.create(
            recentMessage = request.data['message'],
            recentSender = recentSender,
            recentTime = time
        )
        # Add participants into ManyToManyField
        for participant in request.data['chatParticipants']:
            # This will add the participants into the chat
            chatUser = get_object_or_404(User, id = participant)
            chat.participants.add(participant)

        # Add first message in
        newMessage = models.Message.objects.create(
            chat = chat,
            body = request.data['message'],
            messageUser = recentSender
        )

        # Now all you have to do is return the chatId that will be used
        # to redirect the page and refresh the users chat list

        return Response(chat.id)

class GetChatSearchView(APIView):
    # This class will use to find the correct chat inorder to show when you
    # are searching for an existing chat in the chats

    def post(self, request, *args, **kwargs):
        print("get chats")
        print(request.data)

        chatList = models.Chat.objects.all()
        for names in request.data['person']:
            chatList = chatList.filter(participants__id = names).distinct()

        print(chatList)

        serializedChat = serializers.ChatSerializer(chatList, many = True).data


        print(len(serializedChat))
        messages = []
        chatId = ""
        if(len(serializedChat) != 0):
            messages = serializedChat[0]['get_messages']
            chatId = serializedChat[0]['id']

        content = {
            "messages": messages,
            "chatId": chatId
        }
        return Response(content)
