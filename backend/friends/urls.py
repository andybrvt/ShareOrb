from django.conf.urls import url
from django.urls import path, include

from . import views

urlpatterns = [
	path('', views.UserFriendList.as_view(), name="users_list"),

    # url(r'^$', users_list, name='list'),




    # url(r'^(?P<slug>[\w-]+)/$', profile_view),
    # url(r'^friend-request/send/(?P<id>[\w-]+)/$', send_friend_request),
    # url(r'^friend-request/cancel/(?P<id>[\w-]+)/$', cancel_friend_request),
    # url(r'^friend-request/accept/(?P<id>[\w-]+)/$', accept_friend_request),
    # url(r'^friend-request/delete/(?P<id>[\w-]+)/$', delete_friend_request),
]
