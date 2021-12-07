from . import models
from rest_framework import serializers
from userprofile.models import User



class UploadSingleVidSerializer(serializers.ModelSerializer):

    # get_socialCalItems  = serializers.StringRelatedField(many = True)


    class Meta:
        model = models.BusinessVid
        fields = (
            'id',
            'email',
            'vidSubmit',
            # 'get_socialCalItems'
            )
    def to_representation(self, instance):
        data = super().to_representation(instance)
        # cal_items = []
        # for items in data['get_socialCalItems']:
        #     item = SocialItemJustPicSerializer(models.SocialCalItems.objects.get(id = items)).data
        #     cal_items.append(item)
        # data['get_socialCalItems'] = cal_items
        # data['owner'] = SocialCalUserSerializer(User.objects.get(id = data['owner'])).data

        return data
