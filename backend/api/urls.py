from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('profiles', views.ProfileViewSet)

urlpatterns = [
	path('', include(router.urls))
	# path('profiles/', views.ProfileViewSet.as_view(), name ='profiles'),
	# path('profiles/<pk>', views.ProfileDetailView.as_view(), name ='profileID'),

]
