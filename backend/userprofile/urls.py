from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter

# routes all the viewsets so it can be called by the
#main url page
router = DefaultRouter()
# #register all the views into routers. the first paramter
# is basically the name of the url function
router.register('list', views.PostListView)
router.register('infinite-post', views.ReactInfiniteView, basename ='Postfeed')

# router.register('profile-post', views.PostCreateView, basename='Profilepost')


# when using viewSets you have to put it in routers
# when using APIView you have to put it in as veiws.PUTVIEWHERE.as_view()),

urlpatterns = [
	path('', include(router.urls)),
	path('user-id/', views.UserIDView.as_view()),
	path('current-user/', views.current_user),
	path('<slug:username>/', views.UserDetailView.as_view()),
	path('all-users', views.ListAll.as_view()),
	path('friend-request-list', views.FriendRequestList.as_view(), name="friend_request"),
	path('exclude-user', views.UserList.as_view()),
	path('friend-request/send/<slug:username>', views.SendFriendRequest.as_view(), name='send_request'),
	path('friend-request/cancel/<slug:username>', views.CancelFriendRequest.as_view(), name='cancel_request'),
	path('friend-request/accept/<slug:username>', views.AcceptFriendRequest.as_view(), name='accept_request'),
	path('friend-request/delete/<slug:username>', views.DeleteFriendRequest.as_view(), name='delete_request'),
	path('current-user/friends', views.FriendRequestsToUser.as_view(), name='friend_request_list'),

	path('remove-friend/<slug:username>', views.DeleteFriends.as_view(), name='delete_friend'),



]
