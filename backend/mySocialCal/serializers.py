from . import models
from rest_framework import serializers


class SocialCalCellSerializer(serialziers.ModelSerializer):


    class Meta:
        model = models.SocialCalCell
        fields = ('socialCalUser', 'socialCaldate', 'people_like')

class SocialCalItemsSerializer(serializers.ModelSerializer):


    class Meta:
        model = models.SocialCalItems
        fields = ('socialItemType', 'socialItemCaption', 'created_at', 'creator',  'itemUser', 'itemImage' )

class SocialCalEventSerializer(serializers.ModelSerializer):


    class Meta:
        model = models.SocialCalEvent
        fields = ('persons', 'host', 'title', 'content', 'start_time', 'end_time', 'location' )


class SocialCalComment (serializers.ModelSerializer):


    class Meta:
        model = models.SocialCalComment
        fields = ('body', 'created_on', 'commentUser' )
