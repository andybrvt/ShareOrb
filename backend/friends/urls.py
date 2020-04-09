from django.conf.urls import url
from django.urls import path, include

from . import views

urlpatterns = [
	path('', views.UserList.as_view(), name="users_list"),
	path('<slug:user>', views.UserFriendList.as_view(), name = "friend_page"),
	path('friendrequestList', views.FriendRequestList.as_view(), name="friend_request"),
	path('friend-request/send/<slug:username>', views.SendFriendRequest.as_view(), name='send_request'),
	path('friend-request/cancel/<slug:id>', views.CancelFriendRequest.as_view(), name='cancel_request'),
	path('friend-request/accept/<slug:id>', views.AcceptFriendRequest.as_view(), name='accept_request'),
	path('friend-request/delete/<slug:id>', views.DeleteFriendRequest.as_view(), name='delete_request'),
	path('friends-notifications/', views.FriendNotification.as_view(), name='friend_request_notifications'),
    # url(r'^$', users_list, name='list'),




    # url(r'^(?P<slug>[\w-]+)/$', profile_view),
    # url(r'^friend-request/send/(?P<id>[\w-]+)/$', send_friend_request),
    # url(r'^friend-request/cancel/(?P<id>[\w-]+)/$', cancel_friend_request),
    # url(r'^friend-request/accept/(?P<id>[\w-]+)/$', accept_friend_request),
    # url(r'^friend-request/delete/(?P<id>[\w-]+)/$', delete_friend_request),
]
