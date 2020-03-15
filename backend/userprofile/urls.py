from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter

# routes all the viewsets so it can be called by the
#main url page
router = DefaultRouter()
# #register all the views into routers. the first paramter
# # is basically the name of the url function
router.register('list', views.PostListView)
router.register('infinite-post', views.ReactInfiniteView, basename ='Postfeed')
router.register('profile-post', views.PostUpdateView, basename='Profilepost')




urlpatterns = [
	path('', include(router.urls)),
	path('blah2/<slug:username>/', views.UserDetailView.as_view()),
]
