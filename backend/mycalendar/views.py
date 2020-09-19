from django.shortcuts import render
from . import models
from rest_framework import generics
from . import serializers
from django.db.models import Q

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

def filter(request):
    # Basically this is for filtering out the qs to get the info you want
    # You have to go back to this laster when you are doing a tiem range but
    # for now just the start time is ok.
    # The filter, just pick a field and filter by the value --> the double underscore are for
    # more shit
    qs = models.Event.objects.all()
    date_min = request.GET.get('date_min')
    date_max = request.GET.get('date_max')
    friend_query = request.GET.get('friend')
    person_query = request.GET.get('person')

    if is_valid_queryparam(date_min):
        qs = qs.filter(start_time__gte=date_min)
    if is_valid_queryparam(date_max):
        qs = qs.filter(start_time__lte= date_max)
    if is_valid_queryparam(friend_query) or is_valid_queryparam(person_query):
        qs = qs.filter(Q(person__username = friend_query) | Q(person__username = person_query))
    return qs

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


class GrabDayEvents(generics.ListAPIView):
    serializer_class = serializers.EventSerializer
    def get_queryset(self):
        user = self.request.user
        queryset = models.Event.objects.filter(person = user).order_by('start_time')
        return queryset

# This is to test if the filter works
class CalendarTestEventsView(generics.ListAPIView):
    serializer_class = serializers.EventSerializer

    def get_queryset(self):
        # The filter will be run through here so it willl
        # return a list of all the events
        qs = filter(self.request)
        return qs

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
