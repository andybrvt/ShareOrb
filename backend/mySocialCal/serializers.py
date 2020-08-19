from . import models
from rest_framework import serializers
from userprofile.models import User

class SocialCalCellSerializer(serializers.ModelSerializer):


    get_socialCalItems  = serializers.StringRelatedField(many = True)
    get_socialCalEvent = serializers.StringRelatedField(many = True)
    get_socialCalComment = serializers.StringRelatedField(many = True)


    class Meta:
        model = models.SocialCalCell
        fields = ('socialCalUser',
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
        for comments in data['get_socialCalComment']:
            comment = SocialCalComment(models.SocialCalComment.objects.get(id = comments)).data
            cal_comments.append(comment)
        for items in data['get_socialCalItems']:
            item = SocialCalItemsSerializer(models.SocialCalItems.objects.get(id = items)).data
            cal_items.append(item)
        for events in data['get_socialCalEvent']:
            event = SocialCalEventSerializer(models.SocialCalEvent.objects.get(id = events)).data
            cal_events.append(event)
        data['get_socialCalComment'] = cal_comments
        data['get_socialCalItems'] = cal_items
        data['get_socialCalEvent'] = cal_events
        return data

class SocialCalUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'profile_picture')

class SocialCalItemsSerializer(serializers.ModelSerializer):


    class Meta:
        model = models.SocialCalItems
        fields = ('socialItemType', 'socialItemCaption', 'created_at', 'creator',  'itemUser', 'itemImage' )

class SocialCalEventSerializer(serializers.ModelSerializer):


    class Meta:
        model = models.SocialCalEvent
        fields = ('persons', 'host', 'title', 'content', 'start_time', 'end_time', 'location' )


    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['host'] = SocialCalUserSerializer(User.objects.get(id = data['host'])).data
        personList = []
        for people in data['persons']:
            person = SocialCalUserSerializer(User.objects.get(id = people)).data
            personList.append(person)
        data['persons'] = personList
        return data
class SocialCalComment (serializers.ModelSerializer):


    class Meta:
        model = models.SocialCalComment
        fields = ('body', 'created_on', 'commentUser' )
