// src/components/ErrorBoundary.jsx
import React, { Component } from "react";
import { Typography } from "@mui/material";

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

export default ErrorBoundary;