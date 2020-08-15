from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter


urlpatterns = [
    path('cells', views.SocialCalCellView.as_view(), name = 'socialCalendar_cells')
]
