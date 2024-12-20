import Quill from "quill";
import { useCallback, useEffect, useState } from "react";

const TextEditor = function () {
  const [client, setClient] = useState(null);
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws/editor/lobby/");
    ws.addEventListener("error", console.error);
  }, []);
  const editorRef = useCallback((container: HTMLDivElement) => {
    if (container === null) return;
    container.textContent = "";
    const editor = document.createElement("div");
    container.append(editor);
    new Quill(editor, { theme: "snow" });
  }, []);
  return (
    <div>
      <div id="editor" ref={editorRef}></div>
    </div>
  );
};

export default TextEditor;
