# serializers will convert the model imputs to JSON
from rest_framework import serializers
from . import models

# this converts model data into json and you will connection
# this to the views
class NewsFeedSerializers(serializers.ModelSerializer):
	class Meta:
		model= models.Newsfeed
		fields = ("__all__")
