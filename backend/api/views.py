from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics
from rest_framework import viewsets
from . import models
# from .serializers import ProfileSerializer

# view set that takes in a serializer by the serializer class
# takes in a queryset in order to modify the objects
# class ProfileViewSet(viewsets.ModelViewSet):
# 	serializer_class = ProfileSerializer
# 	queryset = models.Profile.objects.all()
