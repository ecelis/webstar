import { Delta } from "quill";
import axiosInstance from "./api";

const updateDocument = async (
  documentId: string | undefined,
  content: string | Delta | undefined
) => {
  if (!documentId || !content) return;

  try {
    await axiosInstance.patch(`document/${documentId}/`, {
      content: JSON.stringify(content),
    });
  } catch (error) {
    console.error("Error updating document:", error);
  }
};

export { updateDocument };
