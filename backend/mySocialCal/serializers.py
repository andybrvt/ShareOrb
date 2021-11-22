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
         "socialCaldate",
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


    # get_socialCalEvent = serializers.StringRelatedField(many = True)

    class Meta:
        model = models.SocialCalCell
        fields = (
        'id',
        'socialCalUser',
        'socialCaldate',
        'coverPic',
        'coverVid',
        # 'get_socialCalEvent',
        # 'dayCaption',
        # 'people_like',
        # 'get_socialCalComment',
        )

    def to_representation(self, instance):
        data = super().to_representation(instance)
        # cal_events = []
        # cal_comments = []
        # cal_likes = []
        # for likes in data['people_like']:
        #     like = SocialCalUserSerializer(User.objects.get(id =likes)).data
        #     cal_likes.append(like)
        # for comments in data['get_socialCalComment']:
        #     comment = SocialCalCommentSerializer(models.SocialCalComment.objects.get(id = comments)).data
        #     cal_comments.append(comment)
        # for events in data['get_socialCalEvent']:
            # event = SocialCalEventSerializer(models.SocialCalEvent.objects.get(id = events)).data
            # cal_events.append(event)
        # data['get_socialCalComment'] = cal_comments
        # data['people_like'] = cal_likes
        # data['get_socialCalEvent'] = cal_events
        data['socialCalUser'] = SocialCalUserSerializer(User.objects.get(id = data['socialCalUser'])).data
        return data


class SocialCalUserSerializer(serializers.ModelSerializer):
    #INUSE ---

    class Meta:
        model = User
        fields = (
        'id',
        'username',
        'first_name',
        'last_name',
        'profile_picture',
        "notificationToken",
        "secondUsername",
        "isOtherAccount"
        )

class DetailSocialCalItemsSerializer(serializers.ModelSerializer):
    # this function will be for pulling specific post id

    get_socialCalItemComment = serializers.StringRelatedField(many = True)

    class Meta:
        model = models.SocialCalItems
        fields = (
        'id',
        'created_at',
        'creator',
        'itemUser',
        'itemImage',
        'video',
        "caption",
        "people_like",
        "get_socialCalItemComment",
        'smallGroup'
         )

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['creator'] = SocialCalUserSerializer(User.objects.get(id = data['creator'])).data

        data['smallGroup'] = MiniSmallGroupsSerializer(models.SmallGroups.objects.get(id = data['smallGroup'])).data
        return data

class SocialCalItemsSerializer(serializers.ModelSerializer):
    # INUSE ---

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
        'video',
        "caption",
        "people_like",
        "calCell",
        "get_socialCalItemComment",
        'goal',
        'smallGroup'
         )

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['creator'] = SocialCalUserSerializer(User.objects.get(id = data['creator'])).data

        cal_likes = []

        # for likes in data['people_like']:
        #     like = SocialCalUserSerializer(User.objects.get(id = likes)).data
        #     cal_likes.append(like)

        # if(data['goal']):
        #     data['goal'] = GoalAlbumStringMiniSerializer(models.GoalAlbumString.objects.get(id= data['goal'])).data

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

class SocialItemJustPicSerializer(serializers.ModelSerializer):
    # INUSE ---
    class Meta:
        model = models.SocialCalItems
        fields = ("id", "itemImage","video", 'caption', "created_at")

# This will be used for the globe group
# you will need the pic/vid, the group it was part of, and the ower
class SocialItemGlobeSerializer(serializers.ModelSerializer):

    get_socialCalItemComment = serializers.StringRelatedField(many = True)

    class Meta:
        model = models.SocialCalItems
        fields = (
            "id",
            "itemImage",
            "video",
            'caption',
            "created_at",
            'smallGroup',
            "creator",
            "people_like",
            "get_socialCalItemComment"
        )

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['creator'] = SocialCalUserSerializer(User.objects.get(id = data['creator'])).data


        return data


class GoalAlbumStringMiniSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.GoalAlbumString
        fields = (
            'id',
            'goal',
            'owner',
            'created_at'
        )


class GoalAlbumStringSerializer(serializers.ModelSerializer):

    get_socialCalItems  = serializers.StringRelatedField(many = True)


    class Meta:
        model = models.GoalAlbumString
        fields = (
            'id',
            'goal',
            'owner',
            'created_at',
            'get_socialCalItems'
            )
    def to_representation(self, instance):
        data = super().to_representation(instance)
        cal_items = []

        for items in data['get_socialCalItems']:
            item = SocialItemJustPicSerializer(models.SocialCalItems.objects.get(id = items)).data
            cal_items.append(item)
        data['get_socialCalItems'] = cal_items
        data['owner'] = SocialCalUserSerializer(User.objects.get(id = data['owner'])).data

        return data


class SmallGroupInfoSerializers(serializers.ModelSerializer):

    class Meta:
        model = models.SmallGroups
        fields = (
            'id',
            'group_name',
            'groupPic',
            'description',
            'creator',
            'lat',
            'long',
            'address',
            'members'
        )

    def to_representation(self, instance):
        data = super().to_representation(instance)

        data['creator'] = SocialCalUserSerializer(User.objects.get(id = data['creator'])).data


        return data




class SmallGroupsSerializers(serializers.ModelSerializer):

    # INUSE ---


    # This function will be used more for users so that you just have
    # to just get the small grups info and not the images that goes with it


    # probally have to remove
    class Meta:
        model = models.SmallGroups
        fields = (
            "id",
            "members",
            "group_name",
            'groupPic',
            'description',
            'public',
            "groupCode",
            'get_socialCalItems',
            'creator',
            'lat',
            'long',
            'address',
            'type',
            )
    def to_representation(self, instance):
        data = super().to_representation(instance)

        data['creator'] = SocialCalUserSerializer(User.objects.get(id = data['creator'])).data

        cal_items = []

        member_list = []
        for items in data['get_socialCalItems'][:5]:
            item = SocialItemJustPicSerializer(models.SocialCalItems.objects.get(id=items)).data
            cal_items.append(item)

        for members in data['members'][:10]:
            member = SocialCalUserSerializer(User.objects.get(id = members)).data
            member_list.append(member)

        data['get_socialCalItems'] = cal_items
        data['mini_member'] = member_list
        return data

# this function is use to grab just the member serialziers
class MemberGroupSerializer(serializers.ModelSerializer):


    class Meta:
        model = models.SmallGroups
        fields = (
            "id",
            "members"
        )

    def to_representation(self, instance):
        data = super().to_representation(instance)

        members=[]

        for people in data['members']:

            member = data['members'] = SocialCalUserSerializer(User.objects.get(id = people)).data
            members.append(member)
        data['members'] = members
        return data

class NotificationSmallGroupSerializers(serializers.ModelSerializer):

    class Meta:
        model = models.SmallGroups
        fields  = (
            'id',
            "group_name",

        )

class SmallGroupsExploreSerializers(serializers.ModelSerializer):

    # This function will be used for the explore page,
    # it will just grab the info and serveral images
    class Meta:
        model = models.SmallGroups
        fields  = (
            'id',
            'members',
            "group_name",
            "groupPic",
            "get_socialCalItems",
            "public",
            'creator'
        )

    def to_representation(self, instance):
        data = super().to_representation(instance)
        cal_items = []

        member_list = []
        for items in data['get_socialCalItems'][:5]:
            item = SocialItemJustPicSerializer(models.SocialCalItems.objects.get(id=items)).data
            cal_items.append(item)

        for members in data['members'][:10]:
            member = SocialCalUserSerializer(User.objects.get(id = members)).data
            member_list.append(member)

        data['get_socialCalItems'] = cal_items
        data['mini_member'] = member_list
        return data

# used for when you don't need the cal items or members
class MiniSmallGroupsSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.SmallGroups
        fields = (
            "id",
            "group_name",
            "groupPic",
            "public",
            'creator',
            'members'
        )
    def to_representation(self, instance):
        data = super().to_representation(instance)

        member_list = []
        for members in data['members']:
            member = SocialCalUserSerializer(User.objects.get(id = members)).data
            member_list.append(member)

        data['mini_member'] = member_list

        return data


class GlobeItemSerializer(serializers.ModelSerializer):

    # INUSE ---


    class Meta:
        model = models.GlobeItems
        fields = (
            'id',
            "post",
            "group",
            "created_at",
        )
    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['post'] = SocialItemGlobeSerializer(models.SocialCalItems.objects.get(id = data['post'])).data
        data['group'] = SmallGroupsExploreSerializers(models.SmallGroups.objects.get(id = data['group'])).data
        return data

class GlobeItemCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.GlobeItemComment
        fields= "__all__"
    def to_representation(self,instance):
        data = super().to_representation(instance)
        data['commentUser'] = SocialCalUserSerializer(User.objects.get(id = data['commentUser'])).data
        return data
