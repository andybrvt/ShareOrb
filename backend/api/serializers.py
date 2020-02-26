from rest_framework import serializers 
from . import models 

class ProfileSerializer(serializers.ModelSerializer):
	
	class Meta:
		fields = (
		

			'first_name',
    		'last_name',
    		'email',


		)
		model = models.Profile 