import datetime
from django.db import models
from django.utils import timezone
from core.utils import get_timezones, DEFAULT_TIMEZONE


# Create your models here. (yearly calendar)
class Calendar(models.Model):
	person = models.ForeignKey(setting.AUTH_USER_MODEL, related_name = 'userCalendars', on_delete=models.CASCADE)
	title = models.CharField(max_length = 100)
	location = models.CharField(max_length = 100, blank = True)
	timezone = models.CharField(max_length=50, choices=get_timezones(), default=DEFAULT_TIMEZONE)
	year = models.CharField
	def __unicode__(self):
		return self.title



class Event(models.Model):
	person = model.ManyToManyField(setting.AUTH_USER_MODEL)
	calendar = models.ForeignKey(Calendar)
	title = models.CharField(max_length = 255)
	content = models.TextField(blank = True)
	start_time = models.DateTimeField(default =timezone.now)
	end_time = models.DateTimeField(default =timezone.now)
	location = models.CharField(max_length = 255)
	def __unicode__(self):
		return self.title
