import json
from django.db import IntegrityError
from django.db.models import Q

from channels.generic.websocket import AsyncWebsocketConsumer
from editor.models import Document
from django.core import serializers
from asgiref.sync import sync_to_async


class EditorConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]
        if self.user.username == "":
            self.close()
            return

        try:
            self.room_name = self.scope["url_route"]["kwargs"]["room_name"]

            document = await Document.objects.filter(
                Q(id=self.room_name) & (Q(owner=self.user) | Q(collaborator=self.user))
            ).afirst()

            if not document:
                document = await Document.objects.acreate(
                    id=self.room_name, owner=self.user
                )

            self.room_group_name = self.room_name

            await self.accept()
            await self.channel_layer.group_add(self.room_group_name, self.channel_name)
            await self.send(json.dumps({"type": "text", "payload": document.content}))
        except (Exception, IntegrityError) as e:
            if type(e).__name__ == "IntegrityError":
                await self.send(
                    text_data=json.dumps({"type": "info", "payload": "Denied"})
                )
                self.close()
            print(f"Connection failed {str(e)}")

    async def disconnect(self, close_code):
        try:
            await self.channel_layer.group_discard(
                self.room_group_name, self.channel_name
            )
            print("Bye!")
        except Exception as e:
            print(f"Disconect failed {str(e)}")

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            if data["type"] == "delta":
                sender_channel = self.channel_name
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        "type": "editor.message",
                        "payload": data["payload"],
                        "sender_channel": sender_channel,
                    },
                )

            # if data["type"] == "save":
            #     print(repr(data))
            #     document, _ = await sync_to_async(Document.objects.get_or_create)(id=int(self.room_group_name))
            #     print(_)
            #     await sync_to_async(document.save)()
            #     print(repr(document ))

        except Exception as e:
            print(f"receive failed {str(e)}")

    async def editor_message(self, event):
        try:
            if event["type"] == "editor.message":
                if self.channel_name != event["sender_channel"]:
                    await self.send(
                        text_data=json.dumps(
                            {"type": "delta", "payload": event["payload"]}
                        )
                    )
        except Exception as e:
            print(f"editor_message failed {str(e)}")
