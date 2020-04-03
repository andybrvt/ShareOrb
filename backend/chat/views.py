from django.shortcuts import render, get_object_or_404
from .models import Chat, Contact
from django.conf import settings
from userprofile.models import User


def get_last_10_messages(chatID):
    chat = get_object_or_404(Chat, id = chatID)
    return chat.messages.order_by('-timestamp').all()[:10]

def get_user_contact(username):
    user = get_object_or_404(User, username = username)
    return get_object_or_404(Contact, user=user)

def get_current_chat(chatId):
    return get_object_or_404(Chat, id = chatId)
