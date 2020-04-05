from django.contrib import admin;
from . import models;
#
# admin.site.register(Profile)
admin.site.register(models.Profile);
admin.site.register(models.FriendRequest);
admin.site.register(models.CustomNotification)
