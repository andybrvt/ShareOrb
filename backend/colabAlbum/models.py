from django.db import models
from django.conf import settings
from django.utils import timezone

# This will be the model that lets you create a colab album with your friends
class ColabAlbum(models.Model):
    # gonna need a many to many inorder to hold all the users
    # make another model to hold the pictures, this will be a
    # foregin key
    # title
    # When the album was created
    person = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name = "albumPeople", blank = True)
    title = models.CharField(max_length = 255)
    coverPic = models.ImageField(('post_picture'), upload_to = 'post_pictures/%Y/%m', blank = True)
    created_at = models.DateTimeField(default = timezone.now, blank = False)

    def get_colabItems(self):
        #  this is to get the pictures that are assoicated with the colab album

        return ColabItems.objects.filter(colabAlbum= self).values_list("id", flat = True)


class ColabItems(models.Model):
    # for this one you will need the creator of the image
    # the date it is created on
    # the image that it goes with
    # and a foregin key that connects it to the specific colabalbum
    created_at = models.DateTimeField(auto_now_add = True)
    creator = models.ForeignKey(settings.AUTH_USER_MODEL, related_name = 'colab_picture_owner', on_delete = models.CASCADE)
    itemImage = models.ImageField(('post_picture'), upload_to = 'post_pictures/%Y/%m', blank = True)
    colabAlbum = models.ForeignKey(ColabAlbum, on_delete = models.CASCADE, related_name = 'colabAlbum', null = True)

    class Meta:
        ordering = ['created_at']
