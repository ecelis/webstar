from django.contrib.auth.models import User
from rest_framework import serializers


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ["url", "username", "document", "is_staff"]
        extra_kwargs = {
            'url': {'view_name': 'user-detail', 'lookup_field': 'pk'}
        }
