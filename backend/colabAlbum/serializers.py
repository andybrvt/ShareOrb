from . import models
from rest_framework import serializers
from userprofile.models import User


# this is to serializer the whole album itself
# you are gonna have to make a serializer for the item
# so that you can do a to_representation
class ColabAlbumSerializer(serializers.ModelSerializer):

    get_colabItems = serializers.StringRelatedField(many = True)

    class Meta:
        modle = models.ColabAlbum
        fields = ('__all__')

    def to_representation(self, instance):
        data = super().to_representation(instance)
        personList = []
        colab_items = []

        for persons in data['person']:
            person = ColabItemCreator(User.object.get(id = persons)).data
            personList.append(person)
        for items in data['get_colabItems']:
            item = ColabItemSerializer(models.ColabItems.get(id = item)).data
            colab_items.append(item)

        data['person'] = personList
        data['get_colabItems'] = colab_items

        return data


# this is for the item itself
class ColabItemSerializer(serializers.ModelSerializer):


    class Meta:
        model = models.ColabItems
        fields = ('__all__')

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['creator'] = ColabItemCreator(User.objects.get(id = data['creator'])).data

        return data

# This is similar to the social cal user, too lazy to import it again
# might have issues
class ColabItemCreator(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'profile_picture')
