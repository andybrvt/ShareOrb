from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework import generics
from rest_framework import viewsets
from . import models
from . import serializers
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST


# Create your views here.




# class UserDetailView(generics.RetrieveAPIView):
# 	queryset = models.User.objects.all()
# 	lookup_field = 'username'
# 	serializer_class = serializers.PostUserSerializer


class UserIDView(APIView):
    def get(self, request, *args, **kwargs):
        print(request.COOKIES)
        print(request)
        print(request.user)
        print(request.user.id)
        # print(user)
        # print(models.User.objects.all())
        # temp=(models.User.objects)
        # print(temp)
        # print(temp.get(id=2).id)



        return Response({'userID': request.user.id }, status=HTTP_200_OK)


class PostListView(viewsets.ModelViewSet):
	queryset = models.Post.objects.all().order_by('-created_at', '-updated_at')
	serializer_class = serializers.PostSerializer

class PostCreateView(generics.ListCreateAPIView):
    # permission_classes = (IsAuthenticated,)
    queryset = models.Post.objects.all().order_by('created_at', '-updated_at')
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


def current_user(request):
    """
    Determine the current user by their token, and return their data
    """
    permission_classes = (IsAuthenticated,)
    serializer = serializers.UserSerializer(request.user)
    return Response(serializer.data)
