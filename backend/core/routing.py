from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
import chat.routing
# from notification import routing as notification_routing

# the ProtocolTypeRouter takes in a dictionary of stuff such as
#websocket and its urls
application = ProtocolTypeRouter ({
    'websocket': AuthMiddlewareStack(
        URLRouter(
        chat.routing.websocket_urlpatterns
        )
    )
})
