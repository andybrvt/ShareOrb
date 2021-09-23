from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from . import models
from . import serializers
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from rest_framework import generics
from rest_framework import viewsets
import datetime
from django.utils import timezone
from userprofile.models import User
from userprofile.models import CustomNotification
from userprofile.serializers import NotificationSerializer
import pytz
from rest_framework.parsers import FormParser
from rest_framework.parsers import MultiPartParser
import time
from django.utils.crypto import get_random_string


# Create your views here.
class GoalAlbumStringView(generics.ListAPIView):
    serializer_class = serializers.GoalAlbumStringSerializer

    def get_queryset(self):
        return models.GoalAlbumString.objects.filter(owner__id = self.kwargs['id'])

class SocialCalCellView(generics.ListAPIView):
    # This will show all the socialCalCells and all its components
    queryset = models.SocialCalCell.objects.all()
    serializer_class = serializers.SocialCalCellSerializer

class SocialItemsView(generics.ListAPIView):
    queryset = models.SocialCalItems.objects.all()
    serializer_class = serializers.SocialCalItemsSerializer

class SocialCalUploadPic(APIView):
    # This function will upload the pic that are selcted in the newsfeed

    # parser_classes = (FormParser, MultiPartParser)
    def post(self, request, id, *args, **kwargs):
        # This is to adjust the time to the correct timezone
        # print(timezone.localtime())
        # timezone.activate(pytz.timezone("MST"))
        # time = timezone.localtime(timezone.now()).strftime("%Y-%m-%d")

        curDate = request.data['curDate']

        # This will grab the user
        user = get_object_or_404(User, id = id)
        # This will either create or get the socialCalCell and since you can only add pictures
        # to the current day that is why we are putting the socialCalDate and testDate will
        # always be the current date... unless it is the commenting and liking
        socialCalCell, created = models.SocialCalCell.objects.get_or_create(
            socialCalUser = user,
            socialCaldate = curDate
        )


        change = True

        # check if new or not
        # if created is true then we wont do anythign if not we can
        # go in and change the actiontext to updated
        if(created == False):
            socialCalCell.actionText = "updated"

        for i in range(int(request.data['fileListLength'])):


            # if socialCalCell.coverPic == '':
            #     socialCalCell.coverPic = request.data['image[0]']
            #     socialCalCell.save()
            #
            #     # obj.coverPic = request.data['image[0]']
            #     change = True

        # Now we will loop through all the photos and make an isntance for eahc one and
        # add a foregin key to it so that it can connect to the right socialcalCell
        # for images in request.data['fileList']:
        #
            # Gotta remember that the socialCalItem has to be the right type (jsut for future refernce)
            # clip_w_pic
            # clip_pic
            # picture

            socialCalItem = models.SocialCalItems.objects.create(
                socialItemType = 'picture',
                creator = user,
                itemUser = user,
                itemImage = request.data['image['+str(i)+']'],
                calCell = socialCalCell
            )

        # Gotta make sure you save()


        # SAVED SPOT
        socialCalCell.save()


        # Get social cal again so we can pull the cover picture
        socialCalCellNew = get_object_or_404(models.SocialCalCell,
            socialCalUser = user,
            socialCaldate = curDate
         )


        # This is most just to get the current cover profile for the front end
        serializedSocialCell = serializers.SocialCalCellSerializer(socialCalCellNew).data
        content = {
            "coverPicChange": change,
            "created": created,
            "cell": serializedSocialCell
        }
        return Response(content)

class UpdateSocialCellCoverPic(APIView):
    # This function will update the cover picture of the cell
    # This function is used in conjection with the udpate picture view
    def post(self, request, id, *args, **kwargs):
        # First you will grab the social cal cell given the id
        # then you will just change the cover pic and then return the serialized cell
        # and the you are good to go


        socialCalCell = get_object_or_404(models.SocialCalCell, id = request.data['cellId'])
        if(isinstance(request.data['coverImage'], str)):
            # check if its already save as a directory
            socialCalCell.coverPic = request.data['coverImage'].lstrip("/media")
        else:
            # This is for a inmemory file object
            socialCalCell.coverPic = request.data['coverImage']

        # SAVED SPOT
        # For now you will not need for the action text here
        socialCalCell.save()

        print('cal items here')
        # serializedSocialCell = serializers.SocialCalCellSerializer(socialCalCell).data
        print(len(socialCalCell.get_socialCalItems()))

        return Response(len(socialCalCell.get_socialCalItems()))

class UpdateSocialCellCoverVid(APIView):

    def post(self, request, id, *args, **kwargs):


        socialCalCell = get_object_or_404(models.SocialCalCell, id = request.data['cellId'])


        if(isinstance(request.data['coverVideo'], str)):
            # check if its already save as a directory
            socialCalCell.coverVid = request.data['coverVideo'].lstrip("/media")
        else:
            # This is for a inmemory file object
            socialCalCell.coverVid = request.data['coverVideo']

        # SAVED SPOT
        # For now you will not need for the action text here
        socialCalCell.save()

        # serializedSocialCell = serializers.SocialCalCellSerializer(socialCalCell).data


        return Response(len(socialCalCell.get_socialCalItems()))


class SocialClippingView(APIView):
    # This class is used for adding the clipping of pictures into the social
    # calendar. Pretty similar to uploading pictures but now you just ahve the picture
    def post(self, request, *args, **kwargs):
        # This is to adjust the time to the correct timezone


        curDate = request.data['curDate']


        # timezone.activate(pytz.timezone("MST"))
        # time = timezone.localtime(timezone.now()).strftime("%Y-%m-%d")
        # This will grab the user
        user = get_object_or_404(User, id = request.data['curId'])

        # This will either create or get the socialCalCell and since you can only add pictures
        # to the current day that is why we are putting the socialCalDate and testDate will
        # always be the current date... unless it is the commenting and liking
        socialCalCell, created = models.SocialCalCell.objects.get_or_create(
            socialCalUser = user,
            socialCaldate = curDate
        )

        # Since this clipped a picture, it doesn't really matter if it is new
        # or not. we will just say its clipped
        socialCalCell.actionText = 'clipped'


        # So the soical itme type clip will be a clipped pictures, and in thr
        # front end it will look like a polaroid

        # So unlike the upload pic the creator will be the ower of the post and not
        # the current user
        postOwner = get_object_or_404(User, id = request.data['postOwnerId'])

        socialCalItem = models.SocialCalItems.objects.create(
            socialItemType = "clip",
            creator = postOwner,
            itemUser = user,
            itemImage = request.data['clipPic'].lstrip("/media"),
            calCell = socialCalCell
        )

        # Remove to set cover pic
        # if socialCalCell.coverPic == '':
        socialCalCell.coverPic = request.data['clipPic'].lstrip("/media")

        # Now you have create it and add in the cover pic

        # SAVED SPOT
        socialCalCell.save()


        return Response("Clipping of pictures")

class SocialChangeCoverPic(APIView):
    def post(self, request, *args, **kwargs):

        # This post function will be used for changing the cover pic of the
        # certain cell

        # You will first pull the social cal cell using the id that is getting passed
        # if

        # Then you will just change the coverPic field on the cell and then save
        # it.

        # You do not need to return anything because the social cal cell will
        # update itself

        socialCalCell = get_object_or_404(models.SocialCalCell, id = request.data['socialCellId'])


        coverPicList = request.data['coverPic'].split("/")

        curPic = coverPicList[3:]

        curPic = "/".join(curPic)
        # coverPic = request.data['coverPic'].lstrip("/media")

        socialCalCell.coverPic = curPic

        # SAVED SPOT
        # This is just for changing the cover pic so no need
        socialCalCell.save()

        return Response("Change cover pic")


class SocialEventCreateView(APIView):
    def post(self, request, *args, **kwargs):

        # For this psot function, what you wanna do is, first get the user object
        # which is the person who made the event then you would then get_or_create
        # the socialCalcell with the date that you got passed in
        # Once you have gotten all that, you would then start making the event,
        # you would add all the information an

        # The user will be the owner of the calendar
        # You will also need to get the owner of the calendar which will be
        # calOwner. It will replace the socialCalUser pulling the cal owner
        # cell. So you have to replace that. Making the event though you will
        # use the curId
        curUser = get_object_or_404(User, id = request.data['curId'])
        calOwner = get_object_or_404(User, id = request.data['calOwner'])
        socialCalCell, created = models.SocialCalCell.objects.get_or_create(
            socialCalUser = calOwner,
            socialCaldate = request.data['date'],
        )


        # When creating the event, the host will be the curUser not the calOwner,
        # and because you are using this when you are asking for requestion. Most
        # likely the users will be different
        socialCalEvent = models.SocialCalEvent.objects.create(
            host = curUser,
            title = request.data['title'],
            content = request.data['content'],
            start_time = request.data['startTime'],
            end_time = request.data['endTime'],
            location = request.data['location'],
            event_day = request.data['date'],
            calCell = socialCalCell
        )

        socialCalEvent.persons.add(curUser)
        return Response('Uploaded pending social event')

class SocialPictureCreateView(APIView):
    def post(self, request, *args, **kwargs):
        # consist of notificationId, ownerId, date, curId
        # This function will pretty be the http version of teh approve_social_pics
        # in the userprofile consumers. It is used to make the calcell or grab it
        # and make the calendar items

        # This is used to approve pictures that are request to be put on somone's
        # calendar

        notification = get_object_or_404(CustomNotification, id = request.data['notificationId'])
        serializedNotification = NotificationSerializer(notification).data

        # Now we will get the social cal cell
        calOwner = get_object_or_404(User, id = request.data['ownerId'])
        socialCalCell, created = models.SocialCalCell.objects.get_or_create(
            socialCalUser = calOwner,
            socialCaldate = request.data['date']
        )

        # Then you will loop through all the picutres that are in the notification
        # and then add them to soicalitems that are assocated wit the soicalcalcells

        imgOwner = get_object_or_404(User, id= request.data['curId'])
        for items in serializedNotification['get_pendingImages']:
            image = items['itemImage']
            image = image.lstrip("/media")
            if socialCalCell.coverPic == "":
                socialCalCell.coverPic = image

            models.SocialCalItems.objects.create(
                creator = imgOwner,
                itemUser = calOwner,
                itemImage = image,
                calCell = socialCalCell
            )

        # SAVED SPOT
        socialCalCell.save()

        return Response("Uploaded pending social picture")

class ShowSocialEvents(generics.ListAPIView):
    serializer_class = serializers.SocialCalEventSerializer
    queryset = models.SocialCalEvent.objects.all()

class SocialEventBackgroundUpdate(generics.RetrieveUpdateAPIView):
    serializer_class = serializers.SocialEventBackgroundSerializer
    lookup_field = "id"
    queryset = models.SocialCalEvent.objects.all()


class DeleteSocialEventView(generics.RetrieveDestroyAPIView):
    serializer_class = serializers.SocialCalEventSerializer
    lookup_field = "id"
    queryset = models.SocialCalEvent.objects.all()

class SocialCapUploadNewsfeed(APIView):
    # This function will be used in the newsfeed part where you will upload a
    # caption and Pictures
    def post(self, request, id, *args, **kwargs):

        curDate = request.data['curDate']

        # timezone.activate(pytz.timezone("MST"))
        # time = timezone.localtime(timezone.now()).strftime("%Y-%m-%d")

        # Then you grab the user
        user = get_object_or_404(User, id = id)

        # Now you will get or create to make sure you cover all the basis
        # if you were gonna update or create a new social cal cell
        socialCalCell, created = models.SocialCalCell.objects.get_or_create(
            socialCalUser = user,
            socialCaldate = curDate
        )

        # check new or not
        if(created == False):
            socialCalCell.actionText = "updated"

        # Add in the day caption here
        socialCalCell.dayCaption = request.data['dayCaption']

        # Check if the social cal cell has any pictures attached to it


        socialCalCellItemList = models.SocialCalItems.objects.all().filter(calCell = socialCalCell)
        if(socialCalCellItemList.count() > 0):
            # Delete all of them so that you can update the list
            socialCalCellItemList.delete()

        # Clear out the social coverPic
        socialCalCell.coverPic = ""


        change = False
        if(int(request.data['fileListLength']) > 0):
            # check if there are actually pictures
            change = True

        # Check if it has a cover pic in order for you to update or not
        # You dont need to check, this will cover pretty much all the cases
        # Now you will use the length of the file list
        for i in range(int(request.data['fileListLength'])):
            # Now you will create the social cal cell items

            if(isinstance(request.data['image['+str(i)+']'], str)):
                # check if image is just a path or a uploaded file
                socialCalItem = models.SocialCalItems.objects.create(
                    socialItemType = request.data['socialItemType['+str(i)+']'],
                    creator = user,
                    itemUser = user,
                    itemImage = request.data['image['+str(i)+']'].lstrip("/media"),
                    calCell = socialCalCell
                )
            else:
                socialCalItem = models.SocialCalItems.objects.create(
                    socialItemType = request.data['socialItemType['+str(i)+']'],
                    creator = user,
                    itemUser = user,
                    itemImage = request.data['image['+str(i)+']'],
                    calCell = socialCalCell
                )

        # Now save the social cal cell

        # SAVED SPOT
        socialCalCell.save()

        # Now you will serialized the socialCalCell

        serializedSocialCell = serializers.SocialCalCellSerializer(socialCalCell).data

        content = {
            "created": created,
            "coverPicChange": change,
            "cell": serializedSocialCell
        }


        return Response(content)
        # return Response("hi this stuff")


class AddOneLikeToComment(APIView):
    def post(self, request, id, *args, **kwargs):
        # grabs post based off of id in newsfeed
        grabComment= models.Comment.objects.get(id=id)
        if(grabComment.comment_like_condition==False):
            grabComment.comment_like_count+=1
            grabComment.comment_like_condition=True
        else:
            grabComment.comment_like_count-=1
            grabComment.comment_like_condition=False

        grabComment.save()
        return Response('View post in console')


def is_there_more_data(start):
    # This function will check if there are more post to load up
    if(int(start)> models.SocialCellEventPost.objects.all().count()):
        return False
    return True

class loadSocialPostView(APIView):
    # This function will be in charge of loading up more data
    # in the newsfeed when we hit the bottom of the list

    # Pretty much you keep track of the start and end in the front end
    # and then just pass it in the back to render the right ones
    def get(self, request,curDate, start, addMore, *args, **kwargs):

        # Now add the same filter here similar to the one you have on your consumer
        curUser = get_object_or_404(User, id = self.request.user.id)

        following = len(curUser.get_following())
        if self.request.user.id == 1 or self.request.user.id == 3 or following <= 5:
            socialItems = models.SocialCalItems.objects.all()[start:start+addMore]
            serializer_post = serializers.SocialCalItemsSerializer(socialItems, many = True).data

        else:

            userFollowing = curUser.get_following().values("person_getting_followers")

            notUserFollowing = User.objects.exclude(id__in = userFollowing).exclude(id = self.request.user.id)

            userPlusUserFollowing = User.objects.exclude(id__in= notUserFollowing.values_list("id", flat = True))

            # allPost = models.SocialCellEventPost.objects.all().filter(
            # owner_id__in = userPlusUserFollowing.values_list("id", flat = True)
            # ).order_by('-post_date')[start:start+addMore]
            #
            # # allPost = models.SocialCellEventPost.objects.all()[start:start+addMore]
            # serializer = serializers.SocialCellEventSerializer(allPost, many = True).data




            dateList = curDate.split("-")

            # FOR FUTURE USE
            # allSinglePost = models.SocialCalItems.objects.all().filter(
            # creator__in = userPlusUserFollowing.values_list("id", flat = True)
            # ).filter(
            # created_at__year =dateList[0],
            # created_at__month = dateList[1],
            # created_at__day = dateList[2],
            # ).order_by('-created_at')[start:start+addMore]


            allSinglePost = models.SocialCalItems.objects.all().filter(
            creator__in = userPlusUserFollowing.values_list("id", flat = True)
            ).order_by('-created_at')[start:start+addMore]



            serializer_post = serializers.SocialCalItemsSerializer(allSinglePost, many = True).data

        content = {
            "socialPost":serializer_post,
            "has_more": is_there_more_data(start)
        }

        return Response(content)


# This function will mostly be used by the mobile so that you can get the different
# social calendar cell and render then by month
class grabSocialCellRangeView(APIView):
    def get(self, request, userId, start, end, *args, **kwargs):

        print(userId)


        # we were able to get the user and the start date and end date
        # now we just have

        user = User.objects.get(id = userId)
        # You will first get the user and then you get the social cal cells by
        # filtering out the users
        cells = models.SocialCalCell.objects.filter(socialCalUser = user)

        # so now we will start filtering out the cells by the month
        # we will use created at to filter out the time
        filterSocialCell = cells.filter(socialCaldate__gte = start, socialCaldate__lte = end)

        # now we will serialize it and then return it
        # make sure to use the smaller serialzier
        serializedCells = serializers.SocialCalCellMiniSerializer(filterSocialCell, many = True).data

        return Response(serializedCells)


# STILL NEED MORE WORK BUT TEMP
# sicne we are gonna make a trending page, we ened a function that can just get the
# social cal cell evnet post for now  --> but since you are just doing the trending
# day we will just pull the soical cal cell post
class trendingSocialCellDay(APIView):
    # We will be using a get function (for now just pull all the social cal cell)
    def get(self, request, *args, **kwargs):
        # Sicne you are gonna do authaxios so the user would already be included
        # in the header, you might not even need the user (eventually we are gonna
        #  have algorhims in place to see what people like but now its just general)


        cells = models.SocialCalCell.objects.all()
        # Now we will just serialize it, just the cover pic should be good enough

        serializedCells = serializers.SocialCalCellMiniSerializer(cells, many = True).data

        return Response(serializedCells)

# STILL NEEED MORE WORK BUT TEMP
# This will be used to get random day from random people, so I have to figure out
# how to grab random people's social cal cell and then just return it
class exploreSocialCellDay(APIView):

    # We will be using a get function (for now just pull all the social cal cell)
    def get(self, request, start, end, *args, **kwargs):


        cells = models.SocialCalCell.objects.all()[start:end]
        # Now we will just serialize it, just the cover pic should be good enough

        serializedCells = serializers.SocialCalCellMiniSerializer(cells, many = True).data

        return Response(serializedCells)


# this function will be used to upload a single pic to the social cal cell
class SocialCalSingleUploadPic(APIView):

    # **** make sure you relink the websockets for the newsfeed, right now it
    # is hella inefficient
    def post(self, request, id, *args, **kwargs):
        # new improved single pic upload
        # first create the social cal cell (or get it if it is already created)
        # then link up the new cover picture
        # then you create the social cal item and then send it off to the front end


        curDate = request.data['curDate']
        curDateTime = request.data['curDateTime']
        caption = request.data['caption']




        #then get the user
        user = get_object_or_404(User, id = id)



        socialCalCell, created = models.SocialCalCell.objects.get_or_create(
            socialCalUser = user,
            socialCaldate = curDate
        )


        # chnage is change of the coverpicture
        change = True

        if(created == False):
            socialCalCell.actionText = "updated"

        if(request.data['goalId'] != "undefined"):
            goal = get_object_or_404(models.GoalAlbumString, id = int(request.data['goalId']))
            # Now you add a single picture in
            socialCalItem = models.SocialCalItems.objects.create(
                socialItemType = 'picture',
                creator = user,
                itemUser = user,
                itemImage = request.data['image'],
                calCell = socialCalCell,
                created_at = curDateTime,
                caption = caption,
                goal = goal
            )

            socialCalCell.save()



        else:
            # Now you add a single picture in
            socialCalItem = models.SocialCalItems.objects.create(
                socialItemType = 'picture',
                creator = user,
                itemUser = user,
                itemImage = request.data['image'],
                calCell = socialCalCell,
                created_at = curDateTime,
                caption = caption
            )

            socialCalCell.save()

        serializedItem = serializers.SocialCalItemsSerializer(socialCalItem).data

        socialCalCellNew = get_object_or_404(models.SocialCalCell,
            socialCalUser = user,
            socialCaldate = curDate
         )


        content = {
             'item': serializedItem,
             "cellId": socialCalCellNew.id
         }

        return Response(content)



        # This is most just to get the current cover profile for the front end
        # serializedSocialCell = serializers.SocialCalCellSerializer(socialCalCellNew).data
        # content = {
        #     "coverPicChange": change,
        #     "created": created,
        #     "cell": serializedSocialCell
        # }

        # return Response(content)


class SocialCalSingleUploadVid(APIView):
    def post(self, request, id, *args, **kwargs):


        curDate = request.data['curDate']
        curDateTime = request.data['curDateTime']
        caption = request.data['caption']
        user = get_object_or_404(User, id = id)

        socialCalCell, created = models.SocialCalCell.objects.get_or_create(
            socialCalUser = user,
            socialCaldate = curDate
        )

        change = True

        if(created == False):
            socialCalCell.actionText = "updated"

        if(request.data['goalId'] != "undefined"):
            goal = get_object_or_404(models.GoalAlbumString, id = int(request.data['goalId']))
            # Now you add a single picture in
            socialCalItem = models.SocialCalItems.objects.create(
                socialItemType = 'picture',
                creator = user,
                itemUser = user,
                video = request.data['video'],
                calCell = socialCalCell,
                created_at = curDateTime,
                caption = caption,
                goal = goal
            )

            socialCalCell.save()



        else:
            # Now you add a single picture in
            socialCalItem = models.SocialCalItems.objects.create(
                socialItemType = 'picture',
                creator = user,
                itemUser = user,
                video = request.data['video'],
                calCell = socialCalCell,
                created_at = curDateTime,
                caption = caption
            )

            socialCalCell.save()

        serializedItem = serializers.SocialCalItemsSerializer(socialCalItem).data

        socialCalCellNew = get_object_or_404(models.SocialCalCell,
            socialCalUser = user,
            socialCaldate = curDate
         )


        content = {
             'item': serializedItem,
             "cellId": socialCalCellNew.id
         }

        return Response(content)
# create the goal here

class GoalAlbumStringCreate(APIView):

    def post(self, request, userId, *args, **kwargs):

        print(request.data)
        user = get_object_or_404(User, id = userId)

        goal = models.GoalAlbumString.objects.create(
            goal = request.data['body'],
            owner = user
        )

        serializedGoal = serializers.GoalAlbumStringSerializer(goal).data
        return Response(serializedGoal)

# This function will get a specific goal given the id
class GoalAlbumStringGet(APIView):
    def get(self, request, goalId, *args, **kwargs):

        goal = get_object_or_404(models.GoalAlbumString, id = goalId)

        serializedGoal = serializers.GoalAlbumStringSerializer(goal).data


        return Response(serializedGoal)

# This class will be just for admin to check on the users accounts
class UserItemView(APIView):
    def get(self, request, username, *args, **kwargs):

        user = get_object_or_404(User, username = username)

        items = models.SocialCalItems.objects.filter(creator = user).order_by('-created_at')

        serializedItems = serializers.SocialCalItemsSerializer(items, many = True).data

        return Response(serializedItems)
# this will be for the admin to check the cells of the users easier
class UserCellsView(APIView):
    def get(self, request, username, *args, **kwargs):
        user = get_object_or_404(User, username = username)

        cells = models.SocialCalCell.objects.filter(socialCalUser = user).order_by('-created_at')

        serializedCells = serializers.SocialCalCellSerializer(cells, many = True).data

        return Response(serializedCells)


# This function will be for grabing the suggested groups
class SuggestedGroups(APIView):

    def get(self, request, *args, **kwargs):

        groups = models.SmallGroups.objects.all()
        serializedGroups = serializers.SmallGroupsExploreSerializers(groups, many = True).data
        return Response(serializedGroups)

# This function will be used to create the small group
class CreateSmallGroup(APIView):

    def post(self, request, *args, **kwargs):
        print(request.data)
        public = True
        if(request.data['public'] == "false"):
            public = False
        group = models.SmallGroups.objects.create(
            group_name = request.data['groupName'],
            groupPic = request.data['groupPic'],
            description = request.data['description'],
            public = public
        )

        curUser = get_object_or_404(User, id = request.data['curId'])
        group.members.add(curUser)
        group.save()
        serializedGroup = serializers.SmallGroupsExploreSerializers(group, many = False).data

        return Response(serializedGroup)
