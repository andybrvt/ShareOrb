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
        recentSender = get_object_or_404(User, id = request.data['senderId'])

        # timezone.activate(pytz.timezone("MST"))
        # time = timezone.localtime(timezone.now()).strftime("%Y-%m-%d %H:%M:%S")

        # Create chat
        chat = models.Chat.objects.create(
            recentMessage = request.data['message'],
            recentSender = recentSender,
            recentTime = timezone.now()
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

        chatList = models.Chat.objects.all()

        # This can use some improvements
        for names in request.data['person']:
            chatList = chatList.filter(participants__id = names).distinct()

        serializedChat = serializers.ChatSerializer(chatList, many = True).data
        messages = []
        chatId = ""
        participants = []
        curChat = {}
        if(len(serializedChat) != 0):
            messages = serializedChat[0]['get_messages']
            chatId = serializedChat[0]['id']
            curChat = serializedChat[0]

            content = {
                "messages": messages,
                "chatId": chatId,
                "curChat": curChat
            }
        else:
            # This is for when there are not chats that exist for that list of
            # persons
            # You just pull the users so that you can just fill up the curChats
            # so that there will be something there
            userList = User.objects.filter(id__in = request.data['person'])
            participants = serializers.ChatUser(userList, many = True).data
            content = {

                "messages": messages,
                "chatId": chatId,
                "curChat": {"participants": participants}
            }


        return Response(content)


# Create a search view for chats here later
class GetIndividualExisitingChat(APIView):
    # This function will be used mainly for the profile page in order to redirect
    # them to the chat list. In this case it will be searching if the perosn exist
    # and along with the current person and then check the length is only
    # 2
    def post(self, request, *args, **kwargs):

        users = [request.data['user1'], request.data['user2']]
        existingChats = models.Chat.objects.filter(participants__id = request.data['user1']).filter(participants__id = request.data['user2']).distinct()

        for chats in existingChats:
            if chats.participants.count() == 2:
                content = {
                    "curChat": chats.id,
                    "hasChats": True
                }
                return Response(content)

        # So if you can't find a chat that works you will
        # return the name of the participants and then try to
        # create a tempoary chat on the chat list
        user1 = get_object_or_404(User, id = request.data['user1'])
        user2 = get_object_or_404(User, id = request.data['user2'])

        user1 = serializers.ChatUser(user1).data
        user2 = serializers.ChatUser(user2).data


        content = {
            "curChat": {"participants": [user1, user2]},
            "hasChats": False
        }
        return Response(content)

class CreateChatEventMessage(APIView):
    # This view will be used to create a chat event when the chat already
    # exist. The reason I am not do a get_or_create is because there are
    # events that have the same name and could possiblity the same
    # information

    # You will just need the chat id and then the event information

    def post(self, request, *args, **kwargs):
        # Now you will pretty much create the chat event message here

        chatObj = get_object_or_404(models.Chat, id = request.data['chatId'])
        senderObj = get_object_or_404(User, id = request.data['senderId'])

        # Now you will create teh message.

        newMessage = models.Message.objects.create(
            chat = chatObj,
            body = senderObj.first_name+" shared an event",
            messageUser = senderObj,
            type = "event",
            eventTitle = request.data['eventObj']['title'],
            eventStartTime = request.data['eventObj']['start_time'],
            eventEndTime = request.data['eventObj']['end_time'],
            eventPersons = len(request.data['eventObj']['person']),
            eventId = request.data['eventObj']['id']
        )

        newMessage.save()

        # Now return the chat id and that is it so that you cna redirect to the
        # page




        return Response(chatObj.id)


class CreateNewChatEventMessage(APIView):
    # This view is used to create a new chat and then create a
    # new chat event message

    # pretty much the same as the createnew chat view but now with the messages
    # changed

    def post(self, request, *args, **kwargs):

        recentSender = get_object_or_404(User, id = request.data['senderId'])
        # timezone.activate(pytz.timezone("MST"))
        # time = timezone.localtime(timezone.now()).strftime("%Y-%m-%d %H:%M:%S")

        chat = models.Chat.objects.create(
            recentMessage = recentSender.first_name+" shared an event",
            recentSender = recentSender,
            recentTime = timezone.now()
        )

        # this is to add participants in
        for participant in request.data['chatParticipants']:
            chatUser = get_object_or_404(User, id = participant)
            chat.participants.add(participant)

        # Add the new event message
        newMessage = models.Message.objects.create(
            chat = chat,
            body = recentSender.first_name+" shared an event",
            messageUser = recentSender,
            type = "event",
            eventTitle = request.data['eventObj']['title'],
            eventStartTime = request.data['eventObj']['start_time'],
            eventEndTime = request.data['eventObj']['end_time'],
            eventPersons = len(request.data['eventObj']['person']),
            eventId = request.data['eventObj']['id']
        )


        return Response(chat.id)
