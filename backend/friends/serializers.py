from .models import Profile, FriendRequest
from rest_framework import serializers

class UserFriendListSerializer(serializers.ModelSerializer):

    # friends = serializers.SerializerMethodField()
    user = serializers.SerializerMethodField()

    def get_user(self, obj):
        return obj.user.username
    class Meta:
        model = Profile
        fields = (
            'user',
            'slug',
            'friends',

        )

class FriendRequestSerialzier(serializers.ModelSerializer):
    class Meta:
        model = FriendRequest
        fields = ( 'to_user', 'from_user' )
