from django.conf.urls import url
from django.urls import path, include

from . import views

urlpatterns = [
    path('', views.CalendarEventsView.as_view(), name="event_list"),
    path('events', views.CalendarEventsView.as_view())
]
