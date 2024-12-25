interface LoginParams {
  setAuth: React.Dispatch<React.SetStateAction<string | null>>;
}

interface ShareDocumentParams {
  documentId: string | undefined;
}

interface SocketMessage {
  type: "document" | "text" | "delta" | "info" | "message" | "save";
  payload?: string | null | any;
  timestamp?: number;
}

export type { LoginParams, ShareDocumentParams, SocketMessage };
