from django.shortcuts import render
from . import models
from . import serializers
from django.utils import timezone
from rest_framework.views import APIView
from django.shortcuts import render, get_object_or_404
from rest_framework import generics
from datetime import datetime, timedelta


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
