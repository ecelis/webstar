import json
from django.db.models import Q

from channels.generic.websocket import AsyncWebsocketConsumer
from editor.models import Document


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
            await self.channel_layer.group_add(self.room_group_name, self.channel_name)

            await self.accept()
        except Exception as e:
            print(f"Connection failed {str(e)}")

    async def disconnect(self, close_code):
        print(f"Bye!")
        try:
            await self.channel_layer.group_discard(
                self.room_group_name, self.channel_name
            )
        except Exception as e:
            print(f"Disconect failed {str(e)}")

    async def receive(self, text_data):
        try:
            text_data_json = json.loads(text_data)
            print("receive")
            print(repr(text_data))
            # message = text_data_json["message"]
            # # Send message to room group
            await self.channel_layer.group_send(
                self.room_group_name, {"type": "editor.message", "message": text_data}
            )
        except Exception as e:
            print(f"receive failed {str(e)}")

    async def editor_message(self, event):
        try:
            message = event["message"]
            print("Editor message")
            print(repr(message))
            await self.send(text_data=json.dumps({"message": message}))
        except Exception as e:
            print(f"editor_message failed {str(e)}")
