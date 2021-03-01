# This is for the urls of the app
from django.conf.urls import url
from django.urls import path, include

from . import views

# The viewchats and viewmessages are used for viewing the data purposes
# only
urlpatterns = [
    path("", views.NewChatListView.as_view()),
    path("viewChats", views.ChatView.as_view(), name = "view_chat" ),
    path("viewMessages", views.MessageView.as_view(), name = "view_messages"),
    path("getChat", views.GetChatSearchView.as_view(), name = "get_searched_chat"),
    path("createChat", views.CreateNewChatView.as_view(), name = "create_new_chat"),
    path("getExisitingChat", views.GetIndividualExisitingChat.as_view(), name = "get_exisiting_chat"),
    path("createChatEventMessage", views.CreateChatEventMessage.as_view(), name = "create_chat_event_message"),
    path("createNewChatEventMessage", views.CreateNewChatEventMessage.as_view(), name = "create_new_chat_event_message"),
    path("acceptEventInChat", views.AcceptEventInChatView.as_view(), name = "accept_event_in_chat"),
    path("declineEventInChat", views.DeclineEventInChat.as_view(), name = "decline_event_in_chat")
]
