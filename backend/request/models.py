from django.db import models
from django.conf import settings
from django.utils import timezone

# Create your models here.

class UserRequest(models.Model):
    requester = models.ForeignKey(settings.AUTH_USER_MODEL, related_name = 'requester', on_delete= models.CASCADE)
    request = models.TextField(blank = False, null = True)
    created_at = models.DateTimeField(default = timezone.now, blank = False)
    people_like = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name = "request_liker", blank = True)
