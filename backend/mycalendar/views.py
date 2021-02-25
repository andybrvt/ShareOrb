from django.shortcuts import render
from . import models
from rest_framework import generics
from . import serializers
from django.db.models import Q
from django.utils import timezone
import datetime
import pytz

from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import render, get_object_or_404
from userprofile.models import User
from mySocialCal.models import SocialCalEvent

# Create your views here.
# def get_calendar(request):
#     all_events = Events.objects.all()
#     content = {
#         'event': all_events,
#     }
#
#     return

# This is for event sync btw


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
    # This function will grab all the users events so that it can be used
    # inside the personal calendar
    serializer_class = serializers.EventSerializer
    def get_queryset(self):
        user = self.request.user
        queryset = models.Event.objects.filter(person = user).order_by('start_time')
        return queryset

class CalendarCurEventView(generics.ListAPIView):
    # This function will grab all the users event that are current or future
    # so that it cna be used to share with others or invite others
    serializer_class = serializers.MiniEventSerializer
    def get_queryset(self):
        user = self.request.user
        queryset = models.Event.objects.filter(person = user).filter(start_time__gte =datetime.date.today()).order_by('start_time')
        return queryset

class ShareEventInChatsView(APIView):
    # This function will share event with everyone in chat that is shared

    # Make sure  add people to invite list here
    def post(self, request, *args, **kwargs):

        print(request.data)
        # First you will get the chat
        sharedChat = get_object_or_404(models.Event, id = request.data['eventId'])
        for users in request.data['participants']:
            print(users)
            user = get_object_or_404(User, id = users);
            sharedChat.person.add(user)
            sharedChat.invited.add(user)

        curUser = get_object_or_404(User, id = request.data['curId'])

        eventList = models.Event.objects.filter(host = curUser).filter(start_time__gte = datetime.date.today()).order_by('start_time')

        serializedEventList = serializers.MiniEventSerializer(eventList, many= True).data
        return Response(serializedEventList)

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


class CreateSharedEventView(APIView):
    # This function will be in charge of creating the shared event in the chats
    # This will take in an event object and list of participants and then create
    # a shared event
    # You will need the current user to get the host

    def post(self, request, *args, **kwargs):
        print(request.data)

        data = request.data
        # First get the user object
        host = get_object_or_404(User, id = data['curId'])

        # Now you can start creatign the event
        sharedEvent = models.Event.objects.create(
            title = data['eventObj']['title'],
            content = data['eventObj']['content'],
            repeatCondition = data['eventObj']['repeatCondition'],
            start_time = data['eventObj']['start_time'],
            end_time = data['eventObj']['end_time'],
            location = data['eventObj']['location'],
            color = data['eventObj']['eventColor'],
            host = host
        )
        # add the host to the person list
        sharedEvent.person.add(host)
        sharedEvent.accepted.add(host)
        for participant in data['participants']:
            user = get_object_or_404(User, id = participant)
            # add each participant to the person list as well
            sharedEvent.person.add(user)
            # then add them to hte invite list for later use
            sharedEvent.invited.add(user)

        # Since you are doing it in chat you do not need to return it, you just
        # have to return the users list so that you can update the eventList

        eventList = models.Event.objects.filter(host = host).filter(start_time__gte = datetime.date.today()).order_by('start_time')

        serializedEventList = serializers.MiniEventSerializer(eventList, many= True).data

        return Response(serializedEventList)

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

class EventBackgroundUpdate(generics.RetrieveUpdateAPIView):
    serializer_class = serializers.EventBackgroundSerializer
    lookup_field = "id"
    queryset = models.Event.objects.all()

class CreateSocialPersonalCalEvent(APIView):
    # This function will be used to create a social event type
    # on the personal calendar
    def post(self, request, *args, **kwargs):
        print(request.data)
        # Now grab the social cal event here given the id
        socialCalEvent = get_object_or_404(SocialCalEvent, id = request.data['socialEventId'])

        # Now grab the current user
        curUser = get_object_or_404(User, id = request.data['userId'])

        # Now you have both the even and the curUser, now you will make the event

        # So for the events, they are filtered and added to the calendar
        # by the person list and the host will be that of the social event

        print(socialCalEvent.start_time)
        print(socialCalEvent.end_time)
        print(socialCalEvent.event_day)

        eventDate = socialCalEvent.event_day

        startHour = socialCalEvent.start_time
        endHour = socialCalEvent.end_time

        # startHourAdd = datetime.timedelta(hour = startHour)
        # endHourAdd = datetime.timedelta(hour = endHour)

        startDateTime = datetime.datetime.combine(eventDate, startHour)
        endDateTime = datetime.datetime.combine(eventDate, endHour)
        print(startDateTime)
        print(endDateTime)



        newEvent = models.Event.objects.create(
            host = socialCalEvent.host,
            title = socialCalEvent.title,
            content = socialCalEvent.content,
            location = socialCalEvent.location,
            start_time = startDateTime,
            end_time = endDateTime,
            color = "#1E90FF",
            repeatCondition = "none",
            type = "social",
            socialId = request.data['socialEventId']
        )
        newEvent.seen.add(curUser)
        newEvent.person.add(curUser)

        newEvent.save()




        return Response("some stuff")
