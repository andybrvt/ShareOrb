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


# So baiscally when filtering out data, in the url you can do a param (Example:
#  url/?q=something) and then from there you can do a request.GET.get that param
# that param cna be passed in from the axios.GET, by adding it in like the post but instead
# you put it in a param --> from there you can filter out the stuff and info accordingling
def is_valid_queryparam(param):
    # This is basically use to see if the param you put in is existing or not and you
    # will use this for the if statement later for the filter
    return param != '' and param is not None

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
        queryset = models.Event.objects.filter(person = user).order_by('start_time')
        return queryset

class CalendarTestEventsView(generics.ListAPIView):
    serializer_class = serializers.EventSerializer
    queryset = models.Event.objects.all()

class CalendarEventsCreate(generics.CreateAPIView):
    serializer_class = serializers.CreateEventSerializer
    queryset = models.Event.objects.all()

class CalendarEventUpdate(generics.RetrieveUpdateAPIView):
    serializer_class = serializers.UpdateEventSerialzier
    lookup_field = 'id'
    queryset = models.Event.objects.all()

class CalendarEventDelete(generics.RetrieveDestroyAPIView):
    serializer_class = serializers.DeleteEventSerializer
    lookup_field = 'id'
    queryset = models.Event.objects.all()
