from rest_framework import serializers
from ..models.document import Document

class DocumentSerializer(serializers.HyperlinkedModelSerializer):
    collaborator = serializers.HyperlinkedRelatedField(
        many=True, read_only=True, view_name="user-detail"
    )

    class Meta:
        model = Document
        fields = ["id", "url", "title", "content", "owner", "collaborator"]
