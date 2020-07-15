from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    re_path(r'^ws/friend-request-notification/(?P<username>\w+)$', consumers.FriendRequestConsumer),
    # re_path(r'^ws/like-commenting-post/(?P<postId>\w+)$', consumers.LikeCommentConsumer),
    re_path(r'^ws/newsfeed', consumers.LikeCommentConsumer),

]
