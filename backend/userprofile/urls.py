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
	path("testMobileView", views.TestMobileView.as_view(), name = "test_mobile"),
	path('userSearch/', views.UserSearchView.as_view(), name= "main_search" ),
	path('chatSearch/', views.UserChatSearchView.as_view(), name = "new_chat_search"),
	path('user-id/', views.UserIDView.as_view()),
	path('current-user/', views.current_user),
	path('grabCurrentUser/', views.GrabCurrentUser.as_view()),
	path('<slug:username>/', views.UserDetailView.as_view()),
	path('all-users', views.ListAll.as_view()),
	path('friend-request-list', views.FriendRequestList.as_view(), name="friend_request"),
	path('post/delete/<slug:id>', views.deletePostCall.as_view(), name='delete notification'),
	path('explore', views.ExploreView.as_view()),
	path('suggestedFriends', views.NewsFeedSuggestedFriends.as_view()),
	path('everyoneSuggested', views.everyoneSuggested.as_view()),
	path('suggestSuggested', views.suggestSuggested.as_view()),
	path('configSuggestSuggested', views.configSuggestedSuggest.as_view()),
	path('loadSuggested', views.loadMoreSuggestedView.as_view()),
	path('inviteList', views.inviteList.as_view()),
	# DELETE LATER
	path('friend-request/send/<slug:username>', views.SendFriendRequest.as_view(), name='send_request'),
	path('friend-request/cancel/<slug:username>', views.CancelFriendRequest.as_view(), name='cancel_request'),
	path('friend-request/accept/<slug:username>', views.AcceptFriendRequest.as_view(), name='accept_request'),
	path('friend-request/delete/<slug:username>', views.DeleteFriendRequest.as_view(), name='delete_request'),
	path('current-user/friends', views.FriendRequestsToUser.as_view(), name='friend_request_list'),
	path('remove-friend/<slug:username>', views.DeleteFriends.as_view(), name='delete_friend'),
	path('friendnotificationrequest', views.FriendNotification.as_view(), name='userprofile-friend-notifications'),


	path('add-like/<slug:id>/', views.AddOneLikeToPost.as_view(), name='curr post'),
	path('add-like-comment/<slug:id>/', views.AddOneLikeToComment.as_view(), name='curr post'),
	path('notifications/delete/<slug:id>', views.onDeleteNotification.as_view(), name='delete notification'),


	# Purpose: view comment not being used right now
	path('view-comment/<slug:postID>/<slug:commentID>/', views.ViewComment.as_view(), name='post comment'),

	# show all posts not being used right now
	path('userpost', views.PostTest.as_view(), name='test comment'),


	# show 3 comments per post IS being used right now
	path('commentsOnPost/<slug:postID>/', views.First3CommentsInPost.as_view(), name='comment on the posts'),

	# posting comment  IS being used right now
	path('testComment/<slug:postID>/', views.postCommentTest.as_view(), name='test comment'),

	# path('view-comment/<slug:postID>/<slug:commentID>/', views.ViewComment.as_view(), name='grab comment'),

	path('profile/update/<slug:id>', views.ProfileUpdate.as_view(), name = 'update profile'),

	path('test/test', views.UserSocialPostContentTypeView.as_view(), name = 'images test'),


	path('notification', views.NotificationView.as_view(), name = 'notification'),
	path('notification/create', views.NotificationCreateView.as_view(), name = 'create_notification'),
	path('notification/pendingPic/<slug:curId>/<slug:ownerId>', views.PendingPicNotificationView.as_view(), name = 'create_pending_pic_noti'),
	path('post', views.NewPostingView.as_view(), name = 'new_posting'),
	path('deletePost', views.DeletePostView.as_view(), name = "delete_post"),

	# This is used to edit user information
	path('editUserInfo', views.EditUserInfoView.as_view(), name = "edit_user_info"),
	# This will be used for changing the account from private to public
	path('privateChange', views.PrivateChangeView.as_view(), name = "change_private"),
	# This will be for accepting follow and seeing private
	path('approveFollow', views.onAcceptFollow.as_view(), name = "approve_follow"),
	path('declineFollow', views.onDeclineFollow.as_view(), name = "decline_follow"),
	path('onFollow', views.onFollowView.as_view(), name = "follow_user"),
	path('onUnfollow', views.onUnfollowView.as_view(), name = "unfollow_user"),
	path('sendFollowRequest', views.onSentRequestView.as_view(), name = 'send_follow_request'),
	path('unsendFollowRequest', views.onUnsendRequestView.as_view(), name = 'unsend_follow_request'),
	path('unShowIntialInstructions/<slug:id>', views.unShowIntialInstructions.as_view(), name = "unshow_intial_instruction"),
	path('resetNotificationSeen', views.resetNotificationSeen.as_view(), name = "reset_notification_seen"),
	path('onClearNotification', views.onClearNotification.as_view(), name = "clear_notification"),
	path('onWaitListAdd', views.WaitListEmailsView.as_view(), name = "add_user_wait_list"),
	path('onInviteListAdd', views.InviteListEmailView.as_view(), name = "add_user_invite_list"),
	path('addNotificationToken', views.AddUserNotificationToken.as_view(), name = "add_notification_token")

]
