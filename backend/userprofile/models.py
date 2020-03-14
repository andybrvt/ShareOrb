from django.db import models

# Create your models here.
from django.db import models
from django.contrib.auth.models import AbstractUser, AnonymousUser
from typing import Union

class User(AbstractUser):
    bio = models.CharField(blank=True, null=True, max_length=250)
    dob = models.DateField(blank=True, null=True, max_length=8)
    phone_number = models.CharField(blank=True, null=True, max_length=10)
    # first_name = models.CharField(max_length=30)
    # last_name = models.CharField(max_length=30)
    # email= models.EmailField(blank=True, max_length=254, verbose_name='email address')
    # username = models.CharField(max_length=140, default='DEFAULT VALUE')
    # password = models.CharField(max_length=140, default='DEFAULT VALUE')
    def __str__(self):
        return self.username


# Create your models here.
class Post(models.Model):
    caption = models.CharField(max_length=300)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    # add imager property later!


    def __str__(self):
        return self.caption
