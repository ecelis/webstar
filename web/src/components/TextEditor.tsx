import Quill, { Delta } from "quill";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getData } from "../lib/auth";
import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Drawer from "@mui/material/Drawer";
import Paper from "@mui/material/Paper";
import ShareDocument from "./ShareDocument";
import sendSocketMessage from "../lib/ws";

const TextEditor = function () {
  const [auth, setAuth] = useState(sessionStorage.getItem("wsauth"));
  const [client, setClient] = useState<WebSocket | null>(null);
  const [quill, setQuill] = useState<Quill | null>(null);
  const [open, setOpen] = useState(false);
  const { documentId } = useParams();

  const editorRef = useCallback((container: HTMLDivElement) => {
    if (container === null) return;
    container.textContent = "";
    const editor = document.createElement("div");
    container.append(editor);
    const _quill = new Quill(editor, { theme: "snow" });
    setQuill(_quill);
  }, []);

  useEffect(() => {
    // Connect to documentId's room
    if (!documentId) return;
    const ws = new WebSocket(
      `ws://localhost:8000/api/document/${documentId}/?token=${getData(
        "token"
      )}`
    );
    ws.addEventListener("error", console.error);
    setClient(ws);
  }, [documentId]);

  useEffect(() => {
    // User changes text
    if (quill === null) return;

    const onTextChange = (delta: Delta, oldDelta: Delta, source: string) => {
      if (source !== "user") return;
      sendSocketMessage(client, {
        type: "delta",
        payload: JSON.stringify(delta),
      });
    };

    quill?.on("text-change", onTextChange);
  }, [quill]);

  useEffect(() => {
    // Remote changes updates contents
    const onMessage = (event: MessageEvent<any>) => {
      try {
        const data = JSON.parse(event.data);

        switch (data.type) {
          case "text":
            quill?.setText(data.payload);
            break;
          case "delta":
            quill?.updateContents(data.payload);
            break;
          default:
            console.log("default", data);
        }
      } catch (e) {
        console.log(e);
      }
    };
    // @ts-ignore
    if (client) client.addEventListener("message", onMessage);
  }, [quill, client]);

  useEffect(() => {
    if (client === null || quill === null) return;
    client.onclose = function () {
      console.log("WebSocket is closed now.");
    };
    client.onerror = function (error) {
      console.error("WebSocket error:", error);
    };
  }, [client, quill, documentId]);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return auth ? (
    <Box>
      <ButtonGroup variant="contained" aria-label="Document controls">
        <Button>Save</Button>
        <Button variant="outlined" onClick={toggleDrawer}>
          Share
        </Button>
      </ButtonGroup>
      <Paper sx={{ height: "100%", width: "100%" }}>
        {" "}
        <div id="editor" ref={editorRef}></div>
      </Paper>
      <Drawer
        sx={{
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 290 },
        }}
        variant="persistent"
        anchor="right"
        open={open}
        onClose={toggleDrawer}
      >
        <ShareDocument documentId={documentId} />
      </Drawer>
    </Box>
  ) : (
    <h1>Access denied</h1>
  );
};

export default TextEditor;
