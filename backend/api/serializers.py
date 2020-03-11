# serializers will convert the model imputs to JSON
from rest_framework import serializers
from . import models

# this converts model data into json and you will connection
# this to the views
# class ProfileSerializer(serializers.ModelSerializer):
# 	class Meta:
# 		fields = (
#
# 			'id',
# 			'first_name',
#     		'last_name',
#     		 # 'email',
# 		)
# 		model = models.Profile

class AccountEmailaddressSerializers(serializers.ModelSerializer):
	class Meta:
		model= models.AccountEmailaddress
		fields = "__all__"

class AccountEmailconfirmationSerializers(serializers.ModelSerializer):
	class Meta:
		model= models.AccountEmailconfirmation
		fields = "__all__"

class NewsFeedSerializers(serializers.ModelSerializer):
	class Meta:
		model= models.Newsfeed
		fields = "__all__"

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

class DjangoMigrationsSerializers(serializers.ModelSerializer):
	class Meta:
		model= models.DjangoMigrations
		fields = "__all__"

class DjangoSessionSerializers(serializers.ModelSerializer):
	class Meta:
		model= models.DjangoSession
		fields = "__all__"

class DjangoSiteSerializers(serializers.ModelSerializer):
	class Meta:
		model= models.DjangoSite
		fields = "__all__"

class SocialaccountSocialaccountSerializers(serializers.ModelSerializer):
	class Meta:
		model= models.SocialaccountSocialaccount
		fields = "__all__"

class SocialaccountSocialappSerializers(serializers.ModelSerializer):
	class Meta:
		model= models.SocialaccountSocialapp
		fields = "__all__"

class SocialaccountSocialappSites(serializers.ModelSerializer):
	class Meta:
		model= models.SocialaccountSocialappSites
		fields = "__all__"

class SocialaccountSocialtokenSerializers(serializers.ModelSerializer):
	class Meta:
		model= models.SocialaccountSocialtoken
		fields = "__all__"

class StudentSerializers(serializers.ModelSerializer):
	class Meta:
		model= models.Student
		fields = "__all__"

class AccountEmailaddressSerializers(serializers.ModelSerializer):
	class Meta:
		model= models.AccountEmailaddress
		fields = "__all__"

class AccountEmailaddressSerializers(serializers.ModelSerializer):
	class Meta:
		model= models.AccountEmailaddress
		fields = "__all__"

class AccountEmailaddressSerializers(serializers.ModelSerializer):
	class Meta:
		model= models.AccountEmailaddress
		fields = "__all__"
