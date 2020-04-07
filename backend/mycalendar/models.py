from django.db import models

# Create your models here.
class Calendar(models.Model):
	title = models.CharField(max_length = 100)
	location = models.CharField(max_length = 100, blank = True)
	timezone = models.CharField(max_length = 100, blank = True)
	summary = models.TextField()
	def __unicode__(self):
		return self.title

class Event(models.Model):
	calendar = models.ForeignKey(Calendar)
	title = models.CharField(max_length = 255)
	content = models.TextField(blank = True)
	start_time = models.DateTimeField()
	end_time = models.DateTimeField()
	location = models.CharField(max_length = 255)
	def __unicode__(self):
		return u'%s' % (self.title)
