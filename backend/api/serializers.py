# serializers will convert the model imputs to JSON
from rest_framework import serializers
from . import models

# this converts model data into json and you will connection
# this to the views 
class ProfileSerializer(serializers.ModelSerializer):
	class Meta:
		fields = (

			'id',
			'first_name',
    		'last_name',
    		 # 'email',
		)
		model = models.Profile
