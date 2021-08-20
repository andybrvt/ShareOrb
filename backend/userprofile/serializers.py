from . import models
from django.contrib.auth import authenticate
from rest_framework import serializers
from allauth.account import app_settings as allauth_settings
from allauth.utils import email_address_exists
from allauth.account.adapter import get_adapter
from allauth.account.utils import setup_user_email
from userprofile.models import WaitListEmails
from userprofile.models import CustomNotification
from userprofile.models import PendingSocialPics
from mySocialCal.serializers import SocialCalCellSerializer
from mySocialCal.serializers import SocialCalCellMiniSerializer
from mySocialCal.serializers import SocialCalItemsSerializer
from mySocialCal.models import SocialCalCell
from mySocialCal.models import SocialCalEvent
from mySocialCal.models import SocialCalItems
from mySocialCal.serializers import SocialCalEventSerializer
# Used in React infinite in views.py
# Purpose: Grabbing fields of both person info and post info
class PostUserSerializer(serializers.ModelSerializer):
    friends = serializers.SerializerMethodField()
    def get_friends(self, obj):
        list = []
        for i in obj.friends.all():
            user = i.username
            list.append(user)
        return list
    class Meta:
	    model = models.User
	    fields = ('id', 'username','first_name', 'last_name', 'email', 'bio', 'friends')



# Used in UserListView, UserDetailView in views.py
# Purpose: UserListView it shows a list and UserDetailView grabbing person info

class FollowUserSerializer(serializers.ModelSerializer):
    # This is for the follower and followering list
    class Meta:
        model = models.User
        fields = ('id', 'username', 'first_name', 'last_name', 'profile_picture')


class SuggestedUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.User
        fields = (
            "id",
            "username",
            "first_name",
            "last_name",
            "profile_picture",
            "get_followers"
        )
    def to_representation(self, instance):
        data = super().to_representation(instance)
        followerList = []

        for user in data['get_followers']:
            userPerson = FollowUserSerializer(models.User.objects.get(username = user)).data
            followerList.append(userPerson)

        data['get_followers'] = followerList
        return data




class UserSerializer(serializers.ModelSerializer):
    # the ReadOnlyField allow that field to only be read only
    # friends = serializers.SerializerMethodField()
    def get_friends(self, obj):
        list = []
        for i in obj.friends.all():
            user = i.username
            list.append(user)
        return list



    get_posts = serializers.StringRelatedField(many = True)
    get_following = serializers.StringRelatedField(many = True)
    get_followers = serializers.StringRelatedField(many = True)
    get_socialCal = serializers.StringRelatedField(many = True)
    get_socialEvents = serializers.StringRelatedField(many = True)
    get_allPost = serializers.StringRelatedField(many  = True)
    get_sent_follow_request = serializers.StringRelatedField(many = True)
    get_follow_request = serializers.StringRelatedField(many = True)


    class Meta:
        model = models.User
        fields = (
         'id',
         'username',
         'first_name',
         'last_name',
         'bio',
         'profile_picture',
         "get_posts",
         'get_following',
         'get_followers',
         'get_socialCal',
         'get_socialEvents',
         'friends',
         'get_allPost',
         'phone_number',
         'email',
         'dob',
         'private',
         'requested',
         'get_sent_follow_request',
         'get_follow_request',
         'showIntialInstructions',
         "notificationSeen",
         "date_joined"
         )
    def to_representation(self, instance):
        data = super().to_representation(instance)
        followerList = []
        followingList = []
        socialCalList = []
        friendList = []
        postList = []
        socialEventList = []
        allPostList = []
        sentRequestList = []
        requestList = []
        for user in data['get_following']:
            userPerson = FollowUserSerializer(models.User.objects.get(username = user)).data
            followingList.append(userPerson)

        for user in data['get_followers']:
            userPerson = FollowUserSerializer(models.User.objects.get(username = user)).data
            followerList.append(userPerson)

        for user in data['get_sent_follow_request']:
            userPerson = FollowUserSerializer(models.User.objects.get(username = user)).data
            sentRequestList.append(userPerson)


        for user in data['get_follow_request']:
            userPerson = FollowUserSerializer(models.User.objects.get(username = user)).data
            requestList.append(userPerson)

        for socialCells in data['get_socialCal']:
            socialCell = SocialCalCellSerializer(models.SocialCalCell.objects.get(id = socialCells)).data
            socialCalList.append(socialCell)

        for friends in data['friends']:
            friend = FollowUserSerializer(models.User.objects.get(id = friends)).data
            friendList.append(friend)

        for posts in data['get_posts']:
            post = MiniPostSerializer(models.Post.objects.get(id = posts)).data
            postList.append(post)

        for socialEvents in data['get_socialEvents']:
            socialEvent = SocialCalEventSerializer(models.SocialCalEvent.objects.get(id = socialEvents)).data
            socialEventList.append(socialEvent)
        for allPosts in data['get_allPost']:
            allPost = UserSocialNormPostSerializer(models.UserSocialNormPost.objects.get(id = allPosts)).data
            allPostList.append(allPost)
        data['get_following'] = followingList
        data['get_followers'] = followerList
        data['get_socialCal'] = socialCalList
        data['friends']  = friendList
        data['get_posts'] = postList
        data['get_socialEvents'] = socialEventList
        data['get_allPost'] = allPostList
        data['get_sent_follow_request'] = sentRequestList
        data['get_follow_request'] = requestList
        return data

class UserExploreMobileSerializer(serializers.ModelSerializer):
    # This fucntion will be used to serialzie the user profile on mobile
    get_following = serializers.StringRelatedField(many = True)
    get_followers = serializers.StringRelatedField(many = True)
    get_sent_follow_request = serializers.StringRelatedField(many = True)
    get_follow_request = serializers.StringRelatedField(many = True)

    class Meta:
        model = models.User
        fields = (
         'id',
         'username',
         'first_name',
         'last_name',
         'bio',
         'profile_picture',
         'get_following',
         'get_followers',
         'phone_number',
         'email',
         'dob',
         'private',
         'requested',
         'get_sent_follow_request',
         'get_follow_request',
         'notificationToken'
        )

    def to_representation(self, instance):
        data = super().to_representation(instance)
        followerList = []
        followingList = []
        sentRequestList = []
        requestList = []

        for user in data['get_following']:
            userPerson = FollowUserSerializer(models.User.objects.get(username = user)).data
            followingList.append(userPerson)

        for user in data['get_followers']:
            userPerson = FollowUserSerializer(models.User.objects.get(username = user)).data
            followerList.append(userPerson)

        for user in data['get_sent_follow_request']:
            userPerson = FollowUserSerializer(models.User.objects.get(username = user)).data
            sentRequestList.append(userPerson)

        for user in data['get_follow_request']:
            userPerson = FollowUserSerializer(models.User.objects.get(username = user)).data
            requestList.append(userPerson)



        data['get_following'] = followingList
        data['get_followers'] = followerList
        data['get_sent_follow_request'] = sentRequestList
        data['get_follow_request'] = requestList

        return data

class UserExploreSerializer(serializers.ModelSerializer):
    # This function will be used to serialize the user profile, this will help
    # with the run time. Since the user profile you dont need that much, only
    #  basic info, followers, following, and for soical cal cell you just need
    #  cover pic

    get_following = serializers.StringRelatedField(many = True)
    get_followers = serializers.StringRelatedField(many = True)
    get_socialCal = serializers.StringRelatedField(many = True)
    get_socialEvents = serializers.StringRelatedField(many = True)
    get_sent_follow_request = serializers.StringRelatedField(many = True)
    get_follow_request = serializers.StringRelatedField(many = True)


    class Meta:
        model = models.User
        fields = (
         'id',
         'username',
         'first_name',
         'last_name',
         'bio',
         'profile_picture',
         'get_following',
         'get_followers',
         'get_socialCal',
         'get_socialEvents',
         'phone_number',
         'email',
         'dob',
         'private',
         'requested',
         'get_sent_follow_request',
         'get_follow_request',
        )

    def to_representation(self, instance):
        data = super().to_representation(instance)
        followerList = []
        followingList = []
        socialCalList = []
        socialEventList = []
        sentRequestList = []
        requestList = []

        for user in data['get_following']:
            userPerson = FollowUserSerializer(models.User.objects.get(username = user)).data
            followingList.append(userPerson)

        for user in data['get_followers']:
            userPerson = FollowUserSerializer(models.User.objects.get(username = user)).data
            followerList.append(userPerson)

        for user in data['get_sent_follow_request']:
            userPerson = FollowUserSerializer(models.User.objects.get(username = user)).data
            sentRequestList.append(userPerson)

        for user in data['get_follow_request']:
            userPerson = FollowUserSerializer(models.User.objects.get(username = user)).data
            requestList.append(userPerson)

        for socialCells in data['get_socialCal']:
            socialCell = SocialCalCellMiniSerializer(models.SocialCalCell.objects.get(id = socialCells)).data
            socialCalList.append(socialCell)

        for socialEvents in data['get_socialEvents']:
            socialEvent = SocialCalEventSerializer(models.SocialCalEvent.objects.get(id = socialEvents)).data
            socialEventList.append(socialEvent)

        data['get_following'] = followingList
        data['get_followers'] = followerList
        data['get_socialCal'] = socialCalList
        data['get_socialEvents'] = socialEventList
        data['get_sent_follow_request'] = sentRequestList
        data['get_follow_request'] = requestList

        return data


class UserSocialEventSerializer(serializers.ModelSerializer):
    # This will help serialzie the user just to get the socialevents. This will
    # help avoid getting too much infomration
    get_socialEvents = serializers.StringRelatedField(many = True)
    class Meta:
        model = models.User
        fields = ("id","username", "get_socialEvents")

    def to_representation(self, instance):
        data = super().to_representation(instance)
        socialEventList = []
        for socialEvents in data['get_socialEvents']:
            socialEvent = SocialCalEventSerializer(models.SocialCalEvent.objects.get(id = socialEvents)).data
            socialEventList.append(socialEvent)
        data['get_socialEvents'] = socialEventList
        return data




class UserSocialCalSerializer(serializers.ModelSerializer):

    # This serializer is used mostly for the social cal to make the run time
    # more efficent

    get_socialCal = serializers.StringRelatedField(many = True)


    class Meta:
        model = models.User
        fields = ("get_socialCal",)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        socialCalList = []
        for socialCells in data['get_socialCal']:
            socialCell = SocialCalCellSerializer(models.SocialCalCell.objects.get(id = socialCells)).data
            socialCalList.append(socialCell)
        data['get_socialCal'] = socialCalList
        return data




class SimpleProfileEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.User
        fields = ('profile_picture', 'username', 'first_name', 'bio')




class FollowSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.UserFollowing
        fields = ('person_following',  'person_getting_followers', 'created')
# https://stackoverflow.com/questions/17280007/retrieving-a-foreign-key-value-with-django-rest-framework-serializers




class CommentSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Comment
        fields = "__all__"

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['commentUser'] = FollowUserSerializer(models.User.objects.get(id = data['commentUser'])).data
        return data

class ImageSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.ImageModel
        fields = "__all__"

class MiniPostSerializer(serializers.ModelSerializer):
    # Mini version of the PostSerializer, this is used to limit the information
    # sent and used
    post_images = serializers.StringRelatedField(many = True)
    user = serializers.StringRelatedField(many = False)

    class Meta:
        model = models.Post
        # fields = ('id', 'caption', 'created_at', 'updated_at','image', 'like_count','like_condition','user')
        fields = ('id', 'post_images', 'user')




class PostSerializer(serializers.ModelSerializer):

    # post_comments = serializers.ReadOnlyField()
    post_comments = serializers.StringRelatedField(many = True)
    # post_images = ImageSerializer(many= True, read_only=True)
    post_images = serializers.StringRelatedField(many = True)


    class Meta:
        model = models.Post
        # fields = ('id', 'caption', 'created_at', 'updated_at','image', 'like_count','like_condition','user')
        fields = ('id', 'caption', 'created_at', 'updated_at', 'like_count','like_condition', 'people_like', 'user', 'post_comments', 'post_images',)


    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['user'] = FollowUserSerializer(models.User.objects.get(pk=data['user'])).data
        comment_list = []
        userLike_list=[]


        for comments in data['post_comments']:
            comment = CommentSerializer(models.Comment.objects.get(id = comments)).data
            comment_list.append(comment)
        data['post_comments'] = comment_list

        for user in data['people_like']:
            likePerson = FollowUserSerializer(models.User.objects.get(id = user)).data
            userLike_list.append(likePerson)

        data['people_like'] = userLike_list
        # if (len(data['post_images']) > 0):
        #     list = []
        #     for pictures in ImageSerializer(models.ImageModel.objects.filter(imageList = 1)).data:
        #         list.append(pictures)
        #     data['post_images'] = list
        return data


class NewPostSerializer(serializers.ModelSerializer):

    # post_comments = serializers.ReadOnlyField()
    post_comments = CommentSerializer(many= True, read_only=True)
    class Meta:
        model = models.Post
        # fields = ('id', 'caption', 'created_at', 'updated_at','image', 'like_count','like_condition','user')
        fields = ('id', 'like_count','like_condition', 'user', 'post_comments')


    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['user'] = PostUserSerializer(models.User.objects.get(pk=data['user'])).data
        return data



# custom serializer for signup-- view 127.0.0.1:8000/rest-auth
class RegisterSerializer(serializers.Serializer):

    username = serializers.CharField(required = True, write_only = True)
    first_name = serializers.CharField(required=True, write_only=True)
    last_name = serializers.CharField(required=True, write_only=True)
    dob = serializers.CharField(required=True, write_only=True)
    email = serializers.EmailField(required=allauth_settings.EMAIL_REQUIRED)
    password1 = serializers.CharField(required=True, write_only=True)
    password2 = serializers.CharField(required=True, write_only=True)

    class Meta:
        model = models.User
        fields = ('id', 'username', 'dob', 'first_name', 'last_name', 'email', 'password1 ', 'password2')

    def validate_email(self, email):
        email = get_adapter().clean_email(email)
        if allauth_settings.UNIQUE_EMAIL:
            if email and email_address_exists(email):
                raise serializers.ValidationError(
                    ("A user is already registered with this e-mail address."))
        return email

    def validate_username(self, username):
        username = get_adapter().clean_username(username)
        if models.User.objects.filter(username = username).exists():
            raise serializers.ValidationError(
                ("The username already exist.")
            )
        return username

    def validate_password1(self, password):
        return get_adapter().clean_password(password)

    def validate(self, data):
        if data['password1'] != data['password2']:
            raise serializers.ValidationError(
                ("The two password fields didn't match."))

        return data

    def get_cleaned_data(self):
        return {
            'username': self.validated_data.get('username', ''),
            'first_name': self.validated_data.get('first_name', ''),
            'last_name': self.validated_data.get('last_name', ''),
            # 'bio': self.validated_data.get('bio', ''),
            # 'dob': self.validated_data.get('dob', ''),
            # 'phone_number': self.validated_data.get('phone_number', ''),
            'password1': self.validated_data.get('password1', ''),
            'email': self.validated_data.get('email', ''),

        }

    def save(self, request):
        adapter = get_adapter()
        user1 = adapter.new_user(request)
        self.cleaned_data = self.get_cleaned_data()
        adapter.save_user(request, user1, self)
        # user1.bio = self.cleaned_data.get('bio')
        # user1.dob = self.cleaned_data.get('dob')
        # user1.phone_number = self.cleaned_data.get('phone_number')
        setup_user_email(request, user1, [])
        user1.save()
        return user1



class FriendRequestSerializer(serializers.ModelSerializer):
    to_user = serializers.SerializerMethodField()
    from_user = serializers.SerializerMethodField()
    def get_to_user(self,obj):
        return obj.to_user.username
    def get_from_user(self, obj):
        return obj.from_user.username

    class Meta:
        model = models.FriendRequest
        fields = ( 'to_user', 'from_user' )


class FollowerSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.UserFollowing
        fields = ('person_following', 'person_getting_followers', 'created')



class NotificationSerializer(serializers.ModelSerializer):

    get_pendingImages = serializers.StringRelatedField(many = True)

    class Meta:
        model = CustomNotification
        # fields = "__all__"
        fields = (
            'id',
            'type',
            'recipient',
            'actor',
            'verb',
            'description',
            'timestamp',
            'minDate',
            'maxDate',
            'eventId',
            'pendingEventTitle',
            'pendingEventContent',
            'pendingEventLocation',
            'pendingEventCurId',
            'pendingCalendarOwnerId',
            'pendingEventDate',
            'pendingEventStartTime',
            'pendingEventEndTime',
            'get_pendingImages',
            "itemId"
        )

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['actor'] = FollowUserSerializer(models.User.objects.get(pk=data['actor'])).data
        pendingImageList = []
        for images in data['get_pendingImages']:
            image = PendingSocialPicsSerializer(models.PendingSocialPics.objects.get(id = images)).data
            pendingImageList.append(image)
        data['get_pendingImages'] = pendingImageList
        return data

class PendingSocialPicsSerializer(serializers.ModelSerializer):
    # This serializer will serialized the pendign events
    class Meta:
        model = PendingSocialPics
        fields = ("id", "itemImage", "creator")

class UserSocialNormPostRelatedField(serializers.RelatedField):
    def to_representation(self, instance):
        if isinstance(instance, models.User):
            # user = UserSerializer(models.User.objects.get(id = instance.id)).data
            return instance.id
        elif isinstance(instance, models.Post):
            post = MiniPostSerializer(models.Post.objects.get(id = instance.id)).data
            return post
        elif isinstance(instance, SocialCalCell):
            socialPost = SocialCalCellSerializer(SocialCalCell.objects.get(id = instance.id)).data
            return socialPost

class UserSocialNormPostSerializer(serializers.ModelSerializer):
    owner = UserSocialNormPostRelatedField(read_only = True)
    post = UserSocialNormPostRelatedField(read_only = True)

    class Meta:
        model = models.UserSocialNormPost
        fields = ('id', 'owner', 'post', 'post_date')


class WaitListEmailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = WaitListEmails
        fields = ('email')
