from .models import Profile, FriendRequest
from rest_framework import serializers


from django.http import JsonResponse

class UserFriendListSerializer(serializers.ModelSerializer):

    friends = serializers.SerializerMethodField()
    user = serializers.SerializerMethodField()

    def get_user(self, obj):
        return obj.user.username

    def get_friends(self, obj):
        # return obj.friends.obj.user.username.friends

        # queryset = Profile.objects.filter(user=1).values()
        # return JsonResponse({"models_to_return": list(queryset)})
        # test=['1', '2', '3']

        # test= Profile.objects.all()
        queryset = Profile.objects.filter(user=1).values()

        return JsonResponse({"models_to_return": list(queryset)})

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
