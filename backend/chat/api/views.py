from django.shortcuts import get_object_or_404
from rest_framework import permissions
from rest_framework.generics import (
    ListAPIView,
    RetrieveAPIView,
    CreateAPIView,
    DestroyAPIView,
    UpdateAPIView
)

from chat.models import Chat, Contact
from .serializers import ChatSerializer
from django.conf import settings
from userprofile import models



def get_user_contact(username):
    user = settings.AUTH_USER_MODEL
    print(user)
    user = get_object_or_404(models.User, username = username)
    print(user)
    contact = get_object_or_404(Contact, user = user)
    return contact


# when doing the url remember ( $ username =username)
class ChatListView(ListAPIView):
    serializer_class = ChatSerializer
    permission_classes = (permissions.AllowAny, )

    def get_queryset(self):
        queryset = Chat.objects.all()
        username = self.request.query_params.get('username', None)
        if username is not None:
            contact=get_user_contact(username)
            queryset=contact.chats.all()
        return queryset

class ChatDetailView(RetrieveAPIView):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer
    permission_classes = (permissions.AllowAny, )

class ChatCreateView(CreateAPIView):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer
    permission_classes = (permissions.IsAuthenticated, )

class ChatUpdateView(UpdateAPIView):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer
    permission_classes = (permissions.IsAuthenticated, )

class ChatDetailView(DestroyAPIView):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer
    permission_classes = (permissions.IsAuthenticated, )
