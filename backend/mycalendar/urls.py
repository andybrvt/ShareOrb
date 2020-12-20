from django.conf.urls import url
from django.urls import path, include

from . import views

urlpatterns = [
    path('', views.CalendarView.as_view(), name="event_list"),
    path('allevents/', views.AllEventsView.as_view()),
    path('events', views.CalendarEventsView.as_view()),
    path('avaliEvents', views.CalendarCurEventView.as_view()),
    path('testEvents/', views.CalendarTestEventsView.as_view()),
    path('events/create/', views.CalendarEventsCreate.as_view()),
    path('events/update/<slug:id>', views.CalendarEventUpdate.as_view()),
    path('events/delete/<slug:id>', views.CalendarEventDelete.as_view()),
    path('events/updatebackground/<slug:id>', views.EventBackgroundUpdate.as_view()),
    path('shareEvent', views.ShareEventInChatsView.as_view())
]
