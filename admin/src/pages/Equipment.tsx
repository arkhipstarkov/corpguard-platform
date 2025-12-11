import { useEffect, useMemo, useState } from "react";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import api from "../api/axios";
import { mockEquipment } from "../mock/equipment";

type EquipmentType = {
  id: number;
  name: string;
};

export default function Equipment() {
  const [rows, setRows] = useState<EquipmentType[]>([]);
  const [name, setName] = useState("");
  const [usingMock, setUsingMock] = useState(false);

  const load = async () => {
    try {
      const res = await api.get("/equipment");
      setRows(res.data);
      setUsingMock(false);
    } catch (err) {
      setRows(mockEquipment);
      setUsingMock(true);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const columns: GridColDef<EquipmentType>[] = useMemo(
    () => [
      { field: "id", headerName: "ID", width: 80 },
      { field: "name", headerName: "Name", flex: 1 },
    ],
    []
  );

  const createEquipment = async () => {
    if (!name) return;

    const localItem: EquipmentType = { id: rows.length + 1, name };

    try {
      await api.post("/equipment", { name });
      await load();
    } catch (err) {
      setRows((prev) => [...prev, localItem]);
      setUsingMock(true);
    } finally {
      setName("");
    }
  };

  return (
    <Box>
      <Typography variant="h4" mb={2}>
        Equipment {usingMock ? "(demo mode)" : ""}
      </Typography>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Box display="flex" gap={2}>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            size="small"
          />
          <Button variant="contained" onClick={createEquipment}>
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

