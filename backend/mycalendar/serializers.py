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
        fields = ('person', 'title', 'content', 'start_time', 'end_time')



class CalendarOwnedSerializer(serializers.ModelSerializer):
    # Standard Calendar serializers for users
    #
    #    actor = UserSerializer(read_only=True)

    id = serializers.ReadOnlyField()

    class Meta:
        model = models.Calendar
        fields = ('person', 'title', 'content', 'start_time', 'end_time')

class EventSerializer (serializers.ModelSerializer):
    # Event serializer for admins
    # id = serializers.ReadyOnlyField()

    class Meta:
        model = models.Event
        friends = ('id', 'person', 'calendar', 'title', 'content', 'start_time', 'end_time', 'location')
