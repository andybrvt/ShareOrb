from django.db import models
from django.conf import settings
from django.contrib.auth import get_user_model
from userprofile.models import User
# Create your models here.

class Contact(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name = 'chatFriends', on_delete = models.CASCADE)
    friends = models.ManyToManyField ('self', blank = True)

    def __str__(self):
        return self.user.username


class Message (models.Model):
    contact = models.ForeignKey(Contact, on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add = True)
    def __str__(self):
        return str(self.contact.user)


class Chat(models.Model):
    participants = models.ManyToManyField(Contact, related_name = 'chats')
    messages = models.ManyToManyField(Message, blank  = True)



    def __str__(self):
        return "{}".format(self.pk)
