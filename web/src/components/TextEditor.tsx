import Quill, { Delta } from "quill";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface SocketMessage {
  type: "document" | "text" | "delta";
  payload?: string | null;
  timestamp?: number;
}

function sendSocketMessage(
  socket: WebSocket | null,
  { type, payload }: SocketMessage
) {
  if (socket?.readyState !== WebSocket.OPEN) {
    console.error("WebSocket is not open");
    return;
  }

  const message: SocketMessage = {
    type,
    payload,
    timestamp: Date.now(),
  };

  socket.send(JSON.stringify(message));
}

const TextEditor = function () {
  const [client, setClient] = useState<WebSocket | null>(null);
  const [quill, setQuill] = useState<Quill | null>(null);
  const { documentId } = useParams();

  const editorRef = useCallback((container: HTMLDivElement) => {
    if (container === null) return;
    container.textContent = "";
    const editor = document.createElement("div");
    container.append(editor);
    const _quill = new Quill(editor, { theme: "snow" });
    _quill.disable();
    _quill.setText("Loading");
    setQuill(_quill);
  }, []);

  useEffect(() => {
    if (!documentId) return;
    const ws = new WebSocket(`ws://localhost:8000/ws/editor/${documentId}/`);
    ws.addEventListener("error", console.error);
    // ws.addEventListener("message", onMessage)
    setClient(ws);
    // return () => {
    //   ws.close();
    // };
  }, [documentId]);

  useEffect(() => {
    if (quill === null) return;

    const onTextChange = (delta: Delta, oldDelta: Delta, source: string) => {
      if (source !== "user") return;
      // client?.send(JSON.stringify(delta));
    };

    quill?.on("text-change", onTextChange);

    return () => {
      quill?.off("text-change", onTextChange);
    };
  }, [quill]);

  useEffect(() => {
    const onMessage = (event: MessageEvent<any>) => {
      const { message } = JSON.parse(event.data);
      const delta: Delta = JSON.parse(message) as Delta;
      quill?.updateContents(delta);
    };
    // @ts-ignore
    if (client) client.addEventListener("message", onMessage);
  }, [quill, client]);

  useEffect(() => {
    console.log(documentId);
    if (client === null || quill === null) return;
    console.log(client, client.readyState, quill);

    client.onopen = function () {
      console.log("WebSocket is open now.");
      // quill.setContents(document)
      // quill.enable()
      // client.send(JSON.stringify({ documentId: documentId }));
      sendSocketMessage(client, { type: "document", payload: documentId });
    };
    client.onclose = function () {
      console.log("WebSocket is closed now.");
    };
    client.onerror = function (error) {
      console.error("WebSocket error:", error);
    };
    // Attempt to send a message immediately
    // if (client.readyState === WebSocket.OPEN) {
    //  client.send(JSON.stringify({documentId: documentId}));
    // } else {
    //   console.log("WebSocket is not open yet. Waiting for connection...");
    // }
  }, [client, quill, documentId]);

  return <div id="editor" ref={editorRef}></div>;
};

export default TextEditor;
