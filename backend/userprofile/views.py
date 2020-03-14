from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics
from rest_framework import viewsets
from . import models
from . import serializers

# Create your views here.

class PostListView(viewsets.ModelViewSet):
	queryset = models.Post.objects.all().order_by('-created_at', '-updated_at')
	serializer_class = serializers.PostSerializer

def infinite_filter(request):
	print("This is the dictionary:"+request.GET)
	limit = request.GET.get('limit')
	offset = request.GET.get('offset')
	print(limit, offset)
	return models.Post.objects.all()[int(offset): int(offset) + int(limit)]

def is_there_more_data(request):

	offset =request.GET.get('offset')
	print(type(offset))
	if int(offset) > models.Post.objects.all().count():
		return False
	return True

class ReactInfiniteView(viewsets.ModelViewSet):
	serializer_class = serializers.PostSerializer

	def get_queryset(self):
		queryset = infinite_filter(self.request)
		return queryset

	def list(self, request):
		queryset = models.Post.objects.all()
		serializer = self.serializer_class(queryset, many=True)
		return Response({
			"post": serializer.data,
			"has_more": is_there_more_data(request)
		})
