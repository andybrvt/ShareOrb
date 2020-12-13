from django.urls import re_path;

from . import consumers

# eventuall the chat Id will be of the name of the other user not the chat id
# All chats will be that of the users chats, which holds all the chats

websocket_urlpatterns = [
    re_path(r'^ws/newChat/(?P<newChatId>\w+)$', consumers.NewChatConsumer),
    re_path(r'^ws/allChats/(?P<chatsOwnerId>\w+)$', consumers.NewChatSidePanelConsumer)
]
