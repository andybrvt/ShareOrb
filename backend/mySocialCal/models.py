from django.db import models
from django.conf import settings
# Create your models here.
from django.db import models
from django.utils import timezone
from django.db.models.signals import post_save
from django.db.models.signals import post_delete
from django.db.models.signals import pre_delete
from django.apps import apps
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey

import pytz
from datetime import datetime
# from userprofile.models import UserSocialNormPost
# from userprofile.models import User


# THESE create_all_post AND delete_all_post are used for the content type on
# the userprofile.
def create_all_post(sender, instance, created, **kwargs):
    # This will be simlar to the one in the userprofile  models
    userModal = apps.get_model('userprofile', 'User')
    userSocialNormPost = apps.get_model('userprofile', 'UserSocialNormPost')

    post_type = ContentType.objects.get_for_model(instance)
    owner_type = ContentType.objects.get_for_model(userModal)
    if(len(instance.get_socialCalItems()) > 0):
        try:
            post = userSocialNormPost.objects.get(
                owner_type = owner_type,
                owner_id = instance.socialCalUser.id,
                post_type = post_type,
                post_id = instance.id
            )
        except userSocialNormPost.DoesNotExist:
            post = userSocialNormPost(
                owner_type = owner_type,
                owner_id = instance.socialCalUser.id,
                post_type = post_type,
                post_id = instance.id
            )
        post.post_date = instance.socialCaldate
        post.save()
    elif(len(instance.get_socialCalItems()) == 0):
        try:
            post = userSocialNormPost.objects.get(
                owner_type = owner_type,
                owner_id = instance.socialCalUser.id,
                post_type = post_type,
                post_id = instance.id
            )
        except userSocialNormPost.DoesNotExist:
            post = userSocialNormPost(
                owner_type = owner_type,
                owner_id = instance.socialCalUser.id,
                post_type = post_type,
                post_id = instance.id
            )
        post.save()
        post.delete()

def delete_all_post(sender, instance, **kwargs):
    # This will be for whne you delete the social cal cell
    userModal = apps.get_model("userprofile", "User")
    # This to get the user model
    userSocialNormPost = apps.get_model('userprofile', "UserSocialNormPost")
    # To get the content type model

    post_type = ContentType.objects.get_for_model(instance)
    # this will be social cal cell instance
    owner_type = ContentType.objects.get_for_model(userModal)


    if(len(instance.get_socialCalItems()) > 0):
        # Delete the normal post if there is a picture

        post = userSocialNormPost.objects.get(
                owner_type = owner_type,
                owner_id = instance.socialCalUser.id,
                post_type = post_type,
                post_id = instance.id
        )
        post.delete()





# This will be used for the new newsfeed that holds the social cal cell and
# any social events. So whenever you make a social cal cell or soical event
# a content type is made here

# FOR SOICAL CAL PIC
def create_social_cell_post(sender, instance, created, **kwargs):

    # save handler that will create the social cell event post
    # when saved
    # The spender will be the model class and the instance will be the
    # specific instance of that class
    # You probally will only create this only if you make a picture probally
    # gonn have to make two seperate ones, one for the event and one for the
    # social cal cell

    # First you will get the usermodal and then the user instance that you
    # will get from social cal isntance

    # Since we are unable to get the modal directly this is another way of pulling
    # it, you get the user modal from the userprofile app
    userModal = apps.get_model('userprofile', "User")

    # Since most of the things we need are in this modal we dont need to out source
    # as much, just need to get the user

    # get_for_modal either take a modal or instance and then retunr a contenttype instnace
    # This inputed instance will be that of the soical cal cell when saved
    post_type = ContentType.objects.get_for_model(instance)
    owner_type = ContentType.objects.get_for_model(userModal)
    if(len(instance.get_socialCalItems()) > 0):
        # Check if the soical cal cell has pictures
        try:
            # See if there exist one to get it
            post = SocialCellEventPost.objects.get(
                owner_type = owner_type,
                # the instance will be the social cal cell
                owner_id = instance.socialCalUser.id,
                post_type = post_type,
                post_id = instance.id
            )
        except SocialCellEventPost.DoesNotExist:
            # This is to catch the errors when then get does not
            # get anything. So you have to create one.

            post = SocialCellEventPost(
                owner_type = owner_type,
                owner_id = instance.socialCalUser.id,
                post_type = post_type,
                post_id = instance.id
            )

        # The post date will be the date that the soical cal cell gets updated
        # so that it can be moved when shit gets updated
        # timezone.activate(pytz.timezone("MST"))
        # time = timezone.localtime(timezone.now()).strftime("%Y-%m-%d %H:%M:%S")

        # This is a bit different from the post bc things will get update so
        # you will have to update the time
        post.post_date = timezone.now();
        post.save()
    elif(len(instance.get_socialCalItems()) == 0):
        # This is when there is no pictures any more so you are gonna delete the
        # socialcellevnetpost instance
        try:
            # Try to get it
            post = SocialCellEventPost.objects.get(
                owner_type = owner_type,
                owner_id = instance.socialCalUser.id,
                post_type = post_type,
                post_id = instance.id
            )
        except SocialCellEventPost.DoesNotExist:
            # This is just for error check
            post = SocialCellEventPost(
                owner_type = owner_type,
                owner_id = instance.socialCalUser.id,
                post_type = post_type,
                post_id = instance.id
            )
        post.save()
        post.delete()

# Now this will be similar to the saving but for deleting social cal cell when
# you want to delete it
def delete_social_cell_post(sender, instance, **kwargs):
    # Similarly to the top you have to grab the usermodal
    userModal = apps.get_model("userprofile", "User")

    post_type = ContentType.objects.get_for_model(instance)
    owner_type = ContentType.objects.get_for_model(userModal)


    if(len(instance.get_socialCalItems()) > 0):
        # Delete the socialcellevent post if there are pictures

        post = SocialCellEventPost.objects.get(
            owner_type = owner_type,
            owner_id = instance.socialCalUser.id,
            post_type = post_type,
            post_id = instance.id
        )

        post.delete()



# These function will be using the same content type as the create_social_cell_post
# but now this is for social events
# This one should be simplier because there is not that much conditions,
# You would just make the event. Then set the post date to be that of the
# current time that it is posted there will be a date on it(that will be the date
# of the event so that is just assoicated with the event) There is a bit of
# difference among that

# FOR SOCIAL CAL EVENT
def create_social_event_post(sender, instance, created, **kwargs):
    # same deal as the create_social_cell_post

    userModal = apps.get_model('userprofile', "User")

    # The instance will be the social event
    post_type = ContentType.objects.get_for_model(instance)
    owner_type = ContentType.objects.get_for_model(userModal)

    try:
        # check to see if we can grab it to update it
        post = SocialCellEventPost.objects.get(
            owner_type = owner_type,
            owner_id = instance.host.id,
            post_type = post_type,
            post_id = instance.id
        )
    except SocialCellEventPost.DoesNotExist:
        # handle an exception
        post = SocialCellEventPost(
            owner_type = owner_type,
            owner_id = instance.host.id,
            post_type = post_type,
            post_id = instance.id
        )
    # timezone.activate(pytz.timezone("MST"))
    # time = timezone.localtime(timezone.now()).strftime("%Y-%m-%d %H:%M:%S")

    post.post_date = timezone.now();
    post.save()

def delete_social_event_post(sender, instance, **kwargs):
    # pretty much like the create but deleting now
    userModal = apps.get_model("userprofile", "User")

    post_type = ContentType.objects.get_for_model(instance)
    owner_type = ContentType.objects.get_for_model(userModal)

    # Since you are getting it then it should exisit so no need to try and
    # catch exceptions
    post = SocialCellEventPost.objects.get(
        owner_type = owner_type,
        owner_id = instance.host.id,
        post_type = post_type,
        post_id = instance.id
    )

    post.delete()


#These models are used to work with the social cal and all its backend
#functions
class SocialCalCell(models.Model):
    # This will be for each of the days. It will be created everytime the person clips
    # post, or upload pictures up to the picture. When this is created then you would
    # have to like the foreign key to the social cal items and events

    #There will be a foriegn key that calls all the events and post, comments, and likes
    # that are related to the socialCalCell

    # We would probally use a get_or_create for this model later
    # This would just be the owner of the social calendar
    socialCalUser = models.ForeignKey(settings.AUTH_USER_MODEL, related_name = 'social_cal_user', on_delete= models.CASCADE)
    # We will use this to know where to put the
    socialCaldate = models.DateField(default = timezone.now , blank = False)
    #This is to set the cover picture of the cell
    coverPic = models.ImageField(('post_picture'), upload_to = 'post_pictures/%Y/%m', blank = True)

    # This will be used for the date and time it was created at
    created_at = models.DateTimeField(default = timezone.now, blank = False)

    # This will cover the like of the day
    people_like = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name = 'socialLiker', blank = True)

    # This field will be for the caption on the day modal
    dayCaption = models.TextField(blank = True)

    # This action text here will be used in the social cal cell newsfeed whenever
    # you do something to it. It will be further expanded in the future
    # but now it is just updated and new
    # OPTIONS:
    # -new
    # -updated
    actionText = models.CharField(max_length = 200, default = "new")


    def get_socialCalItems(self):
        #This will call all the social cal events like pictures and post and such and will return a list of all the ids
        # which then I will go into the serializers and do to representation to return all the needed values
        return SocialCalItems.objects.filter(calCell = self).values_list('id', flat = True)

    def get_socialCalEvent(self):
        # The processs for the Cal event will be the same as that of the socialCalItems
        return SocialCalEvent.objects.filter(calCell = self).values_list('id', flat = True)

    def get_socialCalComment(self):

        return SocialCalComment.objects.filter(calCell = self).values_list('id', flat = True)

post_save.connect(create_social_cell_post, sender = SocialCalCell)
pre_delete.connect(delete_social_cell_post, sender = SocialCalCell)


# THESE TWO ARE FOR THE USEROSOCIALNORMPOST
# post_save.connect(create_all_post, sender = SocialCalCell )
# pre_delete.connect(delete_all_post, sender = SocialCalCell)





class SocialCalItems(models.Model):
    # The social calendar items will include all the pictures, post, and social
    # events that will be included

    # So since there will be different items for the social cal, I want to h ave differnt
    # types
    # The types will be:
        # clip
        # picture

    # MAKE SURE TO FIX THE NAME WHEN YOU HAVE THE TIME
    socialItemType = models.CharField(max_length = 30, default = 'picture')
    socialItemCaption = models.CharField(max_length = 1000, blank = True)
    # So we would need a created_at to determine where to put the social cal item
    # the only time this created_at will not be used and instead use the start date and
    # end date will be when we are creating a social event
    created_at = models.DateTimeField(auto_now_add = True)

    # The creator will be the person that actully created the picture
    creator = models.ForeignKey(settings.AUTH_USER_MODEL, related_name = 'item_creator', on_delete = models.CASCADE)
    # The itemUser will be the person that has the item in their social calendar
    itemUser = models.ForeignKey(settings.AUTH_USER_MODEL, related_name = 'item_user', on_delete = models.CASCADE )
    # Images can be uploaded when the day has a picture or a post
    itemImage = models.ImageField(('post_picture'), upload_to = 'post_pictures/%Y/%m', blank = True)

    #    #This will be the foreign key that connects the pictures and post with the correct calCell

    calCell = models.ForeignKey(SocialCalCell, on_delete = models.CASCADE, related_name = 'socialPost', null = True)



    # Everything from here down would be for the events
    class Meta:
        ordering = ['-created_at']


class SocialCalEvent(models.Model):
    # This modelis for the social events taht you are gonna post for the public

    #This field will be for all the people who are gonna attend the event
    persons = models.ManyToManyField(settings.AUTH_USER_MODEL)
    #this will be the host of the event
    host = models.ForeignKey(settings.AUTH_USER_MODEL, related_name= 'social_host', on_delete = models.CASCADE)
    # This will be the title of the event
    title = models.CharField(max_length = 222)
    content = models.TextField(blank = True)
    start_time = models.TimeField(default = timezone.now, blank = False)
    end_time = models.TimeField(default = timezone.now, blank = False)
    location = models.CharField(max_length = 255, blank = True)
    event_day = models.DateField(default = timezone.now, blank = True)
    #This will be the foreign key that connects the events with the correct calCell
    calCell = models.ForeignKey(SocialCalCell, on_delete = models.CASCADE, related_name = 'socialEvents', null = True)

    #Unlike the personalcal events, there wouldn't be an accept, decline, or anything like that
    # it will pretty much be a room where people can join to be ready to go to an event
    backgroundImg = models.ImageField(('post_picture'), upload_to = 'post_pictures/%Y/%m', blank = True, )

    inviteList = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name = 'social_invite_list')
    notGoingList = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name = "social_not_going_list")

    def get_socialEventMessage(self):
        # This will attach the messeges to the socialCalEvent by the foreginkey
        # all you have to do is filter out the right messages for each soical event
        return SocialEventMessages.objects.filter(eventObj = self).values_list('id', flat = True)

    class Meta:
        ordering = ('-event_day', '-start_time')

post_save.connect(create_social_event_post, sender = SocialCalEvent)
pre_delete.connect(delete_social_event_post, sender = SocialCalEvent)




class SocialEventMessages(models.Model):
    # this modal is for the group chat events that are associated with each social events
    # It will be coonnected by foreignkeys. This should be similar to the EventMessages
    # in mycalendar models
    eventObj = models.ForeignKey(SocialCalEvent, on_delete= models.CASCADE, related_name = "socialEventGroupMessage")
    body = models.TextField(blank = True)
    created_on = models.DateTimeField(auto_now_add = True)
    messageUser = models.ForeignKey(settings.AUTH_USER_MODEL, related_name= 'socialEventMessageUser', on_delete = models.CASCADE, null = True)




class SocialCalComment(models.Model):
    # The calCell will be the foregin key that connects the comments to the correct day
    calCell = models.ForeignKey(SocialCalCell, on_delete = models.CASCADE, related_name = 'socialComments')
    body = models.TextField(blank = True)
    created_on = models.DateTimeField(auto_now_add = True)
    commentUser = models.ForeignKey(settings.AUTH_USER_MODEL, related_name = 'socialUserComment', on_delete = models.CASCADE, null = True )


# This is for the new newsfeed modal that would hold all the social cal cell
# and social events on the newsfeed
# Since this is a combinaiton of two different modals it will be a content type

# for more information check userSocialNormPost on models userprofile, it will tell
# you how you should user this
class SocialCellEventPost(models.Model):
    # Owner type will be user modal
    owner_type = models.ForeignKey(ContentType, related_name = "owner_type_social", on_delete = models.CASCADE)
    owner_id = models.PositiveIntegerField()
    owner = GenericForeignKey("owner_type", "owner_id")
    # post date will be the date it is post and the date it is updated too
    post_date = models.DateTimeField(default = timezone.now)
    post_type = models.ForeignKey(ContentType, related_name = "post_type_social", on_delete = models.CASCADE)
    post_id = models.PositiveIntegerField()
    post = GenericForeignKey('post_type', 'post_id')

    class Meta:
        ordering = ['-post_date']

    def __str__(self):
        return str(self.id)
