import datetime
from django.db import models
from django.utils import timezone
from django.conf import settings
from userprofile.models import User

# from core.utils import get_timezones, DEFAULT_TIMEZONE


# Create your models here. (yearly calendar)
# PROBALLY GONNA DELETE THIS ONE SOON
class Calendar(models.Model):
	person = models.ForeignKey(settings.AUTH_USER_MODEL, related_name = 'userCalendars', on_delete=models.CASCADE)
	title = models.CharField(max_length = 100)
	# location = models.CharField(max_length = 100, blank = True)
	# timezone = models.CharField(max_length=50, choices=get_timezones(), default=DEFAULT_TIMEZONE)
	def __unicode__(self):
		return self.title

	def __str__(self):
		return self.title


class Event(models.Model):
	person = models.ManyToManyField(settings.AUTH_USER_MODEL)
	# For host, it is mostly just used to give editing rights and accepting rights when
	# making and editing events
	host = models.ForeignKey(settings.AUTH_USER_MODEL, related_name ='personal_host', on_delete= models.CASCADE, null = True)
	# GONNA DELETE THIS CALENDAR FIELD TOO AS WELL
	calendar = models.ManyToManyField(Calendar, blank = True)

	title = models.CharField(max_length = 255)
	content = models.TextField(blank = True)
	# repeated weekly/monthly/daily (for this field you are either gonna label it as
	# monthly, weekly, daily, or none)
	repeatCondition = models.CharField(max_length = 255, blank = True)
	start_time = models.DateTimeField(default =timezone.now, blank= False)
	end_time = models.DateTimeField(default =timezone.now, blank= False)
	location = models.CharField(max_length = 255, blank = True)
	color = models.CharField(max_length = 255, blank = True)
	# The accepted field will probally be a list because if we did it a true or false field
	# if one person accepts then everyone's gets accepted

	# Inivted field will not change, it will pretty much remain static to show the orginal list
	# of people that are invited
	invited = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name = 'people_invited', blank = True)
	accepted = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name = 'people_accepted', blank = True)
	# This will hold all the people that declined
	decline = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name = 'people_declined', blank = True)

	# This is for the background picture on personal cal events
	backgroundImg = models.ImageField(('post_picture'), upload_to = 'post_pictures/%Y/%m', blank = True)

	# This will be used to check if the messages are seen or not
	seen = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name = "seen_event_chat")

	# This will be used mostly to id if it is a social cal or a normal cal event
	# 2 options either it is normal or social as a type
	type = models.CharField(max_length = 255, blank = True, default = "normal")

	socialId = models.IntegerField(blank = True, null = True)
	def __unicode__(self):
		return self.title

	def __str__(self):
		return self.title


	def get_eventMessages(self):
		# This function will call all the EventMessages objects that are connected to the
		# instance of the event
		# This function will filter out all the messages base on the foreignkey on the
		# eventMessage object
		# When using values_list, it will display the evnetMessage id
		return EventMessages.objects.filter(eventObj =self).values_list('id', flat = True)

class EventMessages(models.Model):
	# This model is for all the group chat events that are in each event that are
	# shared among everyone. These will be each of the individual messages and then
	# will link to the event through foreign keys. Then I have to do some stuff in
	# the serializers to get it to work.

	# This eventObj field will be linking the events to the right event
	eventObj = models.ForeignKey(Event, on_delete = models.CASCADE, related_name = 'eventGroupMessage')
	body = models.TextField(blank = True)
	created_on = models.DateTimeField(auto_now_add = True)
	# This will connect to the right user
	messageUser = models.ForeignKey(settings.AUTH_USER_MODEL, related_name = 'eventMessageUser', on_delete = models.CASCADE, null = True)
