from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework import generics
from rest_framework import viewsets
from . import models
from . import serializers
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST
from rest_framework.decorators import api_view
from django.shortcuts import render, get_object_or_404
from .forms import CommentForm

# Create your views here.
# Views will take in models and serializers and then displays it
#  You can also add in functions (def) to modify stuff



# class UserDetailView(generics.RetrieveAPIView):
# 	queryset = models.User.objects.all()
# 	lookup_field = 'username'
# 	serializer_class = serializers.PostUserSerializer


class UserIDView(APIView):
    def get(self, request, *args, **kwargs):
        return Response({'userID': request.user.id,'currentUser': request.user.username}, status=HTTP_200_OK)


class PostTest(generics.ListAPIView):
    serializer_class = serializers.PostSerializer
    def get_queryset(self):
        queryset = models.Post.objects.all()
        return queryset



# Grabs ALL of the users
class ListAll(generics.ListAPIView):
    queryset = models.User.objects.all()
    serializer_class = serializers.UserSerializer

class UserListView(generics.ListAPIView):
    queryset = models.User.objects.all()
    serializer_class = serializers.UserSerializer

# Grabs individual user in the url with username
class UserDetailView(generics.RetrieveAPIView):
    queryset = models.User.objects.all()
    lookup_field = 'username'
    serializer_class= serializers.UserSerializer

# Create a post with ALL the functions
class PostListView(viewsets.ModelViewSet):
	queryset = models.Post.objects.all().order_by('-created_at', '-updated_at')
	serializer_class = serializers.PostSerializer


# Needed for ReactInfiniteView grabs offset and limit in infinite scroll
def infinite_filter(request):
	limit = request.GET.get('limit')
	offset = request.GET.get('offset')
	return models.Post.objects.all()[int(offset): int(offset) + int(limit)]

# Needed for ReactInfiniteView checks if there is more data
def is_there_more_data(request):
	offset =request.GET.get('offset')
	if int(offset) > models.Post.objects.all().count():
		return False
	return True

# Infinite Loop
class ReactInfiniteView(viewsets.ModelViewSet):
    serializer_class = serializers.PostSerializer

    def get_queryset(self):
        queryset = infinite_filter(self.request)
        return queryset

    def list(self, request):
        user_friends=self.request.user.friends.values('id')
        print(user_friends)
        # all users OTHER than current user and current user's friends
        UsersNewsFeed = models.User.objects.exclude(id__in=user_friends).exclude(id=self.request.user.id)
        print(UsersNewsFeed)
        #Query set of all User objects of current user and current user's friends
        UserPlusUserFriends = models.User.objects.exclude(id__in=UsersNewsFeed.values_list('id', flat=True))
        print("made it")
        print(UserPlusUserFriends)
        test= models.Post.objects.filter(user=self.request.user)
        print(test)
        big_list=[]
        for element in UserPlusUserFriends:
            temp=models.Post.objects.filter(user=element)
            for element2 in temp:
                big_list.append(element2.pk)
        print(big_list)
        queryset = models.Post.objects.filter(pk__in=big_list).order_by('-created_at', '-updated_at')
        serializer = self.serializer_class(queryset, many=True)
        return Response({
            "post": serializer.data,
			"has_more": is_there_more_data(request)
		})

@api_view(['GET'])
def current_user(request):
    """
    Determine the current user by their token, and return their data
    """
    serializer = serializers.PostUserSerializer(request.user)
    return Response(serializer.data)

# Views from here and down are for friends

# Grabs everyone but current user
class UserList(generics.ListAPIView):
    serializer_class = serializers.UserSerializer
    def get_queryset(self):
        list = []
        temp=(self.request.user.friends.all())
        for i in temp:
            list.append(i.username)
        list.append(self.request.user)

        # Your can exclude a list by using keyword __in
        # This is filtering by username in the list
        queryset = models.User.objects.exclude(username__in = list)
        return queryset



# List of friend request that is sent out
class FriendRequestList(generics.ListAPIView):
	serializer_class = serializers.FriendRequestSerializer
	queryset = models.FriendRequest.objects.all()


# This sends out a friend request
class SendFriendRequest(APIView):
    def post(self, request, username, *args, **kwargs):
        user = get_object_or_404(models.User, username = username )
        frequest, created = models.FriendRequest.objects.get_or_create(
            from_user=request.user,
            to_user=user)
        return Response('request sent')

class FriendNotification(generics.ListAPIView):
	serializer_class = serializers.NotificationSerializer
	queryset = models.CustomNotification.objects.all()

class onDeleteNotifcation(generics.RetrieveDestroyAPIView):
    serializer_class = serializers.NotificationSerializer
    lookup_field = 'id'
    queryset = models.CustomNotification.objects.all()

# Cancel from sender's end
class CancelFriendRequest(APIView):
	def post(self, request, username, *args, **kwargs):
		user = get_object_or_404(models.User, username = username)
		frequest = models.FriendRequest.objects.filter(
			from_user=request.user,
			to_user=user)
		frequest.delete()
		return Response('request cancel')

# Receiver accepts friend request'
# user1.profile.friends.add(user2.profile)

class AcceptFriendRequest(APIView):
    def post(self, request, username, *args, **kwargs):
        from_user = get_object_or_404(models.User, username = username)
        frequest = models.FriendRequest.objects.filter(from_user=from_user, to_user=request.user).first()
        user1 = frequest.to_user
        user2 = from_user
        user1.friends.add(user2)
        user2.friends.add(user1)
        frequest.delete()
        return Response('request accept')

# Delete request from receiver's end
class DeleteFriendRequest(APIView):
	def post(self, request, username, *args, **kwargs):
		from_user = get_object_or_404(models.User, username = username)
		frequest = models.FriendRequest.objects.filter(from_user=from_user, to_user=request.user)
		frequest.delete()
		return Response('request delete')


class DeleteFriends(APIView):
    def post(self, request, username, *args, **kwargs):
        userSelected = get_object_or_404(models.User, username = username)
        currUser=models.User.objects.get(username=request.user)
        currUser.friends.remove(userSelected)
        return Response('deleted friend')




class FriendRequestsToUser(generics.ListAPIView):
    serializer_class = serializers.FriendRequestSerializer
    def get_queryset(self):
        queryset = models.FriendRequest.objects.filter(to_user = self.request.user)
        return queryset


class AddOneLikeToPost(APIView):
    def post(self, request, id, *args, **kwargs):
        # grabs post based off of id in newsfeed
        grabPost= models.Post.objects.get(id=id)
        print(grabPost)
        print(grabPost.like_count)
        if(grabPost.like_condition==False):
            grabPost.like_count+=1
            grabPost.like_condition=True
        else:
            grabPost.like_count-=1
            grabPost.like_condition=False

        print(grabPost.like_count)
        grabPost.save()
        return Response('View post in console')


class postCommentTest(APIView):
    def post(self, request, id, *args, **kwargs):
        post = get_object_or_404(Post, slug=id)
        comments = post.comments.filter(active=True)
        new_comment = None
        # Comment posted
        if request.method == 'POST':
            comment_form = CommentForm(data=request.POST)
            if comment_form.is_valid():

                # Create Comment object but don't save to database yet
                new_comment = comment_form.save(commit=False)
                # Assign the current post to the comment
                new_comment.post = post
                # Save the comment to the database
                new_comment.save()
        else:
            comment_form = CommentForm()
            return Response('View comment')


class post_detail(APIView):
    def post(self, request, id, *args, **kwargs):
        post = get_object_or_404(Post, slug=slug)
        comments = post.comments.filter(active=True).order_by("-created_on")[0:5]
        comments[3]='test'
        # for now fetch the first 5 comments
        new_comment = None
        # Comment posted
        # if request.method == 'POST':
        #     comment_form = CommentForm(data=request.POST)
        #     if comment_form.is_valid():

        #         # Create Comment object but don't save to database yet
        #         new_comment = comment_form.save(commit=False)
        #         # Assign the current post to the comment
        #         new_comment.post = post
        #         # Save the comment to the database
        #         new_comment.save()
        # else:
        #     comment_form = CommentForm()
        return Response('View comment')


class ViewComment(APIView):
    def post(self, request, postID, commentID, *args, **kwargs):
#         # grabs post based off of id in newsfeed
        grabPost= models.Post.objects.get(id=postID)
        print(grabPost)
        print(grabPost.like_condition)
        grabComment= models.Comment.objects.get(id=commentID)
        print(grabComment)
        print(grabComment.id)
        # if(grabComment.id in grabPost.comments):
        # check if comment id is in list of grabpost.comemnts


        # grabComment=grabPost.get(id=commentID)
        # print(grabComment)
#         print(grabComment.caption)
        return Response('Grabbing the comment')
