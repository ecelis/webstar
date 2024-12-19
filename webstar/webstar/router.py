from .asgi import django_asgi_app
from channels.routing import ProtocolTypeRouter


application = ProtocolTypeRouter(
    {
        "http": django_asgi_app,
        # Just HTTP for now. (We can add other protocols later.)
    }
)
