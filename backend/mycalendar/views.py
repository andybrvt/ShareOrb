from django.shortcuts import render
from . import models
from rest_framework import generics
from . import serializers

# Create your views here.
# def get_calendar(request):
#     all_events = Events.objects.all()
#     content = {
#         'event': all_events,
#     }
#
#     return

class CalendarView(generics.ListAPIView):
    serializer_class = serializers.CalendarOwnedSerializer
    queryset = models.Calendar.objects.all()

class CalendarEventsView(generics.ListAPIView):
    serializer_class = serializers.EventSerializer
    queryset = models.Event.objects.all()
