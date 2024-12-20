import Quill from "quill";
import { useCallback } from "react";

const TextEditor = function () {
  const editorRef = useCallback((container: HTMLDivElement) => {
    if (container === null) return;
    container.innerHTML = "";
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
