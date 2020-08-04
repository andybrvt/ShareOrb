from . import models
from django.contrib.auth import authenticate
from rest_framework import serializers
from allauth.account import app_settings as allauth_settings
from allauth.utils import email_address_exists
from allauth.account.adapter import get_adapter
from allauth.account.utils import setup_user_email

from userprofile.models import CustomNotification

# Used in React infinite in views.py
# Purpose: Grabbing fields of both person info and post info
class PostUserSerializer(serializers.ModelSerializer):
    friends = serializers.SerializerMethodField()
    def get_friends(self, obj):
        # print(obj.friends.all().first().username)
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

class UserSerializer(serializers.ModelSerializer):
    # the ReadOnlyField allow that field to only be read only
    friends = serializers.SerializerMethodField()
    def get_friends(self, obj):
        list = []
        for i in obj.friends.all():
            user = i.username
            list.append(user)
        return list
    get_posts = serializers.StringRelatedField(many = True)
    get_following = serializers.StringRelatedField(many = True)
    get_followers = serializers.StringRelatedField(many = True)

    class Meta:
        model = models.User
        fields = ('id',
         'username',
         'first_name',
         'last_name',
         'bio',
         'profile_picture',
         "get_posts",
         'get_following',
         'get_followers',
         'friends',
         'slug')


class ProfilePicSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.User
        fields = ('profile_picture',)


class FollowSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.UserFollowing
        fields = ('person_following',  'person_getting_followers', 'created')
# https://stackoverflow.com/questions/17280007/retrieving-a-foreign-key-value-with-django-rest-framework-serializers



class CommentSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Comment
        fields = "__all__"


class ImageSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.ImageModel
        fields = "__all__"


class PostSerializer(serializers.ModelSerializer):

    # post_comments = serializers.ReadOnlyField()
    post_comments = CommentSerializer(many= True, read_only=True)
    post_images = ImageSerializer(many= True, read_only=True)
    class Meta:
        model = models.Post
        # fields = ('id', 'caption', 'created_at', 'updated_at','image', 'like_count','like_condition','user')
        fields = ('id', 'caption', 'created_at', 'updated_at', 'like_count','like_condition', 'people_like', 'user', 'post_comments', 'post_images',)


    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['user'] = PostUserSerializer(models.User.objects.get(pk=data['user'])).data
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

    first_name = serializers.CharField(required=True, write_only=True)
    last_name = serializers.CharField(required=True, write_only=True)
    dob = serializers.CharField(required=True, write_only=True)
    bio = serializers.CharField(required=True, write_only=True)
    email = serializers.EmailField(required=allauth_settings.EMAIL_REQUIRED)
    phone_number = serializers.CharField(required=True, write_only=True)
    password1 = serializers.CharField(required=True, write_only=True)
    password2 = serializers.CharField(required=True, write_only=True)

    class Meta:
        model = models.User
        fields = ('id', 'number', 'dob', 'first_name', 'last_name', 'email', 'phone_number', 'password1 ', 'password2')

    def validate_email(self, email):
        email = get_adapter().clean_email(email)
        if allauth_settings.UNIQUE_EMAIL:
            if email and email_address_exists(email):
                raise serializers.ValidationError(
                    ("A user is already registered with this e-mail address."))
        return email

    def validate_password1(self, password):
        return get_adapter().clean_password(password)

    def validate(self, data):
        if data['password1'] != data['password2']:
            raise serializers.ValidationError(
                _("The two password fields didn't match."))
        return data

    def get_cleaned_data(self):
        return {
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
    actor = UserSerializer(read_only=True)

    class Meta:
        model = CustomNotification
        fields = "__all__"
