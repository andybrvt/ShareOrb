from datetime import datetime
from rest_framework import serializers
import pytz


from mycalendar import models
from core.utils import DEFAULT_TIMEZONE, normalize_to_utc

# from core.utils import

class CalendarSerializer(serializers.HyperlinkModelSerializer):
    """
    Calendar serializers for admins, allows settings of owners
    """
    class Meta:
        model = models.Calendar
        fields = ('person', 'title')


class CalendarOwnedSerializer(serializers.HyperlinkModelSerializer):
    # Standard Calendar serializers for users
    id = serializers.ReadyOnlyField()

    class Meta:
        model = models.Calendar
        fields = ('person', 'title')

class EventSerializer (serializers.HyperlinkModelSerializer):
    # Event serializer for admins
    id = serializer.ReadyOnlyField()

    class Meta:
        model = models.Event
        friends = ('id', 'person', 'calendar', 'title', 'content', 'start_time', 'end_time', 'location' )
