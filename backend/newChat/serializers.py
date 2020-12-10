# This file is to serialize all the models in the chats

from . import models


from rest_framework import serializers
from userprofile.models import User

# This will be the serializer for each chat, which consist of the users and messages
class ChatSerializer(serializers.ModelSerializer):
    get_messages = serializers.StringRelatedField(many = True)

    class Meta:
        model = models.Chat
        fields = (
            "id",
            "participants",
            "get_messages"
    )


    # This function will serialize the participants and messages so we can use the
    # data in the front end
    def to_representation(self, instance):
        messageList = []
        participantList = []

        data = super().to_representation(instance)
        for messages in data['get_messages']:
            message = MessageSerializer(models.Message.objects.get(id = messages)).data
            messageList.append(message)
        for participants in data['participants']:
            participant = ChatUser(User.objects.get(id = participants)).data
            participantList.append(participant)
        data['get_messages'] = messageList
        data['participants'] = participantList

        return data


# Since we don't need everyting from the user class on the chat we can just
# use this serializer to limit what we show
class ChatUser(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ("id", "username", 'first_name', 'last_name', 'profile_picture')


# This serializer will be used for the messages
class MessageSerializer(serializers.ModelSerializer):


    class Meta:
        model = models.Message
        fields = "__all__"

    # This will just serialize the messageuser so we can use in the frontend
    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['messageUser'] = ChatUser(User.objects.get(id = data['messageUser'])).data
        return data
