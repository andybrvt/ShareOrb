from . import models
from rest_framework import serializers
from userprofile.models import User
# from drf_extra_fields.fields import Base64ImageField


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
         'people_like',
         'coverPic',
         'dayCaption',
         'get_socialCalItems',
         'get_socialCalEvent',
         'get_socialCalComment',
         "actionText",
         "socialCaldate"
         )

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

class SocialCalCellMiniSerializer(serializers.ModelSerializer):
    # this will be used to render the cells in side the social calendar
    #  this is mostly used to ooptimize the the social calendar
    # you would jsut need the cover pic and the events


    get_socialCalEvent = serializers.StringRelatedField(many = True)

    class Meta:
        model = models.SocialCalCell
        fields = (
        'id',
        'socialCalUser',
        'socialCaldate',
        'coverPic',
        'get_socialCalEvent',
        'dayCaption',
        'people_like',
        'get_socialCalComment',
        )

    def to_representation(self, instance):
        data = super().to_representation(instance)
        cal_events = []
        cal_comments = []
        cal_likes = []
        for likes in data['people_like']:
            like = SocialCalUserSerializer(User.objects.get(id =likes)).data
            cal_likes.append(like)
        for comments in data['get_socialCalComment']:
            comment = SocialCalCommentSerializer(models.SocialCalComment.objects.get(id = comments)).data
            cal_comments.append(comment)
        for events in data['get_socialCalEvent']:
            event = SocialCalEventSerializer(models.SocialCalEvent.objects.get(id = events)).data
            cal_events.append(event)
        data['get_socialCalComment'] = cal_comments
        data['people_like'] = cal_likes
        data['get_socialCalEvent'] = cal_events
        data['socialCalUser'] = SocialCalUserSerializer(User.objects.get(id = data['socialCalUser'])).data
        return data


class SocialCalUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'profile_picture')

class SocialCalItemsSerializer(serializers.ModelSerializer):
    # itemImage = Base64ImageField()
    get_socialCalItemComment = serializers.StringRelatedField(many = True)


    class Meta:
        model = models.SocialCalItems
        fields = (
        'id',
        'socialItemType',
        'created_at',
        'creator',
        'itemUser',
        'itemImage',
        "caption",
        "people_like",
        "calCell",
        "get_socialCalItemComment"
         )

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['creator'] = SocialCalUserSerializer(User.objects.get(id = data['creator'])).data

        cal_likes = []

        for likes in data['people_like']:
            like = SocialCalUserSerializer(User.objects.get(id = likes)).data
            cal_likes.append(like)

        data['people_like'] = cal_likes

        return data

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
        inviteList = []
        notGoingList = []
        for people in data['persons']:
            person = SocialCalUserSerializer(User.objects.get(id = people)).data
            personList.append(person)
        for messages in data['get_socialEventMessage']:
            message = SocialEventMessagesSerializer(models.SocialEventMessages.objects.get(id = messages)).data
            messageList.append(message)
        for invitee in data['inviteList']:
            invite = SocialCalUserSerializer(User.objects.get(id = invitee)).data
            inviteList.append(invite)
        for people in data['notGoingList']:
            person = SocialCalUserSerializer(User.objects.get(id = people)).data
            notGoingList.append(person)
        data['persons'] = personList
        data['get_socialEventMessage'] = messageList
        data['inviteList'] = inviteList
        data['notGoingList'] = notGoingList
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
        fields = ('id','body', 'created_on', 'commentUser', "comment_like_count", "comment_people_like" )

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['commentUser'] = SocialCalUserSerializer(User.objects.get(id = data['commentUser'])).data
        return data

class SocialItemCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.SocialCalItemComment
        fields ="__all__"

    def to_representation(self,instance):
        data = super().to_representation(instance)
        data['commentUser'] = SocialCalUserSerializer(User.objects.get(id = data['commentUser'])).data
        return data

class SocialEventBackgroundSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.SocialCalEvent
        fields = ("backgroundImg",)


# For content type you will need 2 serializer class. One to serialize the specific
# fields in side the serializer
class SocialCellEventRelatedField(serializers.RelatedField):
    # This serializer will check which kind of model the content type is and then
    def to_representation(self, instance):
        # now this will check what the instance is
        if isinstance(instance, User):
        #   Might use a mini serializer for this later
            user = SocialCalUserSerializer(User.objects.get(id = instance.id)).data
            return user

        elif isinstance(instance, models.SocialCalCell):
            socialCalCell = SocialCalCellSerializer(models.SocialCalCell.objects.get(id = instance.id)).data
            return socialCalCell

        elif isinstance(instance, models.SocialCalEvent):
            socialCalEvent = SocialCalEventSerializer(models.SocialCalEvent.objects.get(id = instance.id)).data
            return socialCalEvent


class SocialCellEventSerializer(serializers.ModelSerializer):
    owner = SocialCellEventRelatedField(read_only = True)
    post = SocialCellEventRelatedField(read_only = True)

    class Meta:
        model = models.SocialCellEventPost
        fields = ("id", 'owner', 'post', 'post_date')
