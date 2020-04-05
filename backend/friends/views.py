from django.shortcuts import render

# Create your views here.
from django.conf import settings
from django.contrib.auth import get_user_model
from django.http import HttpResponseRedirect
from django.shortcuts import render, get_object_or_404
from rest_framework.views import APIView
from .models import Profile, FriendRequest, CustomNotification;
from django.http import HttpResponse
from rest_framework import generics
from . import serializers
from . import models
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK
from django.http import JsonResponse
from .serializers import NotificationSerializer
from channels.layers import get_channel_layer









User = get_user_model()

class UserList(generics.ListAPIView):
	serializer_class = serializers.UserFriendListSerializer
	def get_queryset(self):
		queryset = models.Profile.objects.exclude(user = self.request.user)
		return queryset

class UserFriendList(generics.RetrieveAPIView):
    queryset = models.Profile.objects.all()
    lookup_field = 'user'
    serializer_class= serializers.UserFriendListSerializer

class FriendRequestList(generics.ListAPIView):
	serializer_class = serializers.FriendRequestSerializer
	queryset = models.FriendRequest.objects.all()

	# def get_queryset(self):
	# 	queryset = models.Profile.objects.exclude(user = self.request.user)
	# 	return queryset

# def users_list(request):
# 	users = Profile.objects.exclude(user=request.user)
# 	context = {
# 		'users': users
# 	}
# 	print(users)
# 	for element2 in users:
# 		print(element2)
# 	print(request)
# 	print(request.body)
# 	print(context)
#
# 	# return HttpResponse(request.bodyf
# 	# return HttpResponseRedirect('/users')
# 	# return render(request, "accounts/home.html", context)
# 	return HttpResponse(request.body)


class SendFriendRequest(APIView):
    def post(self, request, id, *args, **kwargs):
        user = get_object_or_404(User, id=id)
        frequest, created = models.FriendRequest.objects.get_or_create(
            from_user=request.user,
            to_user=user)
		# the notifications makes a new notification object
        notification = CustomNotification.objects.create(type="friend", recipient=user, actor=request.user, verb="sent you friend request")
        channel_layer = get_channel_layer()
        channel = "notifications_{}".format(user.username)
        async_to_sync(channel_layer.group_send)(
            channel, {
                "type": "notify",  # method name
                "command": "new_notification",
                "notification": json.dumps(NotificationSerializer(notification).data)
            }
        )
        data = {
            'status': True,
            'message': "Request sent.",
        }
        return JsonResponse(data)

class FriendNotification(generics.ListAPIView):
	queryset = models.CustomNotification.object.all()
	serializer_class = 


# Cancel from sender's end
class CancelFriendRequest(APIView):
	def post(self, request, id, *args, **kwargs):
		user = get_object_or_404(User, id=id)
		print(user)
		frequest = models.FriendRequest.objects.filter(
			from_user=request.user,
			to_user=user)
		frequest.delete()
		return Response('request cancel')

class AcceptFriendRequest(APIView):
	def post(self, request, id, *args, **kwargs):
		from_user = get_object_or_404(User, id=id)
		frequest = FriendRequest.objects.filter(from_user=from_user, to_user=request.user).first()
		user1 = frequest.to_user
		user2 = from_user
		user1.profile.friends.add(user2.profile)
		user2.profile.friends.add(user1.profile)
		frequest.delete()
		return Response('request accept')

# Delete request from receiver's end
class DeleteFriendRequest(APIView):
	def post(self, request, id, *args, **kwargs):
		from_user = get_object_or_404(User, id=id)
		frequest = FriendRequest.objects.filter(from_user=from_user, to_user=request.user)
		frequest.delete()
		return Response('request delete')
