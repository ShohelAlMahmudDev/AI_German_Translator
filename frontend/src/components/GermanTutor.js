// GermanTutor.jsx
import React, { useState, useEffect, useRef, Component } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  TextField,
  Typography,
  Button,
  Select,
  MenuItem,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SendIcon from "@mui/icons-material/Send";
import Markdown from "markdown-to-jsx"; 
import "./GermanTutor.css";

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught in ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <Typography color="error">Something went wrong. Please refresh the page.</Typography>;
    }
    return this.props.children;
  }
}

const drawerWidth = 280;

const GermanTutor = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [history, setHistory] = useState(() => {
    const savedHistory = localStorage.getItem("chatHistory");
    return savedHistory ? JSON.parse(savedHistory) : [];
  });
  const [message, setMessage] = useState("");
  const [selectedLanguages, setSelectedLanguages] = useState(["en"]);
  const [username, setUsername] = useState("User");
  const [email, setEmail] = useState("user@example.com");

  const chatContainerRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [history]);

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

  const sendMessage = async () => {
    if (!message.trim() || !username.trim()) return;
    const newHistory = [...history, { user: `${username}: ${message}`, bot: "Processing..." }];
    setHistory(newHistory);
    setMessage("");

    try {
      const isWord = message.split(" ").length === 1;
      const endpoint = isWord ? "/correct-word" : "/correct-sentence";
      const body = {
        email: email,
        [isWord ? "word" : "sentence"]: message,
        languages: selectedLanguages,
      };

      const response = await fetch(`https://german-translator-backend.onrender.com${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch response from backend");
      } 
      const data = await response.json(); 
      setHistory((prev) => {
        const updatedHistory = [...prev];
        updatedHistory[updatedHistory.length - 1].bot = data;
        return updatedHistory;
      });
    } catch (error) {
      setHistory((prev) => {
        const updatedHistory = [...prev];
        updatedHistory[updatedHistory.length - 1].bot = `Error: ${error.message}`;
        return updatedHistory;
      });
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("chatHistory");
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <ErrorBoundary>
      <Box className="app-container">
        <Drawer
          variant="persistent"
          anchor="left"
          open={drawerOpen}
          classes={{ paper: "drawer-paper" }}
          className="drawer"
        >
          <List className="drawer-list">
            <ListItem>
              <Typography variant="h6" className="drawer-title">
                User Settings
              </Typography>
            </ListItem>
            <ListItem>
              <TextField
                label="Username"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                variant="outlined"
                size="small"
              />
            </ListItem>
            <ListItem>
              <TextField
                label="Email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="outlined"
                size="small"
              />
            </ListItem>
            <ListItem>
              <Select
                multiple
                value={selectedLanguages}
                onChange={(e) => setSelectedLanguages(e.target.value)}
                fullWidth
                size="small"
                variant="outlined"
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="bn">Bangla</MenuItem>
                <MenuItem value="es">Spanish</MenuItem>
              </Select>
            </ListItem>
            <ListItem>
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
        </Drawer>

        <Box
          className="main-content"
          style={{
            marginLeft: drawerOpen ? `${drawerWidth}px` : 0,
            width: drawerOpen ? `calc(100% - ${drawerWidth}px)` : "100%",
          }}
        >
          <AppBar position="static" className="app-bar">
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={toggleDrawer}
                className="icon-button"
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" className="app-bar-title">
                German Tutor
              </Typography>
            </Toolbar>
          </AppBar>

          <Box ref={chatContainerRef} className="chat-area">
            {history.map((entry, index) => (
              <Box key={index} className="message-container">
                <Box className="user-message">
                  <Typography variant="body1">{entry.user}</Typography>
                </Box>
                <Box className="bot-message">
                  <Markdown>{entry.bot}</Markdown>
                </Box>
              </Box>
            ))}
          </Box>

          <Box className="input-area">
            <TextField
              fullWidth
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter your message..."
              variant="outlined"
              size="small"
              className="text-field"
              multiline
              maxRows={4}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={sendMessage}
              endIcon={<SendIcon />}
              className="send-button"
            >
              Send
            </Button>
          </Box>
        </Box>
      </Box>
    </ErrorBoundary>
  );
};

export default GermanTutor;