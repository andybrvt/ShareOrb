from django.shortcuts import render
import json
# Create your views here.
from django.conf import settings
from django.contrib.auth import get_user_model
from django.http import HttpResponseRedirect
from django.shortcuts import render, get_object_or_404
from rest_framework.views import APIView
from django.http import HttpResponse
from rest_framework import generics
from . import serializers
from . import models
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK
from django.http import JsonResponse
from . import serializers
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync


# Create your views here.
class UploadBusinessVid(APIView):
    def post(self, request, *args, **kwargs):

        businessVidUpload = models.BusinessVid.objects.create(
            email = request.data['email'],
            vid = request.data['vidSubmit'].lstrip("/media"),
        )
        serializedItem = serializers.UploadSingleVidSerializer(businessVidUpload).data

        content = {
             'item': serializedItem,
             # "cellId": socialCalCellNew.id
         }
        return Response(content)
