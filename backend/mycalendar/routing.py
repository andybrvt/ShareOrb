from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    re_path(r'^ws/calendar/(?P<userId>\w+)$', consumers.CalendarConsumer),
    re_path(r'^ws/calendarEvent/(?P<eventId>\w+)$', consumers.EventPageConsumer)
]
