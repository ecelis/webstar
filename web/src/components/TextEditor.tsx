import Quill, { Delta } from "quill";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getData } from "../lib/auth";
import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import Paper from "@mui/material/Paper";
import { DataGrid, GridRenderCellParams } from "@mui/x-data-grid";
import ShareDocument from "./ShareDocument";

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
    // _quill.disable();
    // _quill.setText("Loading");
    setQuill(_quill);
  }, []);

  useEffect(() => {
    // Connect to documentId's room
    console.log("documentId", documentId);
    if (!documentId) return;
    const ws = new WebSocket(
      `ws://localhost:8000/api/document/${documentId}/?token=${getData(
        "token"
      )}`
    );
    ws.addEventListener("error", console.error);
    // ws.addEventListener("message", onMessage)
    setClient(ws);
    // return () => {
    //   ws.close();
    // };
  }, [documentId]);

  useEffect(() => {
    // User changes text
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
    // Remote changes updates contentss

    const onMessage = (event: MessageEvent<any>) => {
      const { message } = JSON.parse(event.data);
      const delta: Delta = JSON.parse(message) as Delta;
      quill?.updateContents(delta);
    };
    // @ts-ignore
    if (client) client.addEventListener("message", onMessage);
    // original example has a return () => socket.off("receive-changes", onMessage); here
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
