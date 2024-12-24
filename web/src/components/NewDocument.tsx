import Button from "@mui/material/Button";
import axiosInstance from "../lib/api";

const NewDocument = () => {
  const handleClick = async () => {
    try {
      const response = await axiosInstance.post("document/", {
        content: "",
        title: "Untitled",
      });

      if (response.data._id) {
        window.location.href = `/editor/${response.data._id}`;
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
