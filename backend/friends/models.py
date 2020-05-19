from django.db import models
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.timezone import now


# Create your models here.
class Profile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, default = 'user', on_delete=models.CASCADE)
    slug = models.SlugField()
    friends = models.ManyToManyField("self", blank=True)

    def __str__(self):
        return str(self.user.username)

    def get_absolute_url(self):
    	return "/users/{}".format(self.slug)

def post_save_user_model_receiver(sender, instance, created, *args, **kwargs):
    if created:
        try:
            Profile.objects.create(user=instance)
        except:
            pass




post_save.connect(post_save_user_model_receiver, sender=settings.AUTH_USER_MODEL)

class FriendRequest(models.Model):
	to_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='to_user1')
	from_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='from_user1')
	timestamp = models.DateTimeField(auto_now_add=True) # set when created

	def __str__(self):
		return "From {}, to {}".format(self.from_user.username, self.to_user.username)


class CustomNotification(models.Model):
    type = models.CharField(default='friend', max_length=30)

    # this is the login user
    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        blank=False,
        related_name='notifications',
        on_delete=models.CASCADE
    )
    unread = models.BooleanField(default=True, blank=False, db_index=True)

    # this is the person that can do stuff to the notifcations
    actor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        blank=False,
        related_name ='friends_actor',
        on_delete=models.CASCADE
    )

    verb = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)

    timestamp = models.DateTimeField(default=now, db_index=True)

    deleted = models.BooleanField(default=False, db_index=True)
    emailed = models.BooleanField(default=False, db_index=True)

    def __str__(self):
        return str(self.recipient)
