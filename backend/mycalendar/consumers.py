import json
from channels.generic.websocket import JsonWebsocketConsumer
from asgiref.sync import async_to_sync
from django.shortcuts import get_object_or_404
from channels.layers import get_channel_layer
from userprofile.models import User
from .models import Event
from .serializers import EventSerializer


class CalendarConsumer(JsonWebsocketConsumer):

    def add_sync_event(self, data):
        # this is there one where you make the event and then add it to the database
        # Then create a dictionary that you will then send to the frontend through an
        # event send fucntion
        # Then once you make it, you want to make a seperate function that will send out the
        # information
        currentUser = get_object_or_404(User, username = data['currentUser']);
        userFriend = get_object_or_404(User, username = data['userFriend']);
        start_time = data['startDate'];
        end_time = data['endDate']
        title = data['title'];
        content = data['content'];
        location = data['location'];
        person = [currentUser, userFriend];
        color = data['eventColor']
        newEvent = Event.objects.create(
            title = title,
            content = content,
            start_time = start_time,
            end_time = end_time,
            location = location,
            color = color
        )
        newEvent.person.set(person)
        serializer = EventSerializer(newEvent)
        content = {
            'command': 'new_event',
            'newEvent': serializer.data,
            # 'users': person,
        }
        return self.send_new_event(content)


# So you got done by making an object in the model, now you need to send
# it through the channel to both users

    def send_new_event(self,newEvent):
        channel_layer = get_channel_layer()
        content = {
            'type': 'new_event',
            'newEvent': newEvent
        }
        people = newEvent['newEvent']['person']
        for person in newEvent['newEvent']['person']:
            channel = 'calendar_'+person
            async_to_sync(self.channel_layer.group_send)(
                channel,
                content
            )

# When making a websocket you always start with connect
    def connect(self):
        self.current_user = self.scope['url_route']['kwargs']['username']
        grp = 'calendar_'+self.current_user
        async_to_sync(self.channel_layer.group_add)(grp, self.channel_name)
        self.accept()

    def disconnect(self, close_code):
        user = self.scope['user']
        self.current_user = self.scope['url_route']['kwargs']['username']
        grp = 'calendar_'+self.current_user
        async_to_sync (self.channel_layer.group_discard)(grp, self.channel_name)



    def receive(self, text_data=None, bytes_data=None, **kwargs):
        data = json.loads(text_data)
        if data['command'] == 'add_sync_event':
            self.add_sync_event(data)

    def new_event(self, event):
        newEvent = event['newEvent']
        print ('new_event')
        return self.send_json(newEvent)
