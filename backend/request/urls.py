from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter

urlpatterns = [
    path('getRequests', views.getRequests.as_view(), name = "get_user_request"),
    path('postRequest/<int:userId>', views.postRequest.as_view(), name = "post_request")
]
