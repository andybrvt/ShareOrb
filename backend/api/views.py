from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics
from rest_framework import viewsets
from . import models
from . import serializers


class NewsFeedViewSet(viewsets.ModelViewSet):
	serializer_class = serializers.NewsFeedSerializers
	queryset = models.Newsfeed.objects.all()
