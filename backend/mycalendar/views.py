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

class AllEventsView(generics.ListAPIView):
    serializer_class = serializers.EventSerializer
    queryset = models.Event.objects.all()


class CalendarEventsView(generics.ListAPIView):
    serializer_class = serializers.EventSerializer
    def get_queryset(self):
        user = self.request.user
        queryset = models.Event.objects.filter(person = user)
        return queryset

class CalendarEventsCreate(generics.CreateAPIView):
    serializer_class = serializers.CreateEventSerializer
    queryset = models.Calendar.objects.all()
