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
from channels.security.websocket import AllowedHostsOriginValidator, OriginValidator
from editor.routing import websocket_urlpatterns
from editor.middlewares import TokenAuthMiddleWare

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "webstar.settings")

application = get_asgi_application()

print(repr(websocket_urlpatterns))
application = ProtocolTypeRouter(
    {
        "http": application,
        "websocket": TokenAuthMiddleWare(OriginValidator(
            AuthMiddlewareStack(URLRouter(websocket_urlpatterns)),
            ["http://localhost:3000", "http://127.0.0.1:3000"],
        ),)
    }
)
