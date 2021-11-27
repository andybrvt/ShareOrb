from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter

urlpatterns = [
    path('getRequests', views.getRequests.as_view(), name = "get_user_request"),
    path('postRequest/<int:userId>', views.postRequest.as_view(), name = "post_request"),
    path('postResponse/<int:userId>/<int:requestId>', views.postResponse.as_view(), name = "post_request"),
    path('likeRequest/<int:userId>/<int:requestId>', views.likeRequest.as_view(), name = "liking_request"),
    path('unlikeRequest/<int:userId>/<int:requestId>', views.unlikeRequest.as_view(), name = "liking_request"),
    path('loadMoreRequest/<int:start>/<int:addMore>', views.loadMoreRequest.as_view(), name = "load_more_request"),
    path('getSingleRequest/<int:requestId>', views.getSingleRequest.as_view(), name = "get_single_request")
]
