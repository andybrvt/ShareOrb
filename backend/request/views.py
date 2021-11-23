from django.shortcuts import render, get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from . import models
from . import serializers
# Create your views here.


class getRequests(APIView):

    def get(self, request, *args, **kwargs):

        print('here here')

        request = models.UserRequest.objects.all()

        serializedRequest = serializers.UserRequestSerializer(request, many = True).data

        return Response(serializedRequest)
