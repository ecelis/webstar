import json

from channels.generic.websocket import AsyncWebsocketConsumer


class EditorConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print("Client connected")
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = self.room_name
        print(repr(self.room_group_name))
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        await self.accept()

    async def disconnect(self, close_code):
        print(f"Bye! {self.room_group_name}")
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        # message = text_data_json["message"]
        # # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name, {"type": "editor.message", "message": text_data}
        )

    async def editor_message(self, event):
        message = event["message"]

        await self.send(text_data=json.dumps({"message": message}))
