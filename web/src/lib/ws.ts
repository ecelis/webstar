import { SocketMessage } from "./types";

export default function sendSocketMessage(
  socket: WebSocket | null,
  { type, payload }: SocketMessage
) {
  if (socket?.readyState !== WebSocket.OPEN) {
    console.error("WebSocket is not open");
    return;
  }

  const message: SocketMessage = {
    type,
    payload: type === "delta" ? JSON.parse(payload) : payload,
    timestamp: Date.now(),
  };

  socket.send(JSON.stringify(message));
}
