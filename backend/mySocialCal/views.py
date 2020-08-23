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


# Create your views here.

class SocialCalCellView(generics.ListAPIView):
    # This will show all the socialCalCells and all its components
    queryset = models.SocialCalCell.objects.all()
    serializer_class = serializers.SocialCalCellSerializer


class SocialCalUploadPic(APIView):
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
            testDate = time
        )

        # Now we will loop through all the photos and make an isntance for eahc one and
        # add a foregin key to it so that it can connect to the right socialcalCell
        for images in request.data['fileList']:
            print(images)
            # Gotta remember that the socialCalItem has to be the right type (jsut for future refernce)
            # clip_w_pic
            # clip_pic
            # picture
            socialCalItem = models.SocialCalItems.objects.create(
                socialItemType = 'picture',
                creator = user,
                itemUser = user,
                # itemImage = images,
                calCell = socialCalCell
            )


        print(request.data)
        print(socialCalCell)
        return Response('Uploaded Pictures')
