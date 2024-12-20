"""
ASGI config for webstar project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from channels.security.websocket import AllowedHostsOriginValidator
from editor.routing import websocket_urlpatterns

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "webstar.settings")

application = get_asgi_application()


application = ProtocolTypeRouter(
    {
        "http": application,
        # Just HTTP for now. (We can add other protocols later.)
        "websocket": AllowedHostsOriginValidator(
            AuthMiddlewareStack(
                URLRouter(
                    websocket_urlpatterns
                    # [
                    #     re_path(
                    #         r"^front(end)/$", consumers.AsyncChatConsumer.as_asgi()
                    #     ),
                    # ]
                )
            )
        ),
    }
)
