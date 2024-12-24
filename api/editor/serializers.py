from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Document


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ["url", "username", "document", "is_staff"]


class DocumentSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Document
        fields = ["id", "title", "content"]
