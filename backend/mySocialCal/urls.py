from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter


urlpatterns = [
    path('items', views.SocialItemsView.as_view(), name = "socialCalendar_items"),
    path('userItems/<slug:username>', views.UserItemView.as_view(), name = "socialCalendar__user_items"),
    path('cells', views.SocialCalCellView.as_view(), name = 'socialCalendar_cells'),
    path('userCells/<slug:username>', views.UserCellsView.as_view(), name = 'socialCalendar_cells'),
    path('uploadPic/<slug:id>', views.SocialCalUploadPic.as_view(), name = 'socialCalendar_uploadpic'),
    path('updateCoverPic/<slug:id>', views.UpdateSocialCellCoverPic.as_view(), name = "socialCalendarCell_changeCoverPic"),
    path('updateCoverVid/<slug:id>', views.UpdateSocialCellCoverVid.as_view(), name = "socialCalendarCell_changeCoverPic"),
    path('uploadEvent', views.SocialEventCreateView.as_view(), name = 'socialCalendar_uploadEvent'),
    path('testTest', views.ShowSocialEvents.as_view(), name = "socialCalendar_test_view"),
    path('socialEvent/updatebackground/<slug:id>', views.SocialEventBackgroundUpdate.as_view(), name = "change_socialevent_background"),
    path('socialEvent/delete/<slug:id>', views.DeleteSocialEventView.as_view(), name = 'delete_social_event'),
    path('uploadPicture', views.SocialPictureCreateView.as_view(), name = "socialCalendar_uploadPic"),
    path('pictureClipping', views.SocialClippingView.as_view(), name = "picture_clipping"),
    path('changeCoverPic', views.SocialChangeCoverPic.as_view(), name = "change_cover_pic"),
    path("updateCurSocialCell/<slug:id>", views.SocialCapUploadNewsfeed.as_view(), name= "update_cur_social_cal_cell"),
    path("infiniteSocial/<str:curDate>/<int:start>/<int:addMore>", views.loadSocialPostView.as_view(), name = "infinite_social"),
    path("add-like-comment/<slug:id>/", views.AddOneLikeToComment.as_view(), name='curr post'),
    path("filterCells/<slug:userId>/<str:start>/<str:end>", views.grabSocialCellRangeView.as_view(), name = "filter social cell"),
    path("trendingDay", views.trendingSocialCellDay.as_view(), name = "trending_day"),
    path("exploreDay/<int:start>/<int:end>", views.exploreSocialCellDay.as_view(), name = "explore_day"),
    path("updateSinglePic/<slug:id>", views.SocialCalSingleUploadPic.as_view(), name = "socialCal_singlePic"),
    path("goalList/<int:id>", views.GoalAlbumStringView.as_view(), name = "goal_list"),
    path("createGoal/<int:userId>", views.GoalAlbumStringCreate.as_view(), name = "create_goal"),
    path("getGoal/<int:goalId>", views.GoalAlbumStringGet.as_view(), name = "get_goal"),
    path("updateSingleVid/<slug:id>", views.SocialCalSingleUploadVid.as_view(), name = "socialCal_singleVid"),
    path("suggestedGroups", views.SuggestedGroups.as_view(), name = "suggested_groups"),
    path('createSmallGroup', views.CreateSmallGroup.as_view(), name = "create_small_groups"),
    path('changeSGPublic/<slug:groupId>', views.ChangeSGPublic.as_view(), name = "change_small_group_public"),
    path('joinSmallGroup/<slug:groupId>/<slug:userId>', views.JoinSmallGroup.as_view(), name = "join_small_group"),
    path('leaveSmallGroup/<slug:groupId>/<slug:userId>', views.LeaveSmallGroup.as_view(), name = "leave_small_group"),
    path('grabMembers/<slug:groupId>', views.grabGroupMember.as_view(), name = "grab_group_members"),
    path("infiniteSmallGroup/<int:groupId>/<int:start>/<int:addMore>", views.loadSmallGroupPostView.as_view(), name = "infinite_small_group"),
    path("infiniteGlobe/<int:start>/<int:addMore>", views.loadMoreGlobeView.as_view(), name = "infinite_globe"),
    path('getSinglePost/<int:id>', views.getSinglePost.as_view(), name = "get_single_post"),
    path('getClosestOrb', views.getClosestOrb.as_view(), name = "get_closest_or"),
    path('getSmallGroupInfo/<int:id>', views.getSmallGroupInfo.as_view(), name = "get_small_group_info")
]
