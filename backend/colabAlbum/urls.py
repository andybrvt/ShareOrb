from django.conf.urls import url
from django.urls import path, include

from . import views

urlpatterns = [
    path("", views.ColabAlbumView.as_view(), name = "colabAlbum_list"),
    path("getAlbums", views.UserColabAlbumView.as_view(), name = "get_colabAlbum"),
    path("getLiveAlbums", views.LiveUserColabAlbumView.as_view(), name = "get_liveColab_album")
]
