from django.db import models
from django.conf import settings
from django.utils import timezone

# Create your models here.


class UserResponse(models.Model):
    responder = models.ForeignKey(settings.AUTH_USER_MODEL, related_name = 'responder', on_delete= models.CASCADE)
    video = models.FileField(("post_video"), upload_to = "post_video/%Y/%m", null = True)
    created_at = models.DateTimeField(default = timezone.now, blank = False)


class UserRequest(models.Model):
    requester = models.ForeignKey(settings.AUTH_USER_MODEL, related_name = 'requester', on_delete= models.CASCADE)
    request = models.TextField(blank = False, null = True)
    created_at = models.DateTimeField(default = timezone.now, blank = False)
    people_like = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name = "request_liker", blank = True)
    response = models.ForeignKey(UserResponse, related_name = "response", on_delete = models.CASCADE, null = True)

    class Meta:
        ordering = ['-created_at']




class RequestComment(models.Model):
    request = models.ForeignKey(UserRequest, on_delete= models.CASCADE, related_name = "request_comment")
    body = models.TextField(blank = True)
    created_on = models.DateTimeField(auto_now_add = True)
    commentUser = models.ForeignKey(settings.AUTH_USER_MODEL, related_name= "request_comment_user", on_delete = models.CASCADE, null = True)
