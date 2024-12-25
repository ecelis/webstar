from django.urls import path, include
from rest_framework import routers
from .views.document import DocumentViewSet

router = routers.DefaultRouter()
router.register(r"", DocumentViewSet, basename="document")

urlpatterns = [
    path("", include(router.urls)),
]
