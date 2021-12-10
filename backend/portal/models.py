from django.db import models
from userprofile.models import User
from django.conf import settings
from django.utils import timezone
import datetime

class BusinessVid(models.Model):
    email = models.EmailField(max_length = 254)
    vidSubmit = models.FileField(("submit_video"), upload_to = "post_video/%Y/%m", null = True)
