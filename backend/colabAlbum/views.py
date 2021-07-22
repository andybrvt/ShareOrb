from django.shortcuts import render
from . import models
from . import serializers
from django.utils import timezone
from rest_framework.views import APIView
from django.shortcuts import render, get_object_or_404
from rest_framework import generics

# Create your views here.
class ColabAlbumView(generics.ListAPIView):
    serializer_class = serializers.ColabAlbumSerializer
    queryset = models.ColabAlbum.objects.all()


class UserColabAlbumView(generics.ListAPIView):
    serializer_class = serializers.ColabAlbumSerializer
    def get_queryset(self):
        user = self.request.user
        queryset = models.ColabAlbum.objects.filter(person = user).order_by('created_at')
        return queryset
