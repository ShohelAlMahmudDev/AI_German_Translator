// src/components/ChatArea.jsx
import React, { useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";
import Markdown from "markdown-to-jsx";

const ChatArea = ({ history }) => {
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [history]);

  return (
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
  );
};

export default ChatArea;