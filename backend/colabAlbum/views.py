from django.shortcuts import render
from . import models
from . import serializers
from django.utils import timezone
from rest_framework.views import APIView
from django.shortcuts import render, get_object_or_404
from rest_framework import generics
from datetime import datetime, timedelta
from rest_framework.response import Response
from userprofile.models import User
import json


# Create your views here.
class ColabAlbumView(generics.ListAPIView):
    serializer_class = serializers.ColabAlbumSerializer
    queryset = models.ColabAlbum.objects.all()


# This view is used for getting the albums that you
# created after 24 hours
class UserColabAlbumView(generics.ListAPIView):
    serializer_class = serializers.ColabAlbumSerializer

    def get_queryset(self):
        user = self.request.user
        time_threshold = datetime.now() - timedelta(hours = 24)
        print(timedelta(hours = 24))
        print(time_threshold)
        queryset = models.ColabAlbum.objects.filter(
        person = user).filter(
        created_at__lt = time_threshold).order_by('created_at')
        return queryset

# this function will be for albums that are before 24 hours
class LiveUserColabAlbumView(generics.ListAPIView):

    serializer_class = serializers.ColabAlbumSerializer

    def get_queryset(self):
        user = self.request.user
        time_threshold = datetime.now() - timedelta(hours = 24)

        queryset = models.ColabAlbum.objects.filter(
        person = user).filter(
        created_at__gt = time_threshold).order_by('created_at')
        return queryset

# used to upload images to albums
class UploadColablAlbumView(APIView):
    def post(self, request,userId, id, *args, **kwargs):

        # first grab the album

        album = get_object_or_404(models.ColabAlbum, id = id)
        curUser = get_object_or_404(User, id = userId)
        # Now start making the albumitems
        itemList = []
        for i in range(int(request.data['length'])):
            albumItem = models.ColabItems.objects.create(
                creator = curUser,
                itemImage = request.data["image["+str(i)+"]"],
                colabAlbum = album
            )
            itemList.append(albumItem)


        serializedList = serializers.ColabItemSerializer(itemList, many = True).data

        return Response(serializedList)

class CreateColabAlbumView(APIView):
    def post(self, request, *args, **kwargs):
        # print(request.data['person'])

        person = []
        for people in json.loads(request.data['person']):
            curPerson = get_object_or_404(User, username = people)
            person.append(curPerson)


        newAlbum = models.ColabAlbum.objects.create(
            title = request.data['title'],
            coverPic = request.data['coverPic']
        )

        # print(person)
        newAlbum.person.set(person)

        newAlbum.save()

        serializedAlbum = serializers.ColabAlbumSerializer(newAlbum).data

        return Response(serializedAlbum)

        # return Response('stuff here')
