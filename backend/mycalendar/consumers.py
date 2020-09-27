import json
from channels.generic.websocket import JsonWebsocketConsumer
from asgiref.sync import async_to_sync
from django.shortcuts import get_object_or_404
from channels.layers import get_channel_layer
from userprofile.models import User
from .models import Event
from .serializers import EventSerializer
# from userprofile.serilaizers import FollowUserSerializer


class CalendarConsumer(JsonWebsocketConsumer):

    def add_share_sync_event(self, data):
        # this is there one where you make the event and then add it to the database
        # Then create a dictionary that you will then send to the frontend through an
        # event send fucntion
        # Then once you make it, you want to make a seperate function that will send out the
        # information

        # Since creating a shared event is pretty much the same process whether or not you
        # are sharing to one person or to many poeple it will still be the sameself.
        # So the way you are gonna go about this is that you are gonna get the person
        # list of ids and then you are gonna loop through those ids and then append them
        # to a list and then add that to the event object. You are gonna do the same for
        # when you are adding an event sync (MAKE SURE TO TAKE CARE OF THAT WHEN YOU ARE
        # ADDING AN EVENT SYNC, JUST ADD BOTH THE FRIEND AND YOU TO THE PERSON LIST SHOULD
        # BE OK) also make sure its in ID as well because maybe people have similar
        # username
        person = [];

        for people in data['person']:
            curPerson = get_object_or_404(User, username = people);
            person.append(curPerson)

        # currentUser = get_object_or_404(User, username = data['currentUser']);
        # userFriend = get_object_or_404(User, username = data['userFriend']);
        start_time = data['startDate'];
        end_time = data['endDate']
        title = data['title'];
        content = data['content'];
        location = data['location'];
        host = get_object_or_404(User, id = data['host']);
        # person = [currentUser, userFriend];
        accepted = [host];
        color = data['eventColor'];
        repeatCondition = data['repeatCondition'];
        newEvent = Event.objects.create(
            title = title,
            content = content,
            start_time = start_time,
            end_time = end_time,
            location = location,
            color = color,
            repeatCondition = repeatCondition,
            host = host,
        )
        newEvent.person.set(person)
        newEvent.accepted.set(accepted)

        serializer = EventSerializer(newEvent)
        content = {
            'command': 'new_event',
            'newEvent': serializer.data,
            # 'users': person,
        }
        print(content)
        return self.send_new_event(content)

    def accept_shared_event(self, data):
        # This function is pretty much used to just add in the accepted user into
        # the accepted list, so you just gonna add the person in then send it out to
        # everyone so then it can be added into everyone's redux
        sharedEvent = get_object_or_404(Event, id = data['eventId'])
        acceptedUser = get_object_or_404(User, id = data['acceptorId'] )

        sharedEvent.accepted.add(acceptedUser)

        serializer = EventSerializer(sharedEvent)

        person = serializer.data['person']

        content = {
            'command': 'add_accepted',
            'person': person,
            'eventId': data['eventId'],
            'acceptedUser': data['acceptorId']
        }
        print(content)
        return self.send_accept_shared(content)


        print(sharedEvent)

    def decline_shared_event(self, data):
        # This function is used to decline events, so what is gonna happen is that the
        # user will be removed from the list of persons
        sharedEvent = get_object_or_404(Event, id  = data['eventId'])
        declineUser = get_object_or_404(User, id = data['declineId'])


        sharedEvent.person.remove(declineUser)
        sharedEvent.save()

        print(declineUser.username)
        serializer = EventSerializer(sharedEvent)
        # userSerializer = PersonSerializer(declineUser).data
        person = serializer.data['person']

        # Two content, one for everyone else and one for the person that decline,
        # The reason I am making this difference is because for the person taht decline
        # we hvae to delete the event entirely from the redux and for everyone else
        # you just have to remvoe the decline person from the person list


        # This one is going out to everyone else
        contentElse = {
            'command': 'add_decline_else',
            'person': person,
            'eventId': data['eventId'],
            'declineUser': declineUser.username,
            'declineId': data['declineId']
        }

        content = {
            'command': 'add_decline',
            'eventId': data['eventId'],
            'declineUser': declineUser.username
        }

        self.send_decline_shared(content)
        self.send_decline_shared(contentElse)

# So you got done by making an object in the model, now you need to send
# it through the channel to both users

    def send_new_event(self,newEvent):
        # Also gotta change the for loop here because now its pulling the whole object
        channel_layer = get_channel_layer()
        content = {
            'type': 'new_event',
            'newEvent': newEvent
        }
        people = newEvent['newEvent']['person']
        for person in newEvent['newEvent']['person']:
            # Maybe gotta change this if it poses any problems
            channel = 'calendar_'+person['username']
            async_to_sync(self.channel_layer.group_send)(
                channel,
                content
            )


    def send_accept_shared(self, acceptedUser):
        # This send is pretty much the same as the send_new_evnet but it is used
        # in conjuntion with the accept_shared_event so that it can send it to everyone
        # and know who has accepted the event
        channel_layer = get_channel_layer()
        content = {
            'type': 'accepted_share',
            'acceptedUser': acceptedUser
        }
        people = acceptedUser['person']
        for person in people:
            channel = 'calendar_'+person['username']
            async_to_sync(self.channel_layer.group_send)(
                channel,
                content
            )

    def send_decline_shared(self, declinedUser):
        # similar to the send_accept_share but with an extra channel send because
        # the person list does not include the person declining the event
        channel_layer = get_channel_layer()
        content = {
            'type': 'declined_share',
            'declinedUser': declinedUser
        }
        if (declinedUser['command'] == 'add_decline_else'):
            people = declinedUser['person']
            for person in people:
                channel = 'calendar_'+person['username']
                async_to_sync(self.channel_layer.group_send)(
                    channel,
                    content
                )
        elif(declinedUser['command'] == 'add_decline'):
            declineChannel = 'calendar_'+declinedUser['declineUser']
            async_to_sync(self.channel_layer.group_send)(
                declineChannel,
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
        print(data)
        if data['command'] == 'add_sync_event':
            self.add_share_sync_event(data)
        if data['command'] == 'add_shared_event':
            self.add_share_sync_event(data)
        if data['command'] == 'send_accept_shared_event':
            self.accept_shared_event(data)
        if data['command'] == 'send_decline_shared_event':
            self.decline_shared_event(data)

    def new_event(self, event):
        newEvent = event['newEvent']
        print ('new_event')
        return self.send_json(newEvent)

    def accepted_share(self, event):
        acceptedUser = event['acceptedUser']
        return self.send_json(acceptedUser)

    def declined_share(self, event):
        declinedUser = event['declinedUser']
        return self.send_json(declinedUser)
