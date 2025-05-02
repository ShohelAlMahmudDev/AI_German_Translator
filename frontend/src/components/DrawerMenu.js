// src/components/DrawerMenu.jsx
import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
  Typography,
  Button,
  Collapse,
  Box,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

const drawerWidth = 0;

const DrawerMenu = ({
  drawerOpen,
  toggleDrawer,
  username,
  setUsername,
  email,
  setEmail,
  clearHistory,
}) => {
  // State to manage which menu sections are open
  const [historyOpen, setHistoryOpen] = useState(false);
  const [userConfigOpen, setUserConfigOpen] = useState(false);
  const [languageLearningOpen, setLanguageLearningOpen] = useState(false);

  // Handler for clicking a proficiency level (e.g., A1, B1.1)
  const handleLevelClick = (level) => {
    console.log(`Selected proficiency level: ${level}`);
    // Add your logic here (e.g., filter content, navigate, etc.)
  };

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={drawerOpen}
      classes={{ paper: "drawer-paper" }}
      className="drawer"
      sx={{ width: drawerWidth }}
    >
      <List className="drawer-list">
        {/* Drawer Title */}
        <ListItem>
          <Typography variant="h6" className="drawer-title">
            Menu
          </Typography>
        </ListItem>

        {/* History Section */}
        <ListItemButton onClick={() => setHistoryOpen(!historyOpen)}>
          <ListItemText primary="History" />
          {historyOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={historyOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem sx={{ pl: 4 }}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={clearHistory}
                fullWidth
              >
                Clear History
              </Button>
            </ListItem>
          </List>
        </Collapse>

        {/* User Config Section */}
        <ListItemButton onClick={() => setUserConfigOpen(!userConfigOpen)}>
          <ListItemText primary="User Config" />
          {userConfigOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={userConfigOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem sx={{ pl: 4 }}>
              <TextField
                label="Username"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                variant="outlined"
                size="small"
              />
            </ListItem>
            <ListItem sx={{ pl: 4 }}>
              <TextField
                label="Email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="outlined"
                size="small"
              />
            </ListItem>
          </List>
        </Collapse>

        {/* Language Learning Section */}
        <ListItemButton onClick={() => setLanguageLearningOpen(!languageLearningOpen)}>
          <ListItemText primary="Language Learning" />
          {languageLearningOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={languageLearningOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {["A1", "A2", "B1.1", "B1.2", "B2.1", "B2.2", "C1.1", "C1.2"].map((level) => (
              <ListItemButton
                key={level}
                sx={{ pl: 4 }}
                onClick={() => handleLevelClick(level)}
              >
                <ListItemText primary={level} />
              </ListItemButton>
            ))}
          </List>
        </Collapse>
      </List>
    </Drawer>
  );
};

export default DrawerMenu;