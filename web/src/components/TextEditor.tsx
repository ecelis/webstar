import Quill, { Delta } from "quill";
import { useCallback, useEffect, useState } from "react";

function sendText(text: string) {
  const msg = {
    type: "message",
    text: text,
    id: "clientID",
    date: Date.now(),
  };

  // Send the msg object as a JSON-formatted string.
  return JSON.stringify({ message: text });

  // Blank the text input element, ready to receive the next line of text from the user.
  // document.getElementById("text").value = "";
}
const TextEditor = function () {
  const [client, setClient] = useState<WebSocket | null>(null);
  const [quill, setQuill] = useState<Quill | null>(null);

  useEffect(() => {
    if (client === null || quill || null) return;

    const ws = new WebSocket("ws://localhost:8000/ws/editor/lobby/");
    ws.addEventListener("error", console.error);
    setClient(ws);
    // return () => {
    //   ws.close();
    // };
  }, []);

  // useEffect(() => {
  //   console.log('lege', client, quill)
  //   if (client === null || quill === null) return;

  //   const onTextChange = (delta: Delta, oldDelta: Delta, source: string) => {
  //     console.log(delta);
  //     if (source !== "user") return;
  //     client?.send(JSON.stringify(delta));
  //   };
    
  //   quill?.on("text-change", onTextChange);

  //   // return () => { quill?.off("text-change", onTextChange)}
  // }, [client, quill]);

  const editorRef = useCallback((container: HTMLDivElement) => {
    if (container === null) return;
    container.textContent = "";
    const editor = document.createElement("div");
    container.append(editor);
    setQuill(new Quill(editor, { theme: "snow" }));
  }, []);

  return <div id="editor" ref={editorRef}></div>;
};

export default TextEditor;
