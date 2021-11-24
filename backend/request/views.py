from django.shortcuts import render, get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from userprofile.models import User
from . import models
from . import serializers
# Create your views here.


class getRequests(APIView):

    def get(self, request, *args, **kwargs):

        print('here here')

        request = models.UserRequest.objects.all()

        serializedRequest = serializers.UserRequestSerializer(request, many = True).data

        return Response(serializedRequest)


class postRequest(APIView):

    def post(self, request, userId, *args, **kwargs):

        user = get_object_or_404(User, id = userId)
        request = models.UserRequest.objects.create(
            requester = user,
            request = request.data['userRequest'],
        )

        serializedRequest = serializers.UserRequestSerializer(request).data
        return Response(serializedRequest)

class postResponse(APIView):
    def post(self, request, userId, requestId, *args, **kwargs):

        print(userId, requestId)

        print(request.data['video'])
        user = get_object_or_404(User, id = userId)
        response = models.UserResponse.objects.create(
            responder = user,
            video = request.data['video']
        )

        request = get_object_or_404(models.UserRequest, id = requestId)

        request.response = response
        request.save()

        return Response('stuff here')

class likeRequest(APIView):
    def post(self, request, userId, requestId, *args, **kwargs):
        print(userId, requestId)
        user = get_object_or_404(User, id = userId)
        request = get_object_or_404(models.UserRequest, id = requestId)

        request.people_like.add(user)
        request.save()



        return Response(userId)

class unlikeRequest(APIView):
    def post(self, request, userId, requestId, *args, **kwargs):

        user = get_object_or_404(User, id = userId)
        request = get_object_or_404(models.UserRequest, id = requestId)

        request.people_like.remove(user)
        request.save()

        serializedRequest = serializers.UserRequestSerializer(request).data

        return Response(serializedRequest['people_like'])
