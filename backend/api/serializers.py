# serializers will convert the model imputs to JSON
from rest_framework import serializers
from . import models

# this converts model data into json and you will connection
# this to the views
class NewsFeedSerializers(serializers.ModelSerializer):
	class Meta:
<<<<<<< HEAD
		model= models.Newsfeed
		fields = ("__all__")

class AuthGroupSerialziers(serializers.ModelSerializer):
	class Meta:
		model= models.AuthGroup
		fields = "__all__"

class AuthGroupPermissionsSerializers(serializers.ModelSerializer):
	class Meta:
		model= models.AuthGroupPermissions
		fields = "__all__"

class AuthPermissionSerializers(serializers.ModelSerializer):
	class Meta:
		model= models.AuthPermission
		fields = "__all__"

class AuthUserSerializers(serializers.ModelSerializer):
	class Meta:
		model= models.AuthUser
		fields = "__all__"

class AuthUserGroupsSerializers(serializers.ModelSerializer):
	class Meta:
		model= models.AuthUserGroups
		fields = "__all__"

class AuthtokenTokenSerializers(serializers.ModelSerializer):
	class Meta:
		model= models.AuthtokenToken
		fields = "__all__"

class DjangoAdminLogSerializers(serializers.ModelSerializer):
	class Meta:
		model= models.DjangoAdminLog
		fields = "__all__"

class DjangoContentTypeSerializers(serializers.ModelSerializer):
	class Meta:
		model= models.DjangoContentType
		fields = "__all__"
=======
		fields = (
>>>>>>> 3341574cbc3bb1518c63fdde14b58df5790dd931

			'id',
			'first_name',
    		'last_name',
    		 # 'email',
		)
		model = models.Newsfeed
