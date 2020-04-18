from rest_framework import serializers
from chat.models import Chat
from . import views

# When you do a many to many fields, the create method must be made your self

# so the StringRelatedField can be used when you are doing a many to many field
# and it will give the __str__ names of all the related fields connected to the many to many
class ContactSerializers(serializers.StringRelatedField):
    def to_internal_value(self, value):
        return value

# when you are doing the StringRelatedField and you have many to many you set it to True
class ChatSerializer(serializers.ModelSerializer):
    participants = ContactSerializers(many=True)
    class Meta:
        model = Chat
        fields = ('id', 'messages', 'participants')

# validated_data is a dictionary, and pop returns and removes the key and value
# chat =Chat() is creating a new chat from the Chat model
# when you make a chat you have to save it as well
    def create(self, validated_data):
        participants = validated_data.pop('participants')
        chat = Chat()
        chat.save()
        for username in participants:
            contact = views.get_user_contact(username)
            chat.participants.add(contact)
        chat.save()
        return chat



# do in python shell to see how to serialize the updated_at
# from chat.models import Chat
# from chat.api.serialziers import ChatSerialzier
# chat = Chat.objects.get(id=1)
# s =ChatSerializer(instace = chat)
# s
# s.data
