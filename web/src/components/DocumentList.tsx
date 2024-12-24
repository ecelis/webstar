import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import axiosInstance from "../lib/api";

const columns = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "title",
    headerName: "Title",
    width: 150,
    editable: false,
  },
  {
    field: "content",
    headerName: "Content",
    width: 150,
    editable: false,
  },
  {
    field: "owner",
    headerName: "Owner",
    width: 110,
    editable: false,
  },
  {
    field: "collaborator",
    headerName: "Collaborators",
    sortable: false,
    width: 160,
    // @ts-ignore
    //   valueGetter: (value, row) =>
    //     `${row.firstName || ""} ${row.lastName || ""}`,
  },
];

export default function DocumentList() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("/document")
      .then((res) => {
        setRows(res.data.results);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        // @ts-ignore
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[10]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
}
