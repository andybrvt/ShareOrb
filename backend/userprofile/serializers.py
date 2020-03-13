from . import models
from django.contrib.auth import authenticate
from rest_framework import serializers
from allauth.account import app_settings as allauth_settings
from allauth.utils import email_address_exists
from allauth.account.adapter import get_adapter
from allauth.account.utils import setup_user_email

class PostUserSerializer(serializers.ModelSerializer):
    class Meta:
	    model = models.User
	    fields = ('id', 'username','first_name', 'last_name', 'email', 'bio')



class PostSerializer(serializers.ModelSerializer):

	class Meta:
		model = models.Post
		fields = ('id', 'caption', 'created_at', 'updated_at','user')

	def to_representation(self, instance):
		data = super().to_representation(instance)
		data['user'] = PostUserSerializer(models.User.objects.get(pk=data['user'])).data
		return data


# custom serializer for signup-- view 127.0.0.1:8000/rest-auth
class RegisterSerializer(serializers.Serializer):

    first_name = serializers.CharField(required=True, write_only=True)
    last_name = serializers.CharField(required=True, write_only=True)
    dob = serializers.CharField(required=True, write_only=True)
    email = serializers.EmailField(required=allauth_settings.EMAIL_REQUIRED)
    phone_number = serializers.CharField(required=True, write_only=True)
    password1 = serializers.CharField(required=True, write_only=True)
    password2 = serializers.CharField(required=True, write_only=True)

    class Meta:
        model = models.User
        fields = ('id', 'number', 'dob', 'first_name', 'last_name', 'email', 'phone_number', 'password1 ', 'password2')

    def validate_email(self, email):
        email = get_adapter().clean_email(email)
        if allauth_settings.UNIQUE_EMAIL:
            if email and email_address_exists(email):
                raise serializers.ValidationError(
                    _("A user is already registered with this e-mail address."))
        return email

    def validate_password1(self, password):
        return get_adapter().clean_password(password)

    def validate(self, data):
        if data['password1'] != data['password2']:
            raise serializers.ValidationError(
                _("The two password fields didn't match."))
        return data

    def get_cleaned_data(self):
        return {
            'first_name': self.validated_data.get('first_name', ''),
            'last_name': self.validated_data.get('last_name', ''),
            'password1': self.validated_data.get('password1', ''),
            'email': self.validated_data.get('email', ''),
        }

    def save(self, request):
        adapter = get_adapter()
        user = adapter.new_user(request)
        self.cleaned_data = self.get_cleaned_data()
        adapter.save_user(request, user, self)
        setup_user_email(request, user, [])
        userprofile.save()
        return user
