from django.db import models


class Document(models.Model):
    content = models.TextField(default="")
    owner = models.ForeignKey(
        "auth.User", related_name="document", on_delete=models.RESTRICT
    )
    collaborator = models.ManyToManyField(
        "auth.User", through="DocumentCollaborator", related_name="collaborator"
    )
    title = models.CharField(
        max_length=255, blank=True, null=True, default="Untitled document"
    )

    def __str__(self):
        return self.title


class DocumentCollaborator(models.Model):
    user = models.ForeignKey("auth.User", on_delete=models.RESTRICT)
    document = models.ForeignKey(Document, on_delete=models.RESTRICT)

    class Meta:
        unique_together = ("user", "document")
