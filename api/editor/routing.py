from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    re_path(r"api/document/(?P<room_name>\w+)/$", consumers.EditorConsumer.as_asgi()),
]
