# from django.db import models
from django.conf import settings
# Create your models here.
from django.db import models
from django.contrib.auth.models import AbstractUser, AnonymousUser
from typing import Union
from django.db.models.signals import post_save
from django.utils.timezone import now
from mySocialCal.models import SocialCalCell
from mySocialCal.models import SocialCalEvent
from django.utils import timezone
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

class User(AbstractUser):
    bio = models.CharField(blank=True, null=True, max_length=250)
    profile_picture = models.ImageField(('profile_picture'),
                                        upload_to='PostPic/public/profile_pictures/%Y/%m',
                                        blank=True,
                                        default = 'PostPic/public/profile_pictures/default.png'
                                        )

    dob = models.DateField(blank=True, null=True, max_length=12)
    phone_number = models.CharField(blank=True, null=True, max_length=10)
    slug = models.SlugField(blank = True)
    friends = models.ManyToManyField("self", blank=True, related_name = 'friends')


    def get_posts(self):

        return Post.objects.filter(user=self).values_list('id', flat=True)

    def get_following(self):
        print(UserFollowing.objects.filter(person_following = self).values_list('person_getting_followers__username', flat= True))
        # for i in UserFollowing.objects.filter(person_following = self).values_list('person_getting_followers__username', flat =True):
        #     print(i)
        #     # list = []
        #     # print (User.objects.get(id = i).id)
        return UserFollowing.objects.filter(person_following = self).values_list('person_getting_followers__username', flat= True)

    def get_followers(self):
        return UserFollowing.objects.filter(person_getting_followers = self).values_list('person_following__username', flat= True)

    def get_socialCal(self):
        # This will pull all the socialCallcell for each use and will be used to put in the social calendar
        return SocialCalCell.objects.filter(socialCalUser = self).values_list('id', flat = True)

    def get_socialEvents(self):
        # This will grab the events where you are the host. This will help with grabbing the events all at once

        return SocialCalEvent.objects.filter(host = self).values_list("id", flat = True)

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
#     friends = models.ManyToManyField("Profile", blank=True)
#
#     def __str__(self):
#         return str(self.user.username)

class UserFollowing(models.Model):
    # Since these are foreign key, they can pretty much be access by the user model, so I just made them seperate
    person_following = models.ForeignKey(User, related_name = 'following', on_delete=models.CASCADE)
    person_getting_followers = models.ForeignKey(User, related_name = 'followers', on_delete=models.CASCADE)
    #This is to give the date that the user if following or followed
    created = models.DateTimeField(auto_now_add = True)

    # So basically how this works is that if you want to follow someone, you will be the person_following and
    # the person gettting the following will be the person_getting_followers

class Post(models.Model):
    caption = models.CharField(max_length=1000, default = 'caption')
    created_at = models.DateTimeField(default = timezone.now, blank = False)
    updated_at = models.DateTimeField(auto_now_add=True)

    # Delete these two
    like_count = models.IntegerField(default=0, blank = True)
    like_condition = models.BooleanField(default=False, db_index=True)


    people_like = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name = 'likeUser', blank = True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name = 'postUser', on_delete=models.CASCADE)
    # comments = models.ForeignKey('Comments', on_delete=models.CASCADE, related_name = 'postComments', blank=True, null=True)
    # image = models.ImageField(('post_picture'),
    #         upload_to='post_pictures/%Y/%m',
    #         blank=True,
    #         )



    def post_comments(self):
        # print(Post.objects.filter(user=self).values_list())
        return (Comment.objects.filter(post=self.id).values_list('id', flat = True))

    def post_images(self):
        # print(Post.objects.filter(user=self).values_list())
        return (ImageModel.objects.filter(imageList=self.id).values_list('mainimage', flat= True ))
        # return Comment.objects.filter(post=self.id)

    #
    # def __str__(self):
    #     return self.caption

    class Meta:
        ordering = ('-created_at', '-updated_at')

class ImageModel(models.Model):
    imageList = models.ForeignKey(Post,on_delete=models.CASCADE,related_name='images', blank = True)

    mainimage = models.ImageField(('post_picture'),
            upload_to='post_pictures/%Y/%m',
            blank=True,
            )



class Comment(models.Model):
    post = models.ForeignKey(Post,on_delete=models.CASCADE,related_name='comments', blank = True)
    name = models.CharField(max_length=80, blank = True)
    email = models.EmailField(blank = True)
    body = models.TextField(blank = True)
    created_on = models.DateTimeField(auto_now_add=True, blank = True)
    active = models.BooleanField(default=False, blank = True)
    commentUser = models.ForeignKey(settings.AUTH_USER_MODEL, related_name= 'userComment', on_delete = models.CASCADE, null = True)
    comment_like_count = models.IntegerField(default=0, blank = True)
    comment_like_condition = models.BooleanField(default=False, db_index=True)
    comment_people_like = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='commenPeopleList', blank = True)
    # class Meta:
    #     ordering = ['created_on']

    def __str__(self):
        return 'Comment {} by {}'.format(self.body, self.name)
        # return self.body


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
        null = True,
        related_name = "actor_notification",
        on_delete=models.CASCADE
    )

    verb = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    timestamp = models.DateTimeField(default=now, db_index=True)

    deleted = models.BooleanField(default=False, db_index=True)
    emailed = models.BooleanField(default=False, db_index=True)

    # mindate and maxdate is used more for notificaitons on events, if it is not a
    # notification that has to do with events then there no need to worry about
    # minDate and maxDate
    minDate = models.DateTimeField(default = now, blank = True)
    maxDate = models.DateTimeField(default = now, blank = True)

    # eventId field is used for calendar event related objects
    # so that we can go into the eventid page directly
    eventId = models.BigIntegerField(blank = True, null = True)

    def __str__(self):
        return str(self.recipient)



class UserSocialNormPost(models.Model):
    owner_type = models.ForeignKey(ContentType, related_name = "owner_type_post", on_delete=models.CASCADE)
    owner_id = models.PositiveIntegerField()
    owner = GenericForeignKey("owner_type", "owner_id")
    post_date = models.DateTimeField(default = timezone.now)
    post_type = models.ForeignKey(ContentType, related_name = "post_type_post", on_delete=models.CASCADE)
    post_id = models.PositiveIntegerField()
    post = GenericForeignKey('post_type', 'post_id')
