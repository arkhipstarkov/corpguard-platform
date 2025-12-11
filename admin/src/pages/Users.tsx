import { useEffect, useMemo, useState } from "react";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import api from "../api/axios";
import { mockUsers } from "../mock/users";

export default function Users() {
  const [rows, setRows] = useState<any[]>([]);
  const [email, setEmail] = useState("");
  const [usingMock, setUsingMock] = useState(false);

  // Load with fallback
  const loadUsers = async () => {
    try {
      const res = await api.get("/users");
      setRows(res.data);
      setUsingMock(false);
    } catch (err) {
      // fallback to mock
      setRows(mockUsers);
      setUsingMock(true);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const columns: GridColDef[] = useMemo(
    () => [
      { field: "id", headerName: "ID", width: 80 },
      { field: "email", headerName: "Email", flex: 1 },
    ],
    []
  );

  // Create: try API, otherwise add locally (mock) — works offline
  const createUser = async () => {
    if (!email) return;

    const localEntry = { id: rows.length + 1, email };

    try {
      await api.post("/users", { email });
      // reload from server for canonical state
      await loadUsers();
    } catch (err) {
      // fallback - add locally
      setRows((prev) => [...prev, localEntry]);
      setUsingMock(true);
    } finally {
      setEmail("");
    }
  };

  return (
    <Box>
      <Typography variant="h4" mb={2}>
        Users {usingMock ? "(demo mode)" : ""}
      </Typography>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Box display="flex" gap={2}>
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            size="small"
          />
          <Button variant="contained" onClick={createUser}>
            Add
          </Button>
          <Button onClick={loadUsers} variant="outlined">
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


