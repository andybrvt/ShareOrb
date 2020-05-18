# from django.db import models
from django.conf import settings
# Create your models here.
from django.db import models
from django.contrib.auth.models import AbstractUser, AnonymousUser
from typing import Union
from django.db.models.signals import post_save
from django.utils.timezone import now

class User(AbstractUser):
    bio = models.CharField(blank=True, null=True, max_length=250)
    profile_picture = models.ImageField(('profile_picture'),
                                        upload_to='PostPic/public/profile_pictures/%Y/%m',
                                        blank=True,
                                        )

    dob = models.DateField(blank=True, null=True, max_length=12)
    phone_number = models.CharField(blank=True, null=True, max_length=10)
    slug = models.SlugField()
    friends = models.ManyToManyField("self", blank=True)

    def get_posts(self):
        return Post.objects.filter(user=self).values_list('id', flat=True)

    def __str__(self):
        return self.username

    def get_absolute_url(self):
    	return "/users/{}".format(self.slug)

def post_save_user_model_receiver(sender, instance, created, *args, **kwargs):
    if created:
        try:
            User.objects.create(user=instance)
        except:
            pass


post_save.connect(post_save_user_model_receiver, sender=User)
# class Profile(models.Model):
#     user = models.OneToOneField(settings.AUTH_USER_MODEL)
#     friends = models.ManyToManyField("Profile", blank=True)
#
#     def __str__(self):
#         return str(self.user.username)



class Post(models.Model):
    caption = models.CharField(max_length=300)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE)
    like_count = models.IntegerField(default=0)
    # add imager property later!
    image = models.ImageField(('post_picture'),
                              upload_to='post_pictures/%Y/%m',
                              blank=True,
                              )
    

    def __str__(self):

        return self.caption

class FriendRequest(models.Model):
	to_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='to_user')
	from_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='from_user')
	timestamp = models.DateTimeField(auto_now_add=True) # set when created

	def __str__(self):
		return "From {}, to {}".format(self.from_user.username, self.to_user.username)


class CustomNotification(models.Model):
    type = models.CharField(default='friend', max_length=30)

    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        blank=False,
        related_name='user_notifications',
        on_delete=models.CASCADE
    )
    unread = models.BooleanField(default=True, blank=False, db_index=True)

    actor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        blank=False,
        on_delete=models.CASCADE
    )

    verb = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    timestamp = models.DateTimeField(default=now, db_index=True)

    deleted = models.BooleanField(default=False, db_index=True)
    emailed = models.BooleanField(default=False, db_index=True)

    def __str__(self):
        return str(self.recipient)
