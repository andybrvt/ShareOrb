# from django.db import models
from django.conf import settings
# Create your models here.
from django.db import models
from django.contrib.auth.models import AbstractUser, AnonymousUser
from typing import Union
from django.db.models.signals import post_save
from django.db.models.signals import pre_delete
from django.utils.timezone import now
from mySocialCal.models import SocialCalCell
from mySocialCal.models import SocialCalEvent
from mySocialCal.models import SmallGroups
from mySocialCal.models import SocialCalItems
from django.utils import timezone
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
import datetime
from django.utils.crypto import get_random_string
import uuid


def create_all_post(sender, instance, created, **kwargs):
    # This is a post save handler that will create a content type ojbect whenever
    # a socialcal or post object is created
    # The sender will be the model class and the instnace will
    # the specific instance of that class
    post_type = ContentType.objects.get_for_model(instance)
    owner_type = ContentType.objects.get_for_model(User)
    try:
        post = UserSocialNormPost.objects.get(
            owner_type = owner_type,
            owner_id = instance.user.id,
            post_type = post_type,
            post_id = instance.id
        )
    except UserSocialNormPost.DoesNotExist:
        post = UserSocialNormPost(
            owner_type = owner_type,
            owner_id = instance.user.id,
            post_type = post_type,
            post_id = instance.id
        )
    post.post_date = instance.created_at
    post.save()

def delete_all_post(sender, instance, **kwargs):
    # This will be used fro when we delete a post on newsfeed
    post_type = ContentType.objects.get_for_model(instance)
    owner_type = ContentType.objects.get_for_model(User)
    post = UserSocialNormPost.objects.get(
        owner_type = owner_type,
        owner_id = instance.user.id,
        post_type = post_type,
        post_id = instance.id
    )
    # Delete the post whne you delete the post on newsfeed
    post.delete()

def random_code_function():
    return get_random_string(length = 6)

class User(AbstractUser):
    bio = models.TextField(blank=True, null=True, max_length=250)
    profile_picture = models.ImageField(('profile_picture'),
                                        upload_to='PostPic/public/profile_pictures/%Y/%m',
                                        blank=True,
                                        default = 'PostPic/public/profile_pictures/default.png'
                                        )

    dob = models.DateField(blank=True, null=True, max_length=12)
    phone_number = models.CharField(blank=True, null=True, max_length=10)
    slug = models.SlugField(blank = True)

    # DELETE THIS LATER
    friends = models.ManyToManyField("self", blank=True, related_name = 'friends')
    # Private will handle wheter or not the account is private and other people
    # are allow to see it or not
    private = models.BooleanField(default = False)

    # This is for when you make your account private, and this field will have people
    # that request to see your page

    # This does not work that well bc if you create a reqeust, then it would show
    # up on both peoples request so you dont want that.
    # The way you want to do this is make a request model so that each request can
    # be shared and added and each person would have a list of request instead
    # of both poeple getting a request like ManyToManyField
    requested = models.ManyToManyField("self", blank = True, related_name = "private_approved")

    # This will be used to show the instructions at the beginning of the login
    showIntialInstructions = models.BooleanField(default = True)

    # This will be used for  the notificaiton that are unseen, everytime someone
    # sends you a notification you have to update the number nad every time you
    # you open pu the drop down you will set the value to 0 again
    notificationSeen = models.IntegerField(default = 0, blank = True)
    notificationToken = models.CharField(blank=True, null=True, max_length=100)

    inviteCode = models.CharField(max_length = 6, null = True, default = random_code_function)
    invitedNum = models.IntegerField(default = 5, blank = False)
    dailyNotification = models.BooleanField(default = True)

    # this function will be used to keep track of the recent people you added
    # to your groups
    recents = models.ManyToManyField("self", blank = True, related_name = "recent_people")

    recentOrbs = models.ManyToManyField(SmallGroups, blank= True, related_name = "recent_orbs")
    # DELETE THIS LATE, WE DONT NEED THIS ANYMORE
    def get_posts(self):

        return Post.objects.filter(user=self).values_list('id', flat=True)

    def get_following(self):

        # for i in UserFollowing.objects.filter(person_following = self).values_list('person_getting_followers__username', flat =True):

        return UserFollowing.objects.filter(person_following = self).values_list('person_getting_followers__username', flat= True)

    def get_followers(self):
        return UserFollowing.objects.filter(person_getting_followers = self).values_list('person_following__username', flat= True)

    def get_socialCal(self):
        # This will pull all the socialCallcell for each use and will be used to put in the social calendar
        return SocialCalCell.objects.filter(socialCalUser = self).values_list('id', flat = True)

    def get_socialEvents(self):
        # This will grab the events where you are the host. This will help with grabbing the events all at once

        return SocialCalEvent.objects.filter(host = self).values_list("id", flat = True)

    def get_allPost(self):
        # This will grab all the post and events that the user has made in one. It will be calling the contenttype

        return UserSocialNormPost.objects.filter(owner_id = self.id)

    def get_sent_follow_request(self):
        # This will grab all the request that you sent out
        # Pretty much the opposite of the get_follow_request
        return UserFollowingRequest.objects.filter(send_request = self.id).values_list('accept_request__username', flat = True)
    def get_follow_request(self):
        # This will grab all the follow request that a perosn has
        return UserFollowingRequest.objects.filter(accept_request = self.id).values_list('send_request__username', flat = True)

    def get_small_groups(self):
        # this will grap all the users small groups
        return SmallGroups.objects.filter(members__in = [self.id]).values_list('id', flat = True)
        # return SmallGroups.objects.filter(id = 2).values_list('id', flat = True)

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

class UserFollowingRequest(models.Model):
    # Pretty much make this the same as UserFollowing pretty much, a person would
    # send a request, and then one person accepting the requeset

    # send_request would be for the person sending the request
    # accept_request would be for the person accepting the request
    send_request = models.ForeignKey(User, related_name = "send_request", on_delete = models.CASCADE)
    accept_request = models.ForeignKey(User, related_name = "accept_request", on_delete = models.CASCADE)

    created = models.DateTimeField(auto_now_add = True)



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
        return (Comment.objects.filter(post=self.id).values_list('id', flat = True))

    def post_images(self):
        return (ImageModel.objects.filter(imageList=self.id).values_list('mainimage', flat= True ))

    #
    # def __str__(self):
    #     return self.caption

    class Meta:
        ordering = ('-created_at', '-updated_at')

post_save.connect(create_all_post, sender = Post)
pre_delete.connect(delete_all_post, sender = Post)


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

    # The type of the notification is really important, it tells us which type
    # of notification it is

    # All the types and thier association.


    # pending_social_event --> this is for the calendar onwer to accept a add event request
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
    # albumDate = models.TextField(blank=True, null=True)
    timestamp = models.DateTimeField(default=now, db_index=True)

    deleted = models.BooleanField(default=False, db_index=True)
    emailed = models.BooleanField(default=False, db_index=True)

    groupInvite = models.ForeignKey(SmallGroups, related_name= "group_invite", on_delete = models.CASCADE, null = True)
    post = models.ForeignKey(SocialCalItems, related_name = "post_stuff", on_delete= models.CASCADE, null = True)




    # EVERYTHING DOWN HERE IS OBSOLUTE, DO NOT USE ANY MORE
    minDate = models.DateTimeField(default = now, blank = True)
    maxDate = models.DateTimeField(default = now, blank = True)
    eventId = models.BigIntegerField(blank = True, null = True)
    itemId = models.BigIntegerField(blank = True, null = True)
    pendingEventTitle = models.CharField(max_length= 222, blank = True)
    pendingEventContent = models.TextField(blank = True)
    pendingEventLocation = models.CharField(max_length = 255, blank = True)
    pendingEventCurId = models.IntegerField(blank = True, null = True)
    pendingCalendarOwnerId = models.IntegerField(blank = True, null = True)
    pendingEventDate = models.DateField(default =datetime.date.today, blank = True)
    pendingEventStartTime = models.TimeField(default = datetime.time, blank = True)
    pendingEventEndTime = models.TimeField(default = datetime.time, blank = True)

    def __str__(self):
        return str(self.id)

    def get_pendingImages(self):
        # This will call all the pending images that are assocated with the notification
        return PendingSocialPics.objects.filter(notification = self).values_list('id', flat = True)

# This model will be a temporary modal to hold the pending pictures. It will be linked
# to a speicific notification. It will include a picture, the selected Date, creator (the person
# who want to upload the pic on your calendar. Whne the perosn accepts the picture then
# we will transfer all the pictures with the foregin key connected witht he notificaiton
# to the approciate cal cell.
class PendingSocialPics(models.Model):

     created_at = models.DateTimeField(default = timezone.now)

     # This will store the pending pictures
     itemImage = models.ImageField(('post_picture'), upload_to = 'post_pictures/%Y/%m', blank = True)
     # creator will be the person who want to upload the picture
     creator = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='pending_pic_creator', on_delete= models.CASCADE)

     #notification will be the notification that this picture is attached to
     notification = models.ForeignKey(CustomNotification, related_name = "attached_noti", on_delete = models.CASCADE)

     def __str__(self):
         return str(self.id)


# Explaination of how content type works
# Content type allows you to create a generic modal that lets you call foreign keys
# to other models and stores it as that model instance. Essentially it allows you
# to have a model has instances that has fields that holds different objects.
# It is good for combining different model types if you need to ever combine them for
# certain users (ie posts page, newsfeed etc)
# You can then work with the different object types (ordering, filtering etc)
# This is similar to queryset chaining but it is more efficent for larger amounts of
# data

# HOW IT WORKS
# Works some what like generics in java. But you will need a foriegn key of sorts
# that leads to Contenttype. Then you will create a new key for that forieng key which
# will also be related to the forigen key that you just add. Then you will use that model
# type and the model id to then add to a GenericForeginKey (this will retrive the model
# object assoicated with the id). You can do this for multiple fields. Contenttype will
# have access to all the models crated.

# Afterwards, you can pretty much treat this model as a regular model. Make sure when you
# are serializing you have to do isinstance of.
# To filter, you cannot filter the GenericForeginKey but you can filter all the other
# fields suchs as the content type and content id so pick and choose.
class UserSocialNormPost(models.Model):
    owner_type = models.ForeignKey(ContentType, related_name = "owner_type_post", on_delete=models.CASCADE)
    owner_id = models.PositiveIntegerField()
    owner = GenericForeignKey("owner_type", "owner_id")
    post_date = models.DateTimeField(default = timezone.now)
    post_type = models.ForeignKey(ContentType, related_name = "post_type_post", on_delete=models.CASCADE)
    post_id = models.PositiveIntegerField()
    post = GenericForeignKey('post_type', 'post_id')

    class Meta:
        ordering = ['-post_date']
    def __str__(self):
        return str(self.id)


# Used to store all the emails for the wait list
class WaitListEmails(models.Model):
    email = models.EmailField(max_length = 254)

    def __str__(self):
        return str(self.email)

# used to get the email of the poeple that got invited
class InviteListEmails(models.Model):
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='invite_sender', on_delete= models.CASCADE)
    email = models.EmailField(max_length = 254)

    def __str__(self):
        return str(self.email)
