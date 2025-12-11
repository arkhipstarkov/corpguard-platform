import { Box, CssBaseline } from "@mui/material";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, minHeight: "100vh", backgroundColor: "#f4f6f8" }}>
        <Topbar />
        {children}
      </Box>
    </Box>
  );
}
