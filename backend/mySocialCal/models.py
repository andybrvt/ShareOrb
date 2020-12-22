from django.db import models
from django.conf import settings
# Create your models here.
from django.db import models
from django.utils import timezone
from django.db.models.signals import post_save
from django.apps import apps
from django.contrib.contenttypes.models import ContentType
# from userprofile.models import UserSocialNormPost
# from userprofile.models import User

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

    def get_socialCalItems(self):
        #This will call all the social cal events like pictures and post and such and will return a list of all the ids
        # which then I will go into the serializers and do to representation to return all the needed values
        return SocialCalItems.objects.filter(calCell = self).values_list('id', flat = True)

    def get_socialCalEvent(self):
        # The processs for the Cal event will be the same as that of the socialCalItems
        return SocialCalEvent.objects.filter(calCell = self).values_list('id', flat = True)

    def get_socialCalComment(self):

        return SocialCalComment.objects.filter(calCell = self).values_list('id', flat = True)


post_save.connect(create_all_post, sender = SocialCalCell )


class SocialCalItems(models.Model):
    # The social calendar items will include all the pictures, post, and social
    # events that will be included

    # So since there will be different items for the social cal, I want to h ave differnt
    # types
    # The types will be:
        # clip
        # picture

    # MAKE SURE TO FIX THE NAME WHEN YOU HAVE THE TIME
    socialItemType = models.CharField(max_length = 30, default = 'post_pic')
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
        ordering = ['created_at']


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

    def get_socialEventMessage(self):
        # This will attach the messeges to the socialCalEvent by the foreginkey
        # all you have to do is filter out the right messages for each soical event
        return SocialEventMessages.objects.filter(eventObj = self).values_list('id', flat = True)

    class Meta:
        ordering = ('-event_day', '-start_time')

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
