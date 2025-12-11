import { useEffect, useMemo, useState } from "react";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import api from "../api/axios";
import { mockViolations } from "../mock/violations";

export default function Violations() {
  const [rows, setRows] = useState<any[]>([]);
  const [description, setDescription] = useState("");
  const [usingMock, setUsingMock] = useState(false);

  const load = async () => {
    try {
      const res = await api.get("/violations");
      setRows(res.data);
      setUsingMock(false);
    } catch (err) {
      setRows(mockViolations);
      setUsingMock(true);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const columns: GridColDef[] = useMemo(
    () => [
      { field: "id", headerName: "ID", width: 80 },
      { field: "description", headerName: "Description", flex: 1 },
    ],
    []
  );

  const createViolation = async () => {
    if (!description) return;

    const localEntry = { id: rows.length + 1, description };

    try {
      await api.post("/violations", { description });
      await load();
    } catch (err) {
      // fallback
      setRows((prev) => [...prev, localEntry]);
      setUsingMock(true);
    } finally {
      setDescription("");
    }
  };

  return (
    <Box>
      <Typography variant="h4" mb={2}>
        Violations {usingMock ? "(demo mode)" : ""}
      </Typography>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Box display="flex" gap={2}>
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            size="small"
          />
          <Button variant="contained" onClick={createViolation}>
            Add
          </Button>
          <Button onClick={load} variant="outlined">
            Refresh
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ height: 400, p: 1 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSizeOptions={[5, 10, 25]}
          initialState={{
            pagination: { paginationModel: { pageSize: 5, page: 0 } },
          }}
          disableRowSelectionOnClick
        />
      </Paper>
    </Box>
  );
}





