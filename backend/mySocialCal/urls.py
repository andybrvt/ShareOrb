from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter


urlpatterns = [
    path('cells', views.SocialCalCellView.as_view(), name = 'socialCalendar_cells'),
    path('uploadPic/<slug:id>', views.SocialCalUploadPic.as_view(), name = 'socialCalendar_uploadpic'),
    path('uploadEvent', views.SocialEventCreateView.as_view(), name = 'socialCalendar_uploadEvent'),
    path('testTest', views.ShowSocialEvents.as_view(), name = "socialCalendar_test_view")
]
