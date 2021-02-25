from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from . import models
from . import serializers
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from rest_framework import generics
from rest_framework import viewsets
from datetime import datetime
from django.utils import timezone
from userprofile.models import User
from userprofile.models import CustomNotification
from userprofile.serializers import NotificationSerializer
import pytz
from rest_framework.parsers import FormParser
from rest_framework.parsers import MultiPartParser



# Create your views here.

class SocialCalCellView(generics.ListAPIView):
    # This will show all the socialCalCells and all its components
    queryset = models.SocialCalCell.objects.all()
    serializer_class = serializers.SocialCalCellSerializer


class SocialCalUploadPic(APIView):
    # parser_classes = (FormParser, MultiPartParser)
    def post(self, request, id, *args, **kwargs):
        # This is to adjust the time to the correct timezone
        print(timezone.localtime())
        timezone.activate(pytz.timezone("MST"))
        time = timezone.localtime(timezone.now()).strftime("%Y-%m-%d")
        # This will grab the user
        print(timezone.localtime())
        user = get_object_or_404(User, id = id)
        # This will either create or get the socialCalCell and since you can only add pictures
        # to the current day that is why we are putting the socialCalDate and testDate will
        # always be the current date... unless it is the commenting and liking
        socialCalCell, created = models.SocialCalCell.objects.get_or_create(
            socialCalUser = user,
            socialCaldate = time
        )


        change = bool(socialCalCell.coverPic)
        print(request.data)
        for i in range(len(request.data)):


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


        socialCalCell.save()


        # Get social cal again so we can pull the cover picture
        socialCalCellNew = get_object_or_404(models.SocialCalCell,
            socialCalUser = user,
            socialCaldate = time
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
    def post(self, request, id, *args, **kwargs):
        # First you will grab the social cal cell given the id
        # then you will just change the cover pic and then return the serialized cell
        # and the you are good to go

        print("hit here")
        print(request.data)
        socialCalCell = get_object_or_404(models.SocialCalCell, id = request.data['cellId'])
        if(isinstance(request.data['coverImage'], str)):
            # check if its already save as a directory
            socialCalCell.coverPic = request.data['coverImage'].lstrip("/media")
        else:
            # This is for a inmemory file object
            socialCalCell.coverPic = request.data['coverImage']

        socialCalCell.save()

        serializedSocialCell = serializers.SocialCalCellSerializer(socialCalCell).data

        content = {
            "socialCell": serializedSocialCell,
            "created": request.data['createdCell']
        }
        return Response(content)

class SocialClippingView(APIView):
    # This class is used for adding the clipping of pictures into the social
    # calendar. Pretty similar to uploading pictures but now you just ahve the picture
    def post(self, request, *args, **kwargs):
        # This is to adjust the time to the correct timezone
        timezone.activate(pytz.timezone("MST"))
        time = timezone.localtime(timezone.now()).strftime("%Y-%m-%d")
        # This will grab the user
        user = get_object_or_404(User, id = request.data['curId'])
        # This will either create or get the socialCalCell and since you can only add pictures
        # to the current day that is why we are putting the socialCalDate and testDate will
        # always be the current date... unless it is the commenting and liking
        socialCalCell, created = models.SocialCalCell.objects.get_or_create(
            socialCalUser = user,
            socialCaldate = time
        )

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

        if socialCalCell.coverPic == '':
            socialCalCell.coverPic = request.data['clipPic'].lstrip("/media")

        # Now you have create it and add in the cover pic
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
                socialCalCell.save()

            models.SocialCalItems.objects.create(
                creator = imgOwner,
                itemUser = calOwner,
                itemImage = image,
                calCell = socialCalCell
            )


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

        print("it hits here pretty well")
        print(request.data)
        # You want to first grab the time
        timezone.activate(pytz.timezone("MST"))
        time = timezone.localtime(timezone.now()).strftime("%Y-%m-%d")

        # Then you grab the user
        user = get_object_or_404(User, id = id)

        # Now you will get or create to make sure you cover all the basis
        # if you were gonna update or create a new social cal cell
        socialCalCell, created = models.SocialCalCell.objects.get_or_create(
            socialCalUser = user,
            socialCaldate = time
        )


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
                    socialItemType = 'picture',
                    creator = user,
                    itemUser = user,
                    itemImage = request.data['image['+str(i)+']'].lstrip("/media"),
                    calCell = socialCalCell
                )
            else:
                socialCalItem = models.SocialCalItems.objects.create(
                    socialItemType = 'picture',
                    creator = user,
                    itemUser = user,
                    itemImage = request.data['image['+str(i)+']'],
                    calCell = socialCalCell
                )

        # Now save the social cal cell
        socialCalCell.save()

        # Now you will serialized the socialCalCell

        serializedSocialCell = serializers.SocialCalCellSerializer(socialCalCell).data

        content = {
            "created": created,
            "coverPicChange": change,
            "cell": serializedSocialCell
        }


        return Response(content)
