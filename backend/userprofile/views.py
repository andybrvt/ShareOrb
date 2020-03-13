from django.shortcuts import render
from rest_framework import generics
from . import models, serializers
from rest_framework import viewsets


# Create your views here.

class PostListView(viewsets.ModelViewSet):
	queryset = models.Post.objects.all().order_by('-created_at', '-updated_at')
	serializer_class = serializers.PostSerializer
