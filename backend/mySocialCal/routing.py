from django.urls import re_path;

from . import consumers

websocket_urlpatterns = [
    re_path(r'^ws/socialCalendarEvent/(?P<socialEventId>\w+)$', consumers.SocialCalandarConsumer),
    re_path(r'^ws/socialCalendarCellPage/(?P<user>\w.+)/(?P<year>\w+)/(?P<month>\w+)/(?P<day>\w+)$', consumers.SocialCalCellConsumer),
    re_path(r'^ws/socialNewsfeed', consumers.NewSocialCellEventNewsfeed),
    re_path(r'^ws/socialComments/(?P<cellId>\w+)$', consumers.SocialCommentConsumer),
    re_path(r'^ws/newSocialCalendarCellPage/(?P<cellId>\w+)$', consumers.NewSocialCalCellConsumer)
]
