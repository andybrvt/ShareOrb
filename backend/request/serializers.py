from . import models
from rest_framework import serializers
from userprofile.models import User
from mySocialCal.serializers import SocialCalUserSerializer

class UserRequestSerializer(serializers.ModelSerializer):

    get_requestComments = serializers.StringRelatedField(many= True)

    class Meta:
        model = models.UserRequest
        fields = (
            'id',
            'requester',
            'request',
            'created_at',
            'people_like',
            'response',
            'get_requestComments'
        )
    def to_representation(self, instance):
        data = super().to_representation(instance)

        data['requester'] = SocialCalUserSerializer(User.objects.get(id = data['requester'])).data
        return data


class RequestItemCommentSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.RequestComment
        fields = "__all__"

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['commentUser'] = SocialCalUserSerializer(User.objects.get(id = data['commentUser'])).data

        return data

class ResponseVideoSerializers(serializers.ModelSerializer):

    class Meta:
        model = models.UserResponse
        fields = (
            "id",
            "video"
        )
