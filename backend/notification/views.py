# Create your views here.
from django.http import JsonResponse
from django.shortcuts import render

from userprofile.models import CustomNotification


def mark_like_comment_notifications_as_read(request):
    CustomNotification.objects.filter(recipient=request.user, type="comment").update(unread=False)
    return JsonResponse({
        'status': True,
        'message': "Marked all notifications as read"
    })


def create_comment(request, post_id=None):
    if request.method == "POST":
        post = Post.objects.get(id=post_id)
        comment = post.comments.create(user=request.user, content=request.POST.get('content'))
        notification = CustomNotification.objects.create(type="comment", recipient=post.user, actor=request.user, verb="commented on your post")
        channel_layer = get_channel_layer()
        channel = "comment_like_notifications_{}".format(post.user.username)
        async_to_sync(channel_layer.group_send)(
            channel, {
                "type": "notify",
                "command": "new_like_comment_notification",
                "notification": json.dumps(NotificationSerializer(notification).data)
            }
        )
        return redirect(reverse_lazy('core:home'))
    else:
        return redirect(reverse_lazy('core:home'))
