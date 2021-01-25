import json
from channels.generic.websocket import JsonWebsocketConsumer
from asgiref.sync import async_to_sync
from django.shortcuts import get_object_or_404
from channels.layers import get_channel_layer
from userprofile.models import User
from .models import Event
from .models import EventMessages
from .serializers import EventSerializer
from .serializers import EventMessagesSerializer
from userprofile.models import CustomNotification
from userprofile.serializers import NotificationSerializer
from userprofile import consumers
# from userprofile.serilaizers import FollowUserSerializer


class CalendarConsumer(JsonWebsocketConsumer):

    def add_share_sync_event(self, data):
        # CHECKED

        print(data)
        # THIS IS GONNA BE SIMILAR TO THE SHARED EVENT SO YOU GOTTA STRUCTURE YOUR
        # EVENT SYNC EVENT OBJECT TO BE THAT THE SAME AS THE SHARED EVENT

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
            curPerson = get_object_or_404(User, username = people)
            person.append(curPerson)

        invited = []
        for invites in data['invited']:
            invite = get_object_or_404(User, username = invites)
            invited.append(invite)


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
        newEvent.invited.set(invited)

        serializer = EventSerializer(newEvent)

        # For the notification you gonna need, the actor, reicipeint,
        # eventdate, eventHour, eventMin, and the event id

        # This for loop over here is used to over come the challenge of not being
        # able to pull the id for the notifcation. So for the initial share events
        # we will be using the calendereventweboscket to create the events notifcation
        for recipient in serializer.data['invited']:
            notification = CustomNotification.objects.create(
                type = "shared_event",
                actor = host,
                recipient = get_object_or_404(User, id = recipient['id']),
                verb = "shared an event at",
                minDate = start_time,
                eventId = newEvent.id
            )
            noti_serializer = NotificationSerializer(notification)
            content = {
                "command": "new_shared_event_notification",
                "notification": noti_serializer.data,
                "recipient": noti_serializer.data['recipient']
            }
            self.send_shared_event_notification(content)


        content = {
            'command': 'new_event',
            'newEvent': serializer.data,
            # 'users': person,
        }
        return self.send_new_event(content)

    def accept_shared_event(self, data):
        #CHECKED

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
        return self.send_accept_shared(content)



    def decline_shared_event(self, data):
        #CHECKED

        # This function is used to decline events, so what is gonna happen is that the
        # user will be removed from the list of persons
        sharedEvent = get_object_or_404(Event, id  = data['eventId'])
        declineUser = get_object_or_404(User, id = data['declineId'])

        sharedEvent.decline.add(declineUser)
        sharedEvent.person.remove(declineUser)
        sharedEvent.save()

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
            'declineUser': declineUser.id,
            'declineId': data['declineId']
        }

        content = {
            'command': 'add_decline',
            'eventId': data['eventId'],
            'declineUser': declineUser.id
        }

        self.send_decline_shared(content)
        self.send_decline_shared(contentElse)

    def delete_event(self, data):
        event = get_object_or_404(Event, id = data['eventId'])
        user = get_object_or_404(User, id = data['actor'])

        serializeEvent = EventSerializer(event)
        eventPerson = serializeEvent.data['person'].copy()

        if event.host == user:
            #CHECKED

            content = {
                'command': 'delete_event',
                'eventId': data['eventId'],
                'person': eventPerson
            }
            self.send_accept_shared(content)
            event.delete()
        else:
            # CHECKED

            # This one, instead of deleting the whole event, you are just removing
            # the person that removed the event that was not host
            event.person.remove(user)
            event.save()
            content = {
                'command': 'delete_event',
                'eventId': data['eventId'],
                'person': user.id,
                'personId': user.id

            }
            self.delete_single_event(content)



# So you got done by making an object in the model, now you need to send
# it through the channel to both users
    def delete_single_event(self, deletedEvent):
        # CHECKED

        # This is used to send out a dictionary with instructions to delete
        # the event for a users that are not the host
        channel_layer = get_channel_layer()
        content = {
            'type': 'new_event',
            'newEvent': deletedEvent
        }

        person = deletedEvent['person']
        channel = 'calendar_'+str(person)
        async_to_sync(self.channel_layer.group_send)(
            channel,
            content
        )

    def send_new_event(self,newEvent):
        # CHECKED

        # Also gotta change the for loop here because now its pulling the whole object
        channel_layer = get_channel_layer()
        content = {
            'type': 'new_event',
            'newEvent': newEvent
        }
        people = newEvent['newEvent']['person']
        for person in newEvent['newEvent']['person']:
            # Maybe gotta change this if it poses any problems
            channel = 'calendar_'+str(person['id'])
            async_to_sync(self.channel_layer.group_send)(
                channel,
                content
            )

    def send_shared_event_notification(self, newNoti):
        # This is used to send the new shared notificaiton to the frontend
        channel_layer = get_channel_layer()
        content = {
            "type": "new_noti",
            "newNoti": newNoti
        }
        channel = 'calendar_'+str(newNoti['recipient'])
        async_to_sync(self.channel_layer.group_send)(
            channel,
            content
        )


    def send_accept_shared(self, acceptedUser):
        # CHECKED

        # This send is pretty much the same as the send_new_evnet but it is used
        # in conjuntion with the accept_shared_event so that it can send it to everyone
        # and know who has accepted the event
        channel_layer = get_channel_layer()
        content = {
            'type': 'accepted_share',
            'acceptedUser': acceptedUser
        }
        people = acceptedUser['person'] #This is a list of objects
        for person in people:
            channel = 'calendar_'+str(person['id'])
            async_to_sync(self.channel_layer.group_send)(
                channel,
                content
            )

    def send_decline_shared(self, declinedUser):
        # CHECKED

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
                channel = 'calendar_'+str(person['id'])
                async_to_sync(self.channel_layer.group_send)(
                    channel,
                    content
                )
        elif(declinedUser['command'] == 'add_decline'):
            declineChannel = 'calendar_'+str(declinedUser['declineUser'])
            async_to_sync(self.channel_layer.group_send)(
                declineChannel,
                content
            )



# When making a websocket you always start with connect
    def connect(self):
        self.current_user = self.scope['url_route']['kwargs']['userId']
        grp = 'calendar_'+self.current_user
        async_to_sync(self.channel_layer.group_add)(grp, self.channel_name)
        self.accept()

    def disconnect(self, close_code):
        user = self.scope['user']
        self.current_user = self.scope['url_route']['kwargs']['userId']
        grp = 'calendar_'+self.current_user
        async_to_sync (self.channel_layer.group_discard)(grp, self.channel_name)



    def receive(self, text_data=None, bytes_data=None, **kwargs):
        data = json.loads(text_data)
        if data['command'] == 'add_sync_event':
            # XXX NOT CHECKED
            self.add_share_sync_event(data)
        if data['command'] == 'add_shared_event':
            #CHECK
            self.add_share_sync_event(data)
        if data['command'] == 'send_accept_shared_event':
            #CHECK
            self.accept_shared_event(data)
        if data['command'] == 'send_decline_shared_event':
            #CHECKED
            self.decline_shared_event(data)
        if data['command'] == 'delete_event':
            #CHECKED
            self.delete_event(data)

    def new_event(self, event):
        newEvent = event['newEvent']
        return self.send_json(newEvent)

    def accepted_share(self, event):
        acceptedUser = event['acceptedUser']
        return self.send_json(acceptedUser)

    def declined_share(self, event):
        declinedUser = event['declinedUser']
        return self.send_json(declinedUser)

    def new_noti(self, noti):
        newNoti = noti['newNoti']
        return self.send_json(newNoti)


class EventPageConsumer (JsonWebsocketConsumer):
    def send_fetch_event_messages(self, data):
        # This will be run at the start of every time you go into the event page
        # so that you have the information already set up

        viewEvent = get_object_or_404(Event, id = data['eventId'])
        serializer = EventSerializer(viewEvent).data
        content = {
            'command': 'fetch_event_info',
            'eventInfo': serializer
        }
        self.send_json(content)


    def send_event_message(self, data):
        viewEvent = get_object_or_404(Event, id = data['eventId'])
        user = get_object_or_404(User, id = data['userId'])


        eventMessage, created = EventMessages.objects.get_or_create(
            eventObj = viewEvent,
            body = data['message'],
            messageUser = user
        )

        viewEvent.seen.clear()
        viewEvent.seen.add(user)

        eventSeen = EventSerializer(viewEvent).data['seen']

        eventMessageObj = EventMessagesSerializer(eventMessage, many = False).data

        content = {
            'command': 'send_event_message',
            'eventMessageObj': eventMessageObj,
            'eventObjId': data['eventId'],
            'eventSeenObj': eventSeen
        }
        self.send_message(content)

    def send_seen_event(self, data):
        # This function will grab the user and the event and add the user to the
        # seen field of the event
        viewEvent = get_object_or_404(Event, id = data['eventId'])
        user = get_object_or_404(User, id = data['userId'])

        viewEvent.seen.add(user)

        eventSeen = EventSerializer(viewEvent).data['seen']

        content = {
            'command': 'send_seen_event',
            'eventSeenObj': eventSeen,
            'eventObjId':data['eventId']
        }
        self.send_message(content)

    def send_edit_event_info(self, data):
        eventEdit = get_object_or_404(Event, id = data['editEventObj']['eventId'])

        personList = []
        for people in data['editEventObj']['person']:
            person = get_object_or_404(User, username = people)
            personList.append(person)

        inviteList = []
        for invites in data['editEventObj']['invited']:
            invite = get_object_or_404(User, username = invites)
            inviteList.append(invite)


        # You cannot update many to many field objects in the update, you have to
        # do it manually out side of it
        # Event.objects.filter(id = data['editEventObj']['eventId']).update(
        #     title= data['editEventObj']['title'],
        #     content= data['editEventObj']['content'],
        #     start_time= data['editEventObj']['startDate'],
        #     end_time= data['editEventObj']['endDate'],
        #     location= data['editEventObj']['location'],
        #     color= data['editEventObj']['eventColor'],
        #     repeatCondition= data['editEventObj']['repeatCondition'],
        # )


        eventEdit.title = data['editEventObj']['title']
        eventEdit.content = data['editEventObj']['content']
        eventEdit.start_time = data['editEventObj']['startDate']
        eventEdit.end_time = data['editEventObj']['endDate']
        eventEdit.location = data['editEventObj']['location']
        eventEdit.color = data['editEventObj']['eventColor']
        eventEdit.repeatCondition = data['editEventObj']['repeatCondition']


        eventEdit.person.set(personList)
        eventEdit.invited.set(inviteList)
        eventEdit.save()
        # CONTINUE HERE FOR THE CHANNELS, JUST CHANGING THE EVENT PAGE
        # BECAUSE YOU ARE JUST GOING BACK TO THE EVENT PAGE
        updatedEvent = get_object_or_404(Event, id = data['editEventObj']['eventId'])
        serializer = EventSerializer(updatedEvent)
        content  = {
            "command": "edited_event",
            "editedEvent": serializer.data,
            "eventObjId": data['editEventObj']['eventId']
        }
        self.send_message(content)

    def send_message(self, eventMessage):
        # This will be the go between for sending events... so when you send an event
        # this will locate the right group and then sent it to that group channel
        channel_layer = get_channel_layer()
        channel_recipient = eventMessage['eventObjId']
        channel = 'event_'+str(channel_recipient)


        async_to_sync(self.channel_layer.group_send)(
            channel,
            {
                'type': 'new_message',
                'eventMessage': eventMessage
            }
        )

    def connect (self):
        # self.scope will pull stuff from channel instance, the url_route kwargs will
        # pull the eventId
        self.selected_event = self.scope['url_route']['kwargs']['eventId']
        # After getting the eventId, now you will then make the name of the group
        grp = 'event_'+self.selected_event
        # Once you get the name of group then you will will create the channel group
        async_to_sync(self.channel_layer.group_add)(grp, self.channel_name)
        self.accept()

    def disconnect(self, close_code):
        # Pretty much the same as the connect function but instaed of group add
        # it is group discard
        self.selected_event = self.scope['url_route']['kwargs']['eventId']
        grp = 'event_'+self.selected_event
        async_to_sync(self.channel_layer.group_discard)(grp, self.channel_name)


    def receive(self, text_data= None, bytes_data = None, **kwargs):
        data = json.loads(text_data)
        if data['command'] == 'fetch_event_messages':
            self.send_fetch_event_messages(data)
        if data['command'] == 'send_event_message':
            self.send_event_message(data)
        if data['command'] == "send_edit_event_info":
            self.send_edit_event_info(data);
        if data['command'] == 'send_seen_event':
            self.send_seen_event(data);

    def new_message(self, message):
        messageObj = message['eventMessage']
        return self.send_json(messageObj)
