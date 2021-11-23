from . import models
from rest_framework import serializers
from userprofile.models import User
from mySocialCal.serializers import SocialCalUserSerializer

class UserRequestSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.UserRequest
        fields = (
            'id',
            'requester',
            'request',
            'created_at',
            'people_like',
            'response'
        )
    def to_representation(self, instance):
        data = super().to_representation(instance)

        data['requester'] = SocialCalUserSerializer(User.objects.get(id = data['requester'])).data
        return data
