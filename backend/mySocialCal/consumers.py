import json
from channels.generic.websocket import JsonWebsocketConsumer
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from userprofile.models import User
from django.shortcuts import get_object_or_404
from .models import SocialCalEvent
from .models import SocialEventMessages
from .models import SocialCalCell
from .models import SocialCalComment
from .models import SocialCalItems
from .models import SocialCellEventPost
from .models import SocialCalItemComment
from userprofile.models import CustomNotification
from .serializers import SocialCalUserSerializer
from .serializers import SocialCalCellSerializer
from .serializers import SocialCalEventSerializer
from .serializers import SocialEventMessagesSerializer
from .serializers import SocialCalCommentSerializer
from .serializers import SocialCellEventSerializer
from .serializers import SocialCalItemsSerializer
from .serializers import SocialItemCommentSerializer
import datetime
from django.utils import timezone
import pytz



# This consumer is mostly used for managing the social events ie
# soical event page. Where as the other cosnumer that is in the
# userprofile is more for managing stuff in the profile, and since
# the socialcal is in the userprofile is part of that but for the event
# page, it is seperate so it gets it own serializer

class SocialCalandarConsumer(JsonWebsocketConsumer):

    def send_fetch_social_event_messages(self,data):
    # This will grab the information of the event
        viewSocialEvent = get_object_or_404(SocialCalEvent, id = data['socialEventId'])
        serializer = SocialCalEventSerializer(viewSocialEvent).data
        content = {
            "command": "fetch_social_event_info",
            "eventInfo": serializer
        }
        self.send_json(content)

    def send_social_event_message(self, data):
        # This will create the message object and then make a foreign key to the
        # correct event
        viewSocialEvent = get_object_or_404(SocialCalEvent, id = data['socialEventId'])
        user = get_object_or_404(User, id = data['userId'])

        # This will create the message
        socialEventMessage, created = SocialEventMessages.objects.get_or_create(
            eventObj = viewSocialEvent,
            body = data['message'],
            messageUser = user
        )

        # Now you will have to serialize the data

        serializer = SocialEventMessagesSerializer(socialEventMessage).data
        content = {
            "command": "send_social_event_message",
            "socialEventMessgaeObj": serializer,
            "socialEventId": data['socialEventId']
        }
        self.send_social_message(content)


    def send_social_edit_event_info(self, data):
        eventEdit = get_object_or_404(SocialCalEvent, id = data['editSocialEventObj']['eventId'])
        eventEdit.title = data['editSocialEventObj']['title']
        eventEdit.content = data['editSocialEventObj']['content']
        eventEdit.start_time = data['editSocialEventObj']['start_time']
        eventEdit.end_time = data['editSocialEventObj']['end_time']
        eventEdit.location = data['editSocialEventObj']['location']
        eventEdit.event_day = data['editSocialEventObj']['event_day']

        # Now that you updated the information grab the user and you have the date
        # now you just need to grab the social cal cell and then

        # now grab the user information
        userObj = get_object_or_404(User, id = data['userId'])

        socialCell, create = SocialCalCell.objects.get_or_create(
            socialCalUser = userObj,
            socialCaldate = data['editSocialEventObj']['event_day']
        )

        eventEdit.calCell = socialCell;

        eventEdit.save()


        # Now you have to get the right soical cal celll and then change the
        # ForeignKey of the event to make sure the event falls into the right
        # social cal cell



        updatedEvent = get_object_or_404(SocialCalEvent, id = data['editSocialEventObj']['eventId'])
        serializer = SocialCalEventSerializer(updatedEvent)

        content = {
            "command": "edited_social_event",
            "editedSocialEvent": serializer.data,
            "socialEventId": data['editSocialEventObj']['eventId']
        }
        self.send_social_message(content)

    def send_social_event_delete(self, data):
        selectedEvent = get_object_or_404(SocialCalEvent, id = data['eventId'])
        serializer = SocialCalEventSerializer(selectedEvent).data
        personList = serializer['persons'].copy()
        personList.remove(serializer['host'])
        selectedEvent.delete();

        content = {
            "command": "delete_social_eventNotification",
            "socialEventId": data['eventId']
        }
        self.send_social_message(content)

    def send_social_event_invite(self, data):
        # This will just be used to invite friends to your event
        # You will first grab the user
        # Then grab the social event
        # Then add that person to the event and then it send it back into the front
        # end

        selectedEvent = get_object_or_404(SocialCalEvent, id = data['eventId'])
        addedUser = get_object_or_404(User, id = data['userId'] )

        # Now add the user to the invite list
        selectedEvent.inviteList.add(addedUser)
        # The selected event should be updated now
        # Now you will serialize the event and then return it to the front end

        selectedEvent.save()

        serializedEvent = SocialCalEventSerializer(selectedEvent, many = False).data


        # Now you just have to return the invite list
        content = {
            "command": 'send_social_event_invite',
            "inviteList": serializedEvent['inviteList'],
            "socialEventId": data['eventId']
        }

        self.send_social_message(content)

    def send_social_event_going(self, data):
        # This function will pretty much remove someone from the invite
        # list and then add them to the person list

        # first grab the event
        selectedEvent = get_object_or_404(SocialCalEvent, id = data['eventId'])

        # Then grab the user
        goingUser = get_object_or_404(User, id = data['userId'])

        # So you wnat to remove that person from the invite list and then
        # add them to the person list
        selectedEvent.inviteList.remove(goingUser)
        selectedEvent.notGoingList.remove(goingUser)
        # Then add them to person
        selectedEvent.persons.add(goingUser)
        selectedEvent.save()

        serializedEvent = SocialCalEventSerializer(selectedEvent, many = False).data

        content = {
            "command": "send_social_event_going",
            "socialEvent": serializedEvent,
            "socialEventId": data['eventId']
        }

        self.send_social_message(content)

    def send_social_event_not_going(self, data):
        # This will just remove the user from the invite list and then add them
        # to the notGoingList


        selectedEvent = get_object_or_404(SocialCalEvent, id = data['eventId'])
        notGoingUser = get_object_or_404(User, id = data['userId'])


        # Now remove the person from the person and invite list and add them
        # to the notGoingList
        selectedEvent.inviteList.remove(notGoingUser)
        selectedEvent.persons.remove(notGoingUser)

        selectedEvent.notGoingList.add(notGoingUser)

        selectedEvent.save()

        serializedEvent = SocialCalEventSerializer(selectedEvent, many = False).data

        # It uses teh same redux so no need to make a new one
        content = {
            'command': "send_social_event_going",
            "socialEvent": serializedEvent,
            "socialEventId":data['eventId']
        }

        self.send_social_message(content)

    def send_social_message(self, socialEventMessage):
        # This will be for sending inforamtion inot the channel layer to the groups
        channel_layer = get_channel_layer()
        channel_recipient = socialEventMessage['socialEventId']
        channel = 'socialEvent_'+str(channel_recipient)

        async_to_sync(self.channel_layer.group_send)(
            channel,
            {
                'type': 'new_social_message',
                'eventMessage': socialEventMessage
            }
        )

    def connect(self):
        # self.scope will pull stuff from the channel instance, the url kwargs is
        # to specific info off the channel urls
        self.selected_event = self.scope['url_route']['kwargs']['socialEventId']
        grp = 'socialEvent_'+self.selected_event
        async_to_sync(self.channel_layer.group_add)(grp, self.channel_name)
        self.accept()

    def disconnect(self, close_code):
        # Pretty much the same as cnnnect but now you are disconnecting
        self.selected_event = self.scope['url_route']['kwargs']['socialEventId']
        grp = 'socialEvent_'+self.selected_event
        async_to_sync(self.channel_layer.group_discard)(grp, self.channel_name)

    def receive(self, text_data= None, bytes_data = None, **kwargs):

        data = json.loads(text_data)
        if data["command"] == "fetch_social_event_messages":
            self.send_fetch_social_event_messages(data);
        if data["command"] == "send_social_event_message":
            self.send_social_event_message(data)
        if data["command"] == "send_social_edit_event_info":
            self.send_social_edit_event_info(data)
        if data["command"] == "send_social_event_delete":
            self.send_social_event_delete(data)
        if data['command'] == "send_social_event_invite":
            self.send_social_event_invite(data)
        if data['command'] == "send_social_event_going":
            self.send_social_event_going(data)
        if data['command'] == "send_social_event_not_going":
            self.send_social_event_not_going(data)

    def new_social_message(self, message):
        messageObj = message['eventMessage']
        return self.send_json(messageObj)



class SocialCalCellConsumer(JsonWebsocketConsumer):
    # This is for the specific cells when you open them up, it will connect to
    # its own cell

    def send_social_cal_cell_comment_like_unlike(self, data):
        socialCell=get_object_or_404(SocialCalCell, id= data['socialCalCellID'])
        personComment=get_object_or_404(SocialCalComment,id=data['commentID'])
        personLiking = get_object_or_404(User, id = data['personIDLike'])
        if  personComment.comment_people_like.filter(id=data['personIDLike']).exists():
            personComment.comment_like_count-=1
            personComment.comment_people_like.remove(personLiking)
        else:
            personComment.comment_like_count+=1
            personComment.comment_people_like.add(personLiking)
        personComment.save()

        dateList = data['socialCalCellDate'].split("-")
        username = personLiking.username

        socialCalCommentObj = SocialCalCommentSerializer(personComment).data
        recipient = username+"_"+dateList[0]+"_"+dateList[1]+"_"+dateList[2]

        content = {
            'command': 'send_social_cal_cell_comment_like_unlike',
            'socialCalComment': socialCalCommentObj,
            'recipient': recipient
        }
        self.send_info_cal_cell(content)




    def send_fetch_social_cal_cell_info(self, data):
        # This will fetch the information of the cal cell page. It will use
        # the user name and date to filter that event. if there is no event
        # you will just return the user object so that it will fill up the page
        # but no event (hopefully if you filter and it is not there it will be empty)

        user = get_object_or_404(User, username = data['cellUser'])
        socialCell = SocialCalCell.objects.filter(
            socialCalUser = user,
            socialCaldate = data['cellDate']
        )

        if socialCell:
            # When the social cal cell does exist
            serializerCell = SocialCalCellSerializer(socialCell[0]).data
            content = {
                'command': 'fetch_social_cal_cell_info',
                'socialCalCell': serializerCell
            }
            self.send_json(content)
        else:
            # When the social cal cell does not exist
            serializerUser = SocialCalUserSerializer(user).data
            content = {
                'command': 'fetch_social_cal_cell_info',
                'socialCalCell': {'socialCalUser':serializerUser}
            }
            self.send_json(content)


    def send_social_cal_cell_like(self, data):
        # This will pretty much create a social cell object if it is not already
        # created and then add a like to itself.

        # So you will used get_or_create and then pass it it redux to the event page

        #  personLIke and cellowner will be in id form
        personLike = get_object_or_404(User, id = data['personLike'])
        calOwner = get_object_or_404(User, id = data['cellOwner'])

        # So to save one space and such, you only want to create a social cal cell object
        # when there is a like or commment, pics or events. this si where get_or create comes in
        # handy
        socialCell, created = SocialCalCell.objects.get_or_create(
            socialCalUser = calOwner,
            socialCaldate = data['cellDate']
        )

        socialCell.people_like.add(personLike)
        # socialCell.save()

        socialCalCellObj = SocialCalCellSerializer(socialCell).data

        # Unlike the older like, we will remove the testdate bc it will have
        # conflict in creating the object

        # When sending out the content you have to split it up so that it matches
        # the right websocket that you are sending it to

        # The format --> socialCalCell_username_year_month_day

        dateList = data['cellDate'].split("-")
        username = calOwner.username


        # You will use recipient to attach the group name
        recipient = username+"_"+dateList[0]+"_"+dateList[1]+"_"+dateList[2]

        # So you have to take into consideration when you are creating a new
        # event becuase this will mess up the comments
        if created == False:
            content = {
                'command': 'send_social_cal_cell_like_unlike',
                'likeList': socialCalCellObj['people_like'],
                'recipient': recipient
            }
        elif created == True:
            # This if the new cell is made you will jsut send the whole
            # social cal
            content = {
                'command': 'fetch_social_cal_cell_info',
                'socialCalCell': socialCalCellObj,
                'recipient': recipient
        }


        self.send_info_cal_cell(content)

    def send_social_cal_cell_unlike(self, data):
        # This is pretty much simialr to the social cal cell like but you just
        # remove the user from the like list
        personUnlike = get_object_or_404(User, id = data['personUnlike'])
        calOwner = get_object_or_404(User, id = data['cellOwner'])


        # Since in order to unlike something you have to already have liked it
        # so that means the object is already created. So to avoid errors. I will
        # not do a get or create... maybe do a get_object_or_404

        socialCell = get_object_or_404(SocialCalCell,
            socialCalUser = calOwner,
            socialCaldate = data['cellDate']
        )

        socialCell.people_like.remove(personUnlike)
        # socialCell.save()

        socialCalCellObj = SocialCalCellSerializer(socialCell).data

        # Now we will create the tag name for the channel group
        dateList = data['cellDate'].split("-")
        username = calOwner.username

        # You will the use the recipient to attach to the group name
        recipient = username+"_"+dateList[0]+"_"+dateList[1]+"_"+dateList[2]

        content = {
            'command': 'send_social_cal_cell_like_unlike',
            'likeList': socialCalCellObj['people_like'],
            'recipient': recipient
        }

        self.send_info_cal_cell(content)

    def send_social_cal_cell_comment(self, data):
        # This will make teh social comment objects
        # You will get_or_create on this one because you can have a chance of
        # making a soical cal cell
        personComment = get_object_or_404(User, id = data['personComment'])
        calOwner = get_object_or_404(User, id = data['cellOwner'])

        # First you will create or get the cell
        socialCell, created = SocialCalCell.objects.get_or_create(
            socialCalUser = calOwner,
            socialCaldate = data['cellDate']
        )

        # Unlike the likin gyou do not need to add stuff into the object but rather
        # you will create the social comment
        socialComment = SocialCalComment.objects.create(
            calCell = socialCell,
            body = data['comment'],
            commentUser = personComment
        )

        # Now you will serialize teh comment and then you can just send it
        # You probally don't need to send the whole cell because you just
        # gotta replace teh get_comments

        socialCalCellComment = SocialCalCommentSerializer(socialComment).data
        socialCalCellComments = SocialCalCellSerializer(socialCell).data

        # Now we will create the tag name for the channel group
        dateList = data['cellDate'].split("-")
        username = calOwner.username

        # You will the use the recipient to attach to the group name
        recipient = username+"_"+dateList[0]+"_"+dateList[1]+"_"+dateList[2]
        if created == False:
            content = {
                'command': 'send_social_cal_cell_comment',
                'socialComment': socialCalCellComment,
                'recipient': recipient
            }
        elif created == True:
            # Created when you first make a cell object, helps prevent sending
            # all the comments everytime to the front end
            content = {
                'command': 'fetch_social_cal_cell_info',
                'socialCalCell': socialCalCellComments,
                'recipient': recipient
            }


        self.send_info_cal_cell(content)

    def send_social_day_caption(self, data):
        # This function is used create the caption for the day. It will be somewhat
        # simlar to the send social cal cell comment

        # You will first first get the calOwner. Then you will get or create
        # the social cal cell

        calOwner = get_object_or_404(User, id = data['cellOwner'])


        # First you will get or create the cell
        socialCell, created = SocialCalCell.objects.get_or_create(
            socialCalUser = calOwner,
            socialCaldate = data['cellDate']
        )

        if(created == False):
            socialCell.actionText = "updated"

        # So since we are just updating the day caption, we will just update
        # it here
        socialCell.dayCaption = data['dayCaption']

        # SAVED SPOT
        socialCell.save()


        socialUpdatedCell = SocialCalCellSerializer(socialCell).data



        dateList = data['cellDate'].split("-")
        username = calOwner.username

        recipient = username+"_"+dateList[0]+"_"+dateList[1]+"_"+dateList[2]

        content = {
            'command': "send_social_day_caption",
            'dayCaption': socialUpdatedCell['dayCaption'],
            'recipient': recipient
        }

        self.send_info_cal_cell(content)

    def add_user_social_event_M(self, data):
        # userId: userId,
        # socialEventId: socialEventId,
        # socialCalCellId: socialCalCellId

        # similar to the one in the explore page
        # when you are joining an event, the event itself must exist already
        user = get_object_or_404(User, id = data['userId'])
        curSocialEvent = get_object_or_404(SocialCalEvent, id = data['socialEventId'])
        curSocialEvent.persons.add(user)
        curSocialCell = get_object_or_404(SocialCalCell, id = data['socialCalCellId'])

        socialCellObj = SocialCalCellSerializer(curSocialCell).data
        # Get the soical event list and replace the current one that is showing
        socialCellEventList = socialCellObj['get_socialCalEvent']
        # Unlike the explore page the recipient is gonna be made of date and username
        dateList = data['cellDate'].split("-")
        username = socialCellObj['socialCalUser']['username']

        # You will the use the recipient to attach to the group name
        recipient = username+"_"+dateList[0]+"_"+dateList[1]+"_"+dateList[2]
        content = {
            'command': 'add_user_social_event_M',
            'socialEventList': socialCellEventList,
            'recipient': recipient
        }

        self.send_info_cal_cell(content)


    def remove_user_social_event_M(self, data):
        # similar to the add_user_social_event_M but you just remove the person now
        user = get_object_or_404(User, id = data['userId'])
        curSocialEvent = get_object_or_404(SocialCalEvent, id = data['socialEventId'])
        curSocialEvent.persons.remove(user)
        curSocialCell = get_object_or_404(SocialCalCell, id = data['socialCalCellId'])

        socialCellObj = SocialCalCellSerializer(curSocialCell).data
        socialCellEventList = socialCellObj['get_socialCalEvent']

        dateList = data['cellDate'].split("-")
        username = socialCellObj['socialCalUser']['username']

        recipient = username+"_"+dateList[0]+"_"+dateList[1]+"_"+dateList[2]

        content = {
            'command': 'remove_user_social_event_M',
            'socialEventList': socialCellEventList,
            'recipient': recipient
        }

        self.send_info_cal_cell(content)

    def delete_social_cell_item(self, data):
        # This function will be incharge of deleting a specific social calcell
        # item and then return the updated social cal cell

        # First you will get the social cell item
        socialItem = get_object_or_404(SocialCalItems, id = data['socialItemId'])



        # Get file name to check if it is the same or different from the coverpic
        deletedPicList = str(socialItem.itemImage).split("/")
        deletedPic = deletedPicList[len(deletedPicList)-1]

        # Then you delete it
        socialItem.delete()

        # You want to get the cover pic take care of first before you delete
        # the post

        # Now you will grab the new social cal cell that just got a item deleted
        socialCell = get_object_or_404(SocialCalCell, id = data['socialCellId'])
        # Now serialize the social cell to be sent into the front end

        socialCellObj = SocialCalCellSerializer(socialCell).data
        curCoverPicList = socialCellObj['coverPic'].split("/")
        curCoverPic = curCoverPicList[len(curCoverPicList)-1]
        socialItemList = socialCellObj['get_socialCalItems']

        if(len(socialItemList) == 0):
            socialCell.coverPic = ""

            socialCell.actionText = "updated"
            # SAVED SPOT
            # no need for action text bc you are gonna delete
            socialCell.save()
        elif(len(socialItemList) > 0):
            if curCoverPic == deletedPic:

                curPicList = socialItemList[0]['itemImage'].split("/")

                curPic = curPicList[3:]

                curPic = "/".join(curPic)


                socialCell.coverPic = curPic
                socialCell.actionText = "updated"

                # SAVED SPOT
                socialCell.save()
        # Now you get the date so that you can send it to the right websocket
        dateList = data['cellDate'].split("-")
        username = socialCellObj['socialCalUser']['username']

        recipient = username+"_"+dateList[0]+"_"+dateList[1]+"_"+dateList[2]



        content = {
            'command': 'delete_social_cell_item',
            'socialItemList': socialItemList,
            'recipient': recipient
        }

        self.send_info_cal_cell(content)


    def delete_social_cell_day(self, data):
        # This function will be in charge of deleting the social cal cell day

        # First you will pull the social cal cell using the social cal cell Id
        socialCalCell = get_object_or_404(SocialCalCell, id = data['socialCellId'])

        socialCalCell.delete()

        # So once you delete social cal cell you will set up social cell object
        # so show a delete social cal cell
        calOwner = get_object_or_404(User, id = data['curId'])

        serializedUser = SocialCalUserSerializer(calOwner).data

        dateList = data['cellDate'].split("-")
        username = serializedUser['username']

        recipient = username+"_"+dateList[0]+"_"+dateList[1]+"_"+dateList[2]


        content = {
            'command': 'deleted_social_cal_cell',
            'socialCalCell': {'socialCalUser': serializedUser},
            "recipient": recipient
        }

        self.send_info_cal_cell(content)


        # So after delelting it, you just gotta send the



    def send_info_cal_cell (self, calCellObj):
        # This will be used ot send the info into the front end
        channel_layer = get_channel_layer()
        channel_recipient = calCellObj['recipient']
        channel = 'socialCalCell_'+channel_recipient

        async_to_sync(self.channel_layer.group_send)(
            channel,
            {
                'type': 'new_social_cal_cell_action',
                'socialCalAction': calCellObj
            }
        )

    def connect(self):
        # gotta connect it properly, the code or name of the social cal cell will
        # be the combination of the user name, year, month and day
        self.selectedUser = self.scope['url_route']['kwargs']['user']
        self.selectedYear = self.scope['url_route']['kwargs']['year']
        self.selectedMonth = self.scope['url_route']['kwargs']['month']
        self.selectedDay = self.scope['url_route']['kwargs']['day']
        grp = 'socialCalCell_'+self.selectedUser+'_'+self.selectedYear+'_'+self.selectedMonth+'_'+self.selectedDay

        async_to_sync (self.channel_layer.group_add)(grp, self.channel_name)
        self.accept()


    def disconnect(self, close_code):
        self.selectedUser = self.scope['url_route']['kwargs']['user']
        self.selectedYear = self.scope['url_route']['kwargs']['year']
        self.selectedMonth = self.scope['url_route']['kwargs']['month']
        self.selectedDay = self.scope['url_route']['kwargs']['day']
        grp = 'socialCalCell_'+self.selectedUser+'_'+self.selectedYear+'_'+self.selectedMonth+'_'+self.selectedDay
        async_to_sync(self.channel_layer.group_discard)(grp, self.channel_name)


    def receive(self, text_data= None, bytes_data = None, **kwargs):
        data = json.loads(text_data)
        if data['command'] == 'fetch_social_cal_cell_info':
            self.send_fetch_social_cal_cell_info(data)
        if data['command'] == 'send_social_cal_cell_like':
            self.send_social_cal_cell_like(data)
        if data['command'] == 'send_social_cal_cell_unlike':
            self.send_social_cal_cell_unlike(data)
        if data['command'] == 'send_social_cal_cell_comment':
            self.send_social_cal_cell_comment(data)
        if data['command'] == 'send_social_cal_cell_comment_like_unlike':
            self.send_social_cal_cell_comment_like_unlike(data)
        if data['command'] == 'add_user_social_event_M':
            self.add_user_social_event_M(data)
        if data['command'] == 'remove_user_social_event_M':
            self.remove_user_social_event_M(data)
        if data['command'] == 'delete_social_cell_item':
            self.delete_social_cell_item(data)
        if data['command'] == 'send_social_day_caption':
            self.send_social_day_caption(data)
        if data['command'] == 'delete_social_cell_day':
            self.delete_social_cell_day(data)


    def new_social_cal_cell_action(self, action):
        socialCalCellObj = action['socialCalAction']
        return self.send_json(socialCalCellObj)


class NewSocialCellEventNewsfeed(JsonWebsocketConsumer):
    # This websocket will be  be used to handle the channel and weboscket
    # for the newsfeed that holds the social calendar and the social events

    def send_fetch_social_post(self, data):
        # This function will be incharge of fetching the social content type
        # and the push all of it out to the newsfeed. Eventually there will be
        # better filtering and such but for now it will just be everything

        curUser = get_object_or_404(User, id = data['userId'])

        # This will get all the follewers of the curUser
        userFollowing = curUser.get_following().values("person_getting_followers")

        # Now get all the users that you are not following and yourself
        notUserFollowing = User.objects.exclude(id__in = userFollowing).exclude(id = data['userId'])

        # Now get all the users including you
        userPlusUserFollowing = User.objects.exclude(id__in = notUserFollowing.values_list("id", flat = True))

        curDate = data['curDate']

        # post_list = SocialCellEventPost.objects.all().order_by('-post_date')[:6]

        # postList = []
        # for user in userPlusUserFollowing:
        #     temp = SocialCellEventPost.objects.filter(owner_id = user.id)
        #     for post in temp:
        #         postList.append(post.pk)


        # This is the content type that holds the combination of social events
        # and social cells, now that thigns are a bit different you will
        # probally only grab users post idividually for the day (socialcalItems)

        # post_list = SocialCellEventPost.objects.all().filter(
        # owner_id__in = userPlusUserFollowing.values_list("id", flat = True)
        # ).order_by('-post_date')[:int(data['startIndex'])]



        # serializer = SocialCellEventSerializer(post_list, many = True)



        dateList = curDate.split("-")
        #  this is just individual social cal items that will get filtered by
        # the recent date, filter by current date
        singlePost_list = SocialCalItems.objects.all().filter(
        creator__in = userPlusUserFollowing.values_list("id", flat = True)
        ).filter(
        created_at__year =dateList[0],
        created_at__month = dateList[1],
        created_at__day = dateList[2],
        ).order_by('-created_at')[:int(data['startIndex'])]

        # now we just serialize it

        serializer_post = SocialCalItemsSerializer(singlePost_list, many = True)

        # You would want to grab the current day and then grab the social cal cell
        # of that day if it exist.

        # So you will be filtering social cal cell

        socialCalCell = SocialCalCell.objects.all().filter(
        socialCalUser = curUser
        ).filter(
        socialCaldate = curDate
        )


        # Now you will serialize the socialcalcell

        serializedSocialCalCell = SocialCalCellSerializer(socialCalCell, many = True).data


        content = {
            'command': 'fetch_social_posts',
            'social_posts': json.dumps(serializer_post.data),
            "curSocialCalCell": json.dumps(serializedSocialCalCell)
        }

        self.send_json(content)
        # Now you have to serialize the content type


    def send_single_post_like(self, data):
        # Function similar to that of send_social_post_like but
        # now you are just gonna send it out individually

        socialCalItem = get_object_or_404(SocialCalItems, id = data['socialItemId'])
        personLike = get_object_or_404(User, id = data['personLike'])

        socialCalItem.people_like.add(personLike)

        socialCalItemObj = SocialCalItemsSerializer(socialCalItem).data

        content = {
            "command": 'send_single_post_like',
            "socialCalItemObj":socialCalItemObj
        }

        self.send_new_social_post_action(content)

    def send_single_post_unlike(self, data):
        socialCalItem = get_object_or_404(SocialCalItems, id = data['socialItemId'])
        personUnlike = get_object_or_404(User, id = data['personUnlike'])
        socialCalItem.people_like.remove(personUnlike)
        socialCalItemObj = SocialCalItemsSerializer(socialCalItem).data

        content = {
            "command": 'send_single_post_unlike',
            "socialCalItemObj": socialCalItemObj
        }

        self.send_new_social_post_action(content)

    def update_single_post(self, data):
        socialCalItem = get_object_or_404(SocialCalItems, id = data['socialItemId'])

        socialCalItemObj = SocialCalItemsSerializer(socialCalItem).data
        content = {
            "command": 'update_single_post',
            "socialCalItemObj": socialCalItemObj
        }

        self.send_new_social_post_action(content)

    def send_social_post_like(self, data):
        # This function will be pretty much similar to that of the social cal cell
        # page like but now this one since it already exist you will just pull the
        # id

        socialCalCell = get_object_or_404(SocialCalCell, id = data['socialCalCellId'])
        # now that you got the social cal cell
        # now grab the person like
        personLike = get_object_or_404(User, id = data['personLike'])

        socialCalCell.people_like.add(personLike)
        # socialCalCell.save()

        # Now that you saved it, you would want to serialize it and then return
        # it. You will return the id to search for it and then replace it

        socialCalCellObj = SocialCalCellSerializer(socialCalCell).data

        content = {
            'command': 'send_social_post_like',
            'contentTypeId': data['contentTypeId'],
            'socialCalCellObj': socialCalCellObj
        }

        self.send_new_social_post_action(content)

    def send_social_post_unlike(self, data):
        # pretty much like that of the like but now you are unliking

        socialCalCell = get_object_or_404(SocialCalCell, id = data['socialCalCellId'])

        personUnlike = get_object_or_404(User, id = data['personUnlike'])
        socialCalCell.people_like.remove(personUnlike)
        # socialCalCell.save()

        socialCalCellObj = SocialCalCellSerializer(socialCalCell).data
        content = {
            "command": 'send_social_post_unlike',
            'contentTypeId': data['contentTypeId'],
            'socialCalCellObj': socialCalCellObj
        }

        self.send_new_social_post_action(content)

    def grab_new_updated_social_cell(self, data):
        # This function willb e used to grab the new updated social cal cell and then
        # either if new add it to the top of the redux or update an existing one


        # socialCalCell = get_object_or_404(SocialCalCell, id = data['socialCalCellId'])



        # You want to grab the content type so that you can
        # update it
        contentTypeObj = SocialCellEventPost.objects.get(
            owner_id = data['curId'],
            post_id = data['socialCalCellId']
        )

        # Now you will serialize it
        # socialCalCellObj = SocialCalCellSerializer(socialCalCell).data

        serializedSocialObj = SocialCellEventSerializer(contentTypeObj).data


        # Now you just have to send it off into the weboscket
        # You will have the curId to check with the social cal cell
        # You will use created to choose teh right path to add the cell in

        content = {
            'command': 'update_new_cell_social_newsfeed',
            'curId': data['curId'],
            'created': data['created'],
            'socialPostObj': serializedSocialObj
        }

        self.send_new_social_post_action(content)


    def remove_all_photo_social_post(self, data):
        # This is for when you remove all the pictures and you just need to return
        # the cur social cal cell and then the newsfeed again

        curDate = data['curDate']


        post_list = SocialCellEventPost.objects.all().order_by('-post_date')
        serializer = SocialCellEventSerializer(post_list, many = True)


        curUser = get_object_or_404(User, id = data['userId'])

        # timezone.activate(pytz.timezone("MST"))
        # time = timezone.localtime(timezone.now()).strftime("%Y-%m-%d")
        # print(time)

        socialCalCell = SocialCalCell.objects.all().filter(
        socialCalUser = curUser
        ).filter(
        socialCaldate = curDate
        )


        # You are gonna have a picture almost every time here

        serializedSocialCalCell = SocialCalCellSerializer(socialCalCell, many = True).data

        content = {
            'command': 'remove_all_photo_social_post',
            'social_posts': serializer.data,
            "curSocialCalCell": serializedSocialCalCell,
            'curId': data['userId']
        }

        self.send_new_social_post_action(content)


    def send_new_social_post_action(self, socialPostAction):
        # This will be used to send the actions out to the front end

        channel_layer = get_channel_layer()
        channel = "socialNewsfeed"
        async_to_sync(self.channel_layer.group_send)(
            channel,
            {
                "type": 'send_social_post_action',
                "action": socialPostAction

            }
        )





    def connect(self):
        # As all ways you first have to connect to the websocekt

        grp = "socialNewsfeed"
        async_to_sync(self.channel_layer.group_add)(grp, self.channel_name)
        self.accept()

    def disconnect(self, close_code):
        grp = "socialNewsfeed"
        async_to_sync(self.channel_layer.group_discard)(grp, self.channel_name)


    def receive(self, text_data= None, bytes_data = None, **kwargs):
        data = json.loads(text_data)
        print(data)
        if data['command'] == 'fetch_social_posts':
            self.send_fetch_social_post(data)
        if data['command'] == "send_single_post_like":
            self.send_single_post_like(data)
        if data['command'] == "send_single_post_unlike":
            self.send_single_post_unlike(data)
        if data['command'] == 'send_social_post_like':
            self.send_social_post_like(data)
        if data['command'] == 'send_social_post_unlike':
            self.send_social_post_unlike(data)
        if data['command'] == 'grab_new_updated_social_cell':
            self.grab_new_updated_social_cell(data)
        if data['command'] == 'remove_all_photo_social_post':
            self.remove_all_photo_social_post(data)
        if data['command'] == "update_single_post":
            self.update_single_post(data)

    def send_social_post_action(self, postActions):
        postAction = postActions['action']
        return self.send_json(postAction)


# This consumer is for the comment section on the newsfeed and when you open
# it up on the social calendar
class SocialCommentConsumer(JsonWebsocketConsumer):

    # use this to fetch the comments of the
    def fetch_social_cell_comments(self, data):

        socialCell = get_object_or_404(SocialCalItems, id = data['cellId'])
        # now serialize it
        cellDate = SocialCalItemsSerializer(socialCell).data["created_at"]
        socialComments = SocialCalItemComment.objects.filter(
            calItem= socialCell
        )
        serializedComments = SocialItemCommentSerializer(socialComments, many = True).data

        content = {
            'command': 'fetch_social_cell_comments',
            'socialComments': serializedComments,
            'owenrId': socialCell.creator.id,
            'cellDate': cellDate
        }

        self.send_json(content)

    def send_comment_cell(self,data):
        # makes the comment and then send it back

        # first get the cell
        socialCell = get_object_or_404(SocialCalItems, id = data['cellId'])
        # get user
        user = get_object_or_404(User, id = data['userId'])

        # now create the comment

        socialComment = SocialCalItemComment.objects.create(
            calItem = socialCell,
            body = data['comment'],
            commentUser = user
        )

        #  now serialize the comment
        serializedComments = SocialItemCommentSerializer(socialComment).data

        # now send it off
        content = {
            "command": "send_comment_cell",
            "comment":  serializedComments,
            "cellId": data['cellId']
        }


        self.send_info_comment(content)

    def send_info_comment(self, commentObj):
        # used to send stuff to the frontend
        # commentObj must have an cellid inorder to send it to the
        # right group
        channel_layer = get_channel_layer()
        channel_recipient = str(commentObj['cellId'])
        channel = "socialCellComments_"+channel_recipient

        async_to_sync(self.channel_layer.group_send)(
            channel,
            {
                "type": 'new_comment_action',
                "commentAction": commentObj
            }
        )

    def connect(self):
        # gotta get the cell id then make the group name then start creatin gthe group
        # then accept
        self.selectedCell = self.scope['url_route']['kwargs']['cellId']
        grp = 'socialCellComments_'+self.selectedCell

        async_to_sync(self.channel_layer.group_add)(grp,self.channel_name)
        self.accept()

    def disconnect(self, close_code):
        self.selectedCell = self.scope['url_route']['kwargs']['cellId']
        grp = 'socialCellComments_'+self.selectedCell
        async_to_sync(self.channel_layer.group_discard)(grp, self.channel_name)


    def receive(self, text_data= None, bytes_data = None, **kwargs):
        data = json.loads(text_data)
        print(data)
        if data['command'] == 'fetch_comment_cell_info':
            self.fetch_social_cell_comments(data)
        if data['command'] == "send_comment_cell":
            self.send_comment_cell(data)

    def new_comment_action(self, action):
        commentObj = action['commentAction']
        return self.send_json(commentObj)


# similar to the socialc al but will use id instead of data specifc
class NewSocialCalCellConsumer(JsonWebsocketConsumer):

    def send_fetch_social_cal_cell_info(self, data):
        # simplar to that of the old social cal cell consumer

        socialCell = get_object_or_404(SocialCalCell, id = data['cellId'])
        print(socialCell)
        serializedCell = SocialCalCellSerializer(socialCell).data
        content = {
            'command': "fetch_social_cal_cell_info",
            'socialCell': serializedCell
        }

        self.send_json(content)

    def send_social_cal_cell_like(self, data):
        # send function to add like to a item and then
        # return the whole social calendar
        print(data)
        personLike =  get_object_or_404(User, id = data['personLike'])

        # in this case the cellid is just the item id
        socialItem = SocialCalItems.objects.get(id= data['cellId'])
        socialItem.people_like.add(personLike)
        #
        socialCalItemObj = SocialCalItemsSerializer(socialItem).data
        #
        content = {
            "command": 'send_social_cal_cell_like',
            "socialItem": socialCalItemObj,

        }

        self.send_social_cell_action(content)

    def send_social_cell_action(self, socialCellActionObj):
        channel_layer = get_channel_layer()
        channel = "socialCalCell_"+str(socialCellActionObj['socialItem']['calCell'])

        async_to_sync(self.channel_layer.group_send)(
            channel,
            {
                "type":'send_new_social_cell_action',
                "action": socialCellActionObj
            }

        )


    def connect(self):
        self.cellId = self.scope['url_route']['kwargs']['cellId']
        grp = 'socialCalCell_'+self.cellId
        async_to_sync(self.channel_layer.group_add)(grp, self.channel_name)
        self.accept();

    def disconnect(self, close_code):
        self.cellId = self.scope['url_route']['kwargs']['cellId']
        grp = 'socialCalCell_'+self.cellId
        async_to_sync(self.channel_layer.group_discard)(grp, self.channel_name)


    def receive(self, text_data= None, bytes_data = None, **kwargs):
        data = json.loads(text_data)
        print(data)
        if data['command'] == 'fetch_social_cal_cell_info':
            self.send_fetch_social_cal_cell_info(data)
        if data['command'] == 'send_social_cal_cell_like':
            self.send_social_cal_cell_like(data)

    def send_new_social_cell_action(self, cellActions):
        cellAction = cellActions['action']
        return self.send_json(cellAction)
