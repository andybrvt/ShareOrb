from django.db import models
from userprofile.models import User
from django.conf import settings
from django.utils import timezone


# Create your models here.


# These modals will be used to make these chat. There will be each chat
# object for each chat. Each chat can consist of a number of people or
# just two people. The chat will also have message objects within the chats
# which will link to a user


# This class will be used to make the chat objects.
class Chat(models.Model):
    # you will need the participants, usually this includes you as well
    # so it would be a ManyToManyField
    participants = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name = "chat_parti")

    # Recent message (this will be the most recent message), the one that you are gonna
    # show on the side panel
    recentMessage = models.TextField(default = "Message")
    recentSender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete = models.CASCADE, related_name = "recent_sender", null = True)

    # The recent time will be the most recent time that a text was sent
    recentTime = models.DateTimeField(default = timezone.now)

    # you are gonna put a function here that gets all the message object
    # for this chat

    def get_messages(self):
        # This will attached the messages to the right chat by the foriegnkey. All
        # you have to do is filter out the right messages for each social event
        return Message.objects.filter(chat = self).values_list('id', flat = True)

# This class will be fore the methods inside the chat
class Message(models.Model):

    # This will link the message to the right chat
    chat = models.ForeignKey(Chat, on_delete = models.CASCADE, related_name = "chat_message")
    body = models.TextField()
    created_at = models.DateTimeField(auto_now_add = True)
    messageUser = models.ForeignKey(settings.AUTH_USER_MODEL, related_name = "message_user", on_delete = models.CASCADE, null = True)

    class Meta:
        ordering = ['-created_at']
