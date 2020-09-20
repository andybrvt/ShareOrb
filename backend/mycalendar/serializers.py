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

class EventSerializer (serializers.ModelSerializer):
    # Event serializer for admins
    # id = serializers.ReadyOnlyField()
    getPeople = serializers.StringRelatedField (many = True)

    class Meta:
        model = models.Event
        fields = ('__all__')
        peopleList=[]



    def to_representation(self, instance):
        data = super().to_representation(instance)
        for personID in data['getPeople']:
            personInfo = PersonSerializer(models.User.objects.get(id = personID)).data
            peopleList.append(personInfo)
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
