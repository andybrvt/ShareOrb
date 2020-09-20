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


	def __unicode__(self):
		return self.title

	def __str__(self):
		return self.title
	def getPeople(self):
		return User.objects.filter(user=self.id).values_list('id')
