from .models import Profile, FriendRequest
from rest_framework import serializers


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
