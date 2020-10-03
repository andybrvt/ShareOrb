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
	invited = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name = 'people_invited')
	accepted = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name = 'people_accepted')
	# This will hold all the people that declined
	decline = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name = 'people_declined')
	def __unicode__(self):
		return self.title

	def __str__(self):
		return self.title
