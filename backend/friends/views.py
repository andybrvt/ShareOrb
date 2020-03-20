from django.shortcuts import render

# Create your views here.
from django.conf import settings
from django.contrib.auth import get_user_model
from django.http import HttpResponseRedirect
from django.shortcuts import render, get_object_or_404

from .models import Profile, FriendRequest
from django.http import HttpResponse

from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import ListUserSerializer
from rest_framework import status




User = get_user_model()

class users_list(APIView):


    def get(self, request, slug, format=None):
        # print(Profile.objects.filter(username=username)
        targetUser =  Profile.objects.filter(slug=slug)
        print(targetUser)
        print('RIGHT BEFORE')
        print(targetUser.values())
        user_followers = targetUser.friends.all()
        print('hi, how ware you')
        print(user_followers)
        serializer = ListUserSerializer(user_followers, many=True, context={"request": request})


        return Response(data=serializer.data, status=status.HTTP_200_OK)


# def send_friend_request(request, id):
# 	if request.user.is_authenticated():
# 		user = get_object_or_404(User, id=id)
# 		frequest, created = FriendRequest.objects.get_or_create(
# 			from_user=request.user,
# 			to_user=user)
# 		return HttpResponseRedirect('/users')
#
# def cancel_friend_request(request, id):
# 	if request.user.is_authenticated():
# 		user = get_object_or_404(User, id=id)
# 		frequest = FriendRequest.objects.filter(
# 			from_user=request.user,
# 			to_user=user).first()
# 		frequest.delete()
# 		return HttpResponseRedirect('/users')
#
# def accept_friend_request(request, id):
# 	from_user = get_object_or_404(User, id=id)
# 	frequest = FriendRequest.objects.filter(from_user=from_user, to_user=request.user).first()
# 	user1 = frequest.to_user
# 	user2 = from_user
# 	user1.profile.friends.add(user2.profile)
# 	user2.profile.friends.add(user1.profile)
# 	frequest.delete()
# 	return HttpResponseRedirect('/users/{}'.format(request.user.profile.slug))
#
# def delete_friend_request(request, id):
# 	from_user = get_object_or_404(User, id=id)
# 	frequest = FriendRequest.objects.filter(from_user=from_user, to_user=request.user).first()
# 	frequest.delete()
# 	return HttpResponseRedirect('/users/{}'.format(request.user.profile.slug))
#
# def profile_view(request, slug):
# 	# print(slug)
# 	test=Profile.objects.all()
# 	# for element in test:
# 	# 	print(element)
# 	p = Profile.objects.filter(slug=slug).first()
# 	print(p)
# 	u = p.user
# 	sent_friend_requests = FriendRequest.objects.filter(from_user=p.user)
# 	rec_friend_requests = FriendRequest.objects.filter(to_user=p.user)
#
# 	friends = p.friends.all()
#
# 	# is this user our friend
# 	button_status = 'none'
# 	print("START OF THIS POINT")
# 	print(request)
# 	print(request.user)
# 	print("GOT TO THIS POINT")
# 	if p not in request.user.profile.friends.all():
# 		button_status = 'not_friend'
#
# 		# if we have sent him a friend request
# 		if len(FriendRequest.objects.filter(
# 			from_user=request.user).filter(to_user=p.user)) == 1:
# 				button_status = 'friend_request_sent'
#
# 	context = {
# 		'u': u,
# 		'button_status': button_status,
# 		'friends_list': friends,
# 		'sent_friend_requests': sent_friend_requests,
# 		'rec_friend_requests': rec_friend_requests
# 	}
# 	return HttpResponse(request.body)
# 	# return render(request, " ", context)
