from datetime import datetime
from rest_framework import serializers
import pytz


from mycalendar import models
from userprofile.models import User
# from core.utils import DEFAULT_TIMEZONE, normalize_to_utc

# from core.utils import

class CalendarSerializer(serializers.ModelSerializer):
    """
    Calendar serializers for admins, allows settings of owners
    """
    class Meta:
        model = models.Calendar
        fields = ('person', 'title')



class CalendarOwnedSerializer(serializers.ModelSerializer):
    # Standard Calendar serializers for users
    #
    #    actor = UserSerializer(read_only=True)

    id = serializers.ReadOnlyField()

    class Meta:
        model = models.Calendar
        fields = ('id','person', 'title')

class MiniEventSerializer(serializers.ModelSerializer):
    # This is a miniSerializer that will be used for the
    # chat page so that you dont pull too much information

    class Meta:
        model = models.Event
        fields = (
            "id",
            "title",
            "content",
            "repeatCondition",
            "start_time",
            "end_time",
            "color",
            "person"
        )

class EventSerializer (serializers.ModelSerializer):
    # Event serializer for admins
    # id = serializers.ReadyOnlyField()

    # When you do a function inside the model, you need to declear
    # serilizers.StringRelatedField to at least get the field ot show up

    get_eventMessages = serializers.StringRelatedField(many = True)
    class Meta:
        model = models.Event
        fields = ('__all__')



    def to_representation(self, instance):
        personList=[]
        inviteList = []
        messageList = []
        acceptedList=[]
        data = super().to_representation(instance)
        for peopleID in data['person']:
            person = PersonSerializer(models.User.objects.get(id=peopleID)).data
            personList.append(person)
        for invites in data['invited']:
            invite = PersonSerializer(models.User.objects.get(id=invites)).data
            inviteList.append(invite)
        for messages in data['get_eventMessages']:
            message = EventMessagesSerializer(models.EventMessages.objects.get(id = messages)).data
            messageList.append(message)
        for acceptedPerson in data['accepted']:
            personAccept = PersonSerializer(models.User.objects.get(id=acceptedPerson)).data
            acceptedList.append(personAccept)
        data['accepted']=acceptedList
        data['person']  = personList
        data['invited'] = inviteList
        data['get_eventMessages'] = messageList
        data['host'] = PersonSerializer(models.User.objects.get(id = data['host'])).data
        return data

class EventMessagesSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.EventMessages
        fields = '__all__'
    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['messageUser'] = PersonSerializer(models.User.objects.get(id = data['messageUser'])).data
        return data

class PersonSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'profile_picture')


class CreateEventSerializer (serializers.ModelSerializer):
    # Event serializer for admins
    # id = serializers.ReadyOnlyField()


    class Meta:
        model = models.Event
        fields = '__all__'
        # fields = ('title', 'content', 'start_time', 'end_time', 'location', 'color', 'person', 'repeatCondition')
    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['host'] = PersonSerializer(models.User.objects.get(id = data['host'])).data
        return data
# So when youa are working with an updateapiview you need to have a update function
# in your serilaizer to update your data
class UpdateEventSerialzier (serializers.ModelSerializer):
    class Meta:
        model = models.Event
        fields = ('title', 'content', 'start_time', 'end_time', 'location', 'color', 'person')


class DeleteEventSerializer (serializers.ModelSerializer):
    class Meta:
        model = models.Event
        fields = ('title', 'content', 'start_time', 'end_time', 'location', 'color', 'person')


class EventBackgroundSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Event
        fields = ("backgroundImg",)
