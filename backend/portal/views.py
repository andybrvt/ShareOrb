from django.shortcuts import render

# Create your views here.
class UploadBusinessVid(APIView):
    def post(self, request, *args, **kwargs):

        businessVidUpload = models.BusinessVid.objects.create(
            email = request.data['email'],
            vid = request.data['vidSubmit'].lstrip("/media"),
        )
        serializedItem = serializers.UploadSingleVidSerializer(businessVidUpload).data

        content = {
             'item': serializedItem,
             # "cellId": socialCalCellNew.id
         }
        return Response(content)
