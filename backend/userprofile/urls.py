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


urlpatterns = [
	path('', include(router.urls))
]
