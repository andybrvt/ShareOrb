from .models import Profile
from rest_framework import serializers

class UserFriendListSerializer(serializers.ModelSerializer):

    # friends = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = (
            'user',
            'slug',
            'friends',

        )

    def get_following(self, obj):
        if 'request' in self.context:
            request = self.context['request']
            if obj in request.user.friends.all():
                return True
        return False
