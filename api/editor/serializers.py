from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Document


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ["url", "username", "document", "is_staff"]


class DocumentSerializer(serializers.HyperlinkedModelSerializer):
    collaborator = serializers.HyperlinkedRelatedField(
        many=True, read_only=True, view_name="user-detail"
    )

    class Meta:
        model = Document
        fields = ["id", "url", "title", "content", "owner", "collaborator"]
