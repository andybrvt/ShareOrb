from . import models
from rest_framework import serializers
from userprofile.models import User

class SocialCalCellSerializer(serializers.ModelSerializer):


    get_socialCalItems  = serializers.StringRelatedField(many = True)
    get_socialCalEvent = serializers.StringRelatedField(many = True)
    get_socialCalComment = serializers.StringRelatedField(many = True)


    class Meta:
        model = models.SocialCalCell
        fields = (
         'id',
         'socialCalUser',
         'socialCaldate',
         'testDate',
         'people_like',
         'coverPic',
         'get_socialCalItems',
         'get_socialCalEvent',
         'get_socialCalComment')

    def to_representation(self, instance):
        data = super().to_representation(instance)
        cal_comments = []
        cal_items = []
        cal_events = []
        cal_likes = []
        for comments in data['get_socialCalComment']:
            comment = SocialCalCommentSerializer(models.SocialCalComment.objects.get(id = comments)).data
            cal_comments.append(comment)
        for items in data['get_socialCalItems']:
            item = SocialCalItemsSerializer(models.SocialCalItems.objects.get(id = items)).data
            cal_items.append(item)
        for events in data['get_socialCalEvent']:
            event = SocialCalEventSerializer(models.SocialCalEvent.objects.get(id = events)).data
            cal_events.append(event)
        for likes in data['people_like']:
            like = SocialCalUserSerializer(User.objects.get(id =likes)).data
            cal_likes.append(like)
        data['get_socialCalComment'] = cal_comments
        data['get_socialCalItems'] = cal_items
        data['get_socialCalEvent'] = cal_events
        data['people_like'] = cal_likes
        data['socialCalUser'] = SocialCalUserSerializer(User.objects.get(id = data['socialCalUser'])).data
        return data

class SocialCalUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'profile_picture')

class SocialCalItemsSerializer(serializers.ModelSerializer):


    class Meta:
        model = models.SocialCalItems
        fields = ('id','socialItemType', 'socialItemCaption', 'created_at', 'creator',  'itemUser', 'itemImage' )

class SocialCalEventSerializer(serializers.ModelSerializer):

    get_socialEventMessage = serializers.StringRelatedField(many = True)
    class Meta:
        model = models.SocialCalEvent
        fields = ('__all__')

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['host'] = SocialCalUserSerializer(User.objects.get(id = data['host'])).data
        personList = []
        messageList = []
        for people in data['persons']:
            person = SocialCalUserSerializer(User.objects.get(id = people)).data
            personList.append(person)
        for messages in data['get_socialEventMessage']:
            message = SocialEventMessagesSerializer(models.SocialEventMessages.objects.get(id = messages)).data
            messageList.append(message)
        data['persons'] = personList
        data['get_socialEventMessage'] = messageList
        return data

class SocialEventMessagesSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.SocialEventMessages
        fields = "__all__"

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['messageUser'] = SocialCalUserSerializer(User.objects.get(id = data['messageUser'])).data
        return data

class SocialCalCommentSerializer (serializers.ModelSerializer):


    class Meta:
        model = models.SocialCalComment
        fields = ('id','body', 'created_on', 'commentUser' )

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['commentUser'] = SocialCalUserSerializer(User.objects.get(id = data['commentUser'])).data
        return data

class SocialEventBackgroundSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.SocialCalEvent
        fields = ("backgroundImg",)
