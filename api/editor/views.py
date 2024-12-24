from rest_framework import viewsets
from rest_framework.permissions import (
    IsAuthenticated,
    IsAdminUser,
)
from .serializers import UserSerializer, DocumentSerializer
from .models import Document
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from django.contrib.auth import authenticate


class DocumentViewSet(viewsets.ModelViewSet):
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Document.objects.filter(owner=user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def create(self, request):
        try:
            serializer = DocumentSerializer(data=request.data)
            if not serializer.is_valid():
                print("Validation errors:", serializer.errors)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            return super().create(request)
        except Exception as e:
            print("Error:", str(e))
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        collaborator_urls = request.data.get("collaborator", [])
        collaborator_ids = [url.split("/")[-2] for url in collaborator_urls]

        try:
            collaborators = User.objects.filter(id__in=map(int, collaborator_ids))

            serializer = self.get_serializer(instance, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save(collaborator=collaborators)
        except Exception as e:
            print(f"Document partial_update failed {e}")

        return Response(serializer.data)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.request.user.is_staff:
            permission_classes = [IsAdminUser]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        if username and password:
            user = User.objects.create_user(username=username, password=password)
            token, _ = Token.objects.get_or_create(user=user)
            return Response(
                {"username": username, "token": token.key},
                status=status.HTTP_201_CREATED,
            )
        return Response({"error": "Invalid data"}, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(username=username, password=password)
        if user:
            token, _ = Token.objects.get_or_create(user=user)
            return Response(
                {"username": username, "token": token.key}, status=status.HTTP_200_OK
            )
        return Response(
            {"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED
        )


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            request.user.auth_token.delete()
            return Response(
                {"message": "Successfully logged out"}, status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {"error": "Logout failed"}, status=status.HTTP_400_BAD_REQUEST
            )
