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

def infinite_filter(request):
	print("This is the dictionary:"+request.GET)
	limit = request.GET.get('limit')
	offset = request.GET.get('offset')
	return models.Newsfeed.objects.all()[int(offset): int(offset) + int(limit)]

def is_there_more_data(request):
	print(request.GET)
	print('blablabla')
	offset =request.GET.get('offset')
	print('This is offset')
	print(offset)
	print(type(offset))
	if int(offset) > models.Newsfeed.objects.all().count():
		return False
	return True

class ReactInfiniteView(viewsets.ModelViewSet):
	serializer_class = serializers.NewsFeedSerializers

	def get_queryset(self):
		queryset = infinite_filter(self.request)
		return queryset

	def list(self, request):
		queryset = models.Newsfeed.objects.all()
		serializer = self.serializer_class(queryset, many=True)
		print("BLAHBLAHBLAH")
		print(request)
		return Response({
			"post": serializer.data,
			"has_more": is_there_more_data(request)
		})
