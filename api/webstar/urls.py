"""
URL configuration for webstar project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import include, path
from rest_framework import routers
from editor.views import UserViewSet, RegisterView, LoginView, LogoutView
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.csrf import ensure_csrf_cookie


API_PREFIX = "api/"


@ensure_csrf_cookie
def get_csrf_token(request):
    return JsonResponse({"csrfToken": request.META.get("CSRF_COOKIE")})


router = routers.DefaultRouter()
router.register(r"user", UserViewSet, basename="user")

urlpatterns = [
    path(API_PREFIX, include(router.urls)),
    path(API_PREFIX + "document/", include("editor.urls")),
    path(API_PREFIX + "admin/", admin.site.urls),
    path(API_PREFIX + "auth/", include("rest_framework.urls")),
    path(API_PREFIX + "csrf/", csrf_exempt(get_csrf_token)),
    path(API_PREFIX + "register/", RegisterView.as_view(), name="register"),
    path(API_PREFIX + "login/", LoginView.as_view(), name="login"),
    path(API_PREFIX + "logout/", LogoutView.as_view(), name="logout"),
]
