from django.urls import re_path;

from . import consumers

# eventuall the chat Id will be of the name of the other user not the chat id

websocket_urlpatterns = [
    re_path(r'^ws/newChat/(?P<newChatId>\w+)$', consumers.NewChatConsumer)
]
