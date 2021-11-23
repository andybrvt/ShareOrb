from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter

urlpatterns = [
    path('getRequests', views.getRequests.as_view(), name = "get_user_request")
]
