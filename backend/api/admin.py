# this is where you register all your models to the admin
from django.contrib import admin
from .models import Newsfeed
#
# admin.site.register(Profile)
admin.site.register(Newsfeed);
