from .models import Profile, FriendRequest, CustomNotification;
from rest_framework import serializers;
from userprofile.models import User;


from django.http import JsonResponse

class UserFriendListSerializer(serializers.ModelSerializer):

    class Meta:
        model = Profile
        fields = (
            'user',
            'slug',
            'friends',

        )


class FriendRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = FriendRequest
        fields = ( 'to_user', 'from_user' )

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        exclude = ("password",)

class NotificationSerializer(serializers.ModelSerializer):
    # this is just to show who can act on it and that will be
    # the current user
    actor = UserSerializer(read_only=True)

    class Meta:
        model = CustomNotification
        fields = "__all__"
