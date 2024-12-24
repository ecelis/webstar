import Box from "@mui/material/Box";
import { DataGrid, GridRenderCellParams } from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import axiosInstance from "../lib/api";

export default function DocumentList() {
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
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
      field: "content",
      headerName: "Content",
      width: 300,
      editable: false,
      // @ts-ignore
      valueGetter: (value, row) => row.content,
    },
    {
      field: "collaborator",
      headerName: "Collaborators",
      sortable: false,
      width: 300,
      // @ts-ignore
      //   valueGetter: (value, row) =>
      //     `${row.firstName || ""} ${row.lastName || ""}`,
    },
  ];
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
