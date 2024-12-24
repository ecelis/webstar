import Button from "@mui/material/Button";
import axiosInstance from "../lib/api";
import { useNavigate } from "react-router-dom";

const NewDocument = () => {
  const navigate = useNavigate();
  const handleClick = async () => {
    try {
      const response = await axiosInstance.post("document/", {
        content: "",
        title: "Untitled",
      });
      console.log(response.data);
      if (response.data.id) {
        navigate(`/document/${response.data.id}`, { replace: true });
      }
    } catch (error) {
      console.error("Failed to create document:", error);
    }
  };

  return (
    <Button variant="contained" onClick={handleClick}>
      New Document
    </Button>
  );
};

export default NewDocument;
