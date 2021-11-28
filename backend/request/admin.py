from django.contrib import admin
from . import models

# Register your models here.
admin.site.register(models.UserResponse)
admin.site.register(models.UserRequest)
admin.site.register(models.RequestComment)
admin.site.register(models.FlaggedRequests)
