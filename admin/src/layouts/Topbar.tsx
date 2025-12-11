import { AppBar, Toolbar, Typography } from "@mui/material";

export default function Topbar() {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: "#fff",
        color: "#000",
        mb: 3,
        borderBottom: "1px solid #e0e0e0",
      }}
    >
      <Toolbar>
        <Typography variant="h6">Security Admin Panel</Typography>
      </Toolbar>
    </AppBar>
  );
}
