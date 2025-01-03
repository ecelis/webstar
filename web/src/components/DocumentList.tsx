import Box from "@mui/material/Box";
import { DataGrid, GridRenderCellParams } from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import axiosInstance from "../lib/api";

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

  const columns = [
    {
      field: "title",
      headerName: "Title",
      width: 150,
      editable: false,
      renderCell: (params: GridRenderCellParams<any, Date>) => {
        return (
          <a id={`${params.id}`} href={`document/${params.id}`}>
            {params.row.title}
          </a>
        );
      },
    },
    {
      field: "collaborator",
      headerName: "Collaborators",
      sortable: false,
      width: 300,
    },
  ];

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
