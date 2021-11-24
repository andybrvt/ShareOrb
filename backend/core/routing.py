from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
import chat.routing
import userprofile.routing
import mycalendar.routing
import mySocialCal.routing
import newChat.routing
import colabAlbum.routing
import request.routing
from channels.http import AsgiHandler
from channels.routing import ProtocolTypeRouter, URLRouter

from core.token_auth import TokenAuthMiddlewareStack



# from notification import routing as notification_routing

# the ProtocolTypeRouter takes in a dictionary of stuff such as
#websocket and its urls
application = ProtocolTypeRouter ({
    'websocket': AuthMiddlewareStack(
        URLRouter(
        userprofile.routing.websocket_urlpatterns
        + chat.routing.websocket_urlpatterns
        + mycalendar.routing.websocket_urlpatterns
        + mySocialCal.routing.websocket_urlpatterns
        + newChat.routing.websocket_urlpatterns
        + colabAlbum.routing.websocket_urlpatterns
        + request.routing.websocket_urlpatterns
        )
    )
})
