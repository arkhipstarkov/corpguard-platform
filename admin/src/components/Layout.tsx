import { ReactNode } from "react";
import { Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import WarningIcon from "@mui/icons-material/Warning";
import StorageIcon from "@mui/icons-material/Storage";
import BarChartIcon from "@mui/icons-material/BarChart";
import { Link, useLocation } from "react-router-dom";

const drawerWidth = 240;

export default function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();

  const menu = [
    { text: "Users", icon: <PeopleIcon />, path: "/users" },
    { text: "Violations", icon: <WarningIcon />, path: "/violations" },
    { text: "Equipment", icon: <StorageIcon />, path: "/equipment" },
    { text: "Analytics", icon: <BarChartIcon />, path: "/analytics" },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            bgcolor: "#020617",
            borderRight: "1px solid #0f2a44",
          },
        }}
      >
        <Box p={2}>
          <Typography variant="h6" color="#00e5ff">
            SECURITY CORE
          </Typography>
        </Box>

        <List>
          {menu.map((item) => (
            <ListItemButton
              key={item.text}
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
            >
              <ListItemIcon sx={{ color: "#00e5ff" }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {children}
      </Box>
    </Box>
  );
}
