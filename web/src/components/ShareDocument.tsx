// @ts-nocheck
import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axiosInstance from "../lib/api";
import { getData } from "../lib/auth";

interface ShareDocumentParams {
  documentId: string | undefined;
}

const ShareDocument = ({ documentId }: ShareDocumentParams) => {
  const [rows, setRows] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [username, setUsername] = useState(getData("username"));

  useEffect(() => {
    axiosInstance
      .get("user/")
      .then((res) => {
        const users = res.data.results.filter(
          (user) => user.username !== username
        );
        if (documentId && users.length > 0) {
          axiosInstance
            .get(`document/${documentId}/`)
            .then((res) => {
              // TODO refactor nested code this is an ugly hack
              const selectedRows = users.filter((row) => {
                return res.data.collaborator.includes(row.url);
              });
              setRows(users);
              setSelectedUsers(selectedRows.map((row) => row.url)); // TODO fix existing collaborators
            })
            .catch((error) => console.error(error));
        }
      })
      .catch((error) => console.error(error));
  }, []);

  const handleSelectionChange = (newSelection) => {
    setSelectedUsers(newSelection);
    const selectedUserIds = newSelection.map((url) => {
      return url;
    });

    axiosInstance
      .patch(`document/${documentId}/`, {
        collaborator: selectedUserIds,
      })
      .then((res) => {
        //  TODO turn into message in the UI
        console.log("Collaborators updated");
      })
      .catch((error) => console.error(error));
  };

  const columns = [
    {
      field: "username",
      headerName: "User",
      width: 100,
      editable: false,
    },
  ];

  return documentId ? (
    <Box sx={{ width: 250 }} role="presentation">
      <DataGrid
        getRowId={(row) => row.url}
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        sx={{ border: 0 }}
        onRowSelectionModelChange={handleSelectionChange}
        selectionModel={selectedUsers}
      />
    </Box>
  ) : (
    <h1>Select a document first</h1>
  );
};

export default ShareDocument;
