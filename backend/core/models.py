class Newsfeed(models.Model):
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)

    def __str__(self):
    	return self.first_name

    class Meta:
        managed = False
        db_table = 'newsfeed'
