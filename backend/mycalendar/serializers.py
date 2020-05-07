from datetime import datetime
from rest_framework import serializers
import pytz


from mycalendar import models
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

    class Meta:
        model = models.Event
        fields = '__all__'

class CreateEventSerializer (serializers.ModelSerializer):
    # Event serializer for admins
    # id = serializers.ReadyOnlyField()

    class Meta:
        model = models.Event
        fields = ('title', 'content', 'start_time', 'end_time', 'location', 'person')

# So when youa are working with an updateapiview you need to have a update function
# in your serilaizer to update your data
class UpdateEventSerialzier (serializers.ModelSerializer):
    class Meta:
        model = models.Event
        fields = ('title', 'content', 'start_time', 'end_time', 'location', 'person')
