from rest_framework.permissions import (
    BasePermission,
    SAFE_METHODS,
)

class IsOwnerOrCollaborator(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return obj.owner == request.user or request.user in obj.collaborator.all()
