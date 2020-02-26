from rest_framework.views import APIView
from rest_framework.response import Response 
from rest_framework import status
from rest_framework import generics
from rest_framework import viewsets
from . import models
from .serializers import ProfileSerializer


# Create your views here.

# class ProfileListView(APIView):
# 	serializer_class = ProfileSerializer
# 	def get (self, request, format =None):
# 		an_apiview = ['asdfasdfdasf'
# 		] 

# 		return Response ({})
# 	def post(self, request):
# 		serializer = self.serializer_class(data=request.data)

# 		if serializer.is_valid():
# 			name = serializer.validated_data.get('first_name') 
# 			return Response ({'message': name})

# 	def put(self, request, pk =id):
# 		return Response({'method': 'PUT'})

# 	def patch(self, request, pk=None):
# 		return Response({'method': 'Patch'})

# 	def delete(self, request, pk=None):
# 		return Response({'method': 'Detele'})



# 	serializer_class = ProfileSerializer
# 	queryset = models.Profile.objects.all() 
# 	d


# class ProfileDetailView(generics.RetrieveUpdateAPIView):
# 	serializer_class= ProfileSerializer
# 	queryset = models.Profile.objects.all()


class ProfileViewSet(viewsets.ModelViewSet):
	serializer_class = ProfileSerializer
	queryset = models.Profile.objects.all()