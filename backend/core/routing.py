from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from notification import routing as notification_routing

# the ProtocolTypeRouter takes in a dictionary of stuff such as
#websocket and its urls
application = ProtocolTypeRouter ({
    "websocket": AuthMiddlewareStack(
    URLRouter(
        notification_routing.websocket_urlpatterns
    )),
})
