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
    path("getChat", views.GetChatSearchView.as_view(), name = "get_searched_chat")
]
