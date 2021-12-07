from django.conf.urls import url
from django.urls import path, include

from . import views

# The viewchats and viewmessages are used for viewing the data purposes
# only
urlpatterns = [

    path("UploadBusinessVid/", views.UploadBusinessVid.as_view(), name = "upload_vid_to_business"),

]
