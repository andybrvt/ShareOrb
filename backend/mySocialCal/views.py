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
        timezone.activate(pytz.timezone("MST"))
        time = timezone.localtime(timezone.now()).strftime("%Y-%m-%d")
        # This will grab the user
        user = get_object_or_404(User, id = id)
        # This will either create or get the socialCalCell and since you can only add pictures
        # to the current day that is why we are putting the socialCalDate and testDate will
        # always be the current date... unless it is the commenting and liking
        socialCalCell, created = models.SocialCalCell.objects.get_or_create(
            socialCalUser = user,
            socialCaldate = time,

        )

        # print(request.data.get('image[0]'))
        # print(request.body)

        for i in range(len(request.data)):
            print(request.data['image['+str(i)+']'])

        # Now we will loop through all the photos and make an isntance for eahc one and
        # add a foregin key to it so that it can connect to the right socialcalCell
        # for images in request.data['fileList']:
        #     print(images)
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
                calCell = socialCalCellhandlePicthandlePictureUploadureUpload
            )
        if socialCalCell.coverPic == '':
            if (len(request.data) != 0):
                obj, create = models.SocialCalCell.objects.update_or_create(
                    socialCalUser = user,
                    socialCaldate = time,
                    testDate = time,
                    defaults = {'coverPic': request.data['image[0]']}
                )
        # print(request.data)
        # print(socialCalCell)
        return Response('Uploaded Pictures')

class SocialEventCreateView(APIView):
    def post(self, request, *args, **kwargs):
        print(request.data)

        # For this psot function, what you wanna do is, first get the user object
        # which is the person who made the event then you would then get_or_create
        # the socialCalcell with the date that you got passed in
        # Once you have gotten all that, you would then start making the event,
        # you would add all the information an
        user = get_object_or_404(User, id = request.data['curId'])
        socialCalCell, created = models.SocialCalCell.objects.get_or_create(
            socialCalUser = user,
            socialCaldate = request.data['date'],
            testDate = request.data['date']
        )

        eventPerson = set()
        eventPerson.add(user)

        socialCalEvent = models.SocialCalEvent.objects.create(
            host = user,
            title = request.data['title'],
            content = request.data['content'],
            start_time = request.data['startTime'],
            end_time = request.data['endTime'],
            location = request.data['location'],
            event_day = request.data['date'],
            calCell = socialCalCell
        )

        socialCalEvent.persons.add(user)
        return Response('Uploaded Pictures')

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
