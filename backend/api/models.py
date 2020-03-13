from django.db import models

# Create your models here.

class Newsfeed(models.Model):
    # this model is to hold all the first name,last name, email
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    email = models.EmailField(max_length = 254)

    def __str__(self):
    	return self.first_name
