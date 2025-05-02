// src/components/InputArea.jsx
import React from "react";
import { Box, TextField, Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

const InputArea = ({ message, setMessage, sendMessage, handleKeyPress }) => {
  return (
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
  );
};

export default InputArea;