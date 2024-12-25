from django.contrib.auth.models import User
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from ..serializers.document import DocumentSerializer
from ..serializers.user import UserSerializer
from ..models.document import Document
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from ..permissions import IsOwnerOrCollaborator


class DocumentViewSet(viewsets.ModelViewSet):
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrCollaborator]

    def get_queryset(self):
        user = self.request.user
        return (
            Document.objects.select_related("owner")
            .prefetch_related("collaborator")
            .filter(Q(owner=user) | Q(collaborator=user))
            .distinct()
        )

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def create(self, request):
        try:
            data = request.data
            user_serializer = UserSerializer(request.user, context={'request': request})
            user_url = user_serializer.data['url']
            data["owner"] = user_url
            serializer = DocumentSerializer(data=data)
            if not serializer.is_valid():
                print("Validation errors:", serializer.errors)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            return super().create(request)
        except Exception as e:
            print("Error:", str(e))
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        request_keys = request.data.keys()
        if "content" in request_keys:
            try:
                serializer = self.get_serializer(
                    instance, data=request.data, partial=True
                )
                serializer.is_valid(raise_exception=True)
                serializer.save(content=request.data["content"])
            except Exception as e:
                print(f"Document content partial_update failed {e}")

        if "collaborator" in request_keys:
            collaborator_urls = request.data.get("collaborator", [])
            collaborator_ids = [url.split("/")[-2] for url in collaborator_urls]

            try:
                collaborators = User.objects.filter(id__in=map(int, collaborator_ids))

                serializer = self.get_serializer(
                    instance, data=request.data, partial=True
                )
                serializer.is_valid(raise_exception=True)
                serializer.save(collaborator=collaborators)
            except Exception as e:
                print(f"Document collaborator partial_update failed {e}")

        return Response(serializer.data)
