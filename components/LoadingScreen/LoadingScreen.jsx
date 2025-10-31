"use client";

import React from "react";
import "./LoadingScreen.css";

const LoadingScreen = ({
  theme = {
    background: "#0f172a",
    primary: "#3b82f6",
    secondary: "#8b5cf6",
    accent: "#ec4899",
    textMuted: "#94a3b8",
    border: "#475569",
  },
}) => {
  return (
    <div className="loading-screen" style={{ background: theme.background }}>
      <div className="loading-content">
        <div
          className="loading-spinner"
          style={{ borderTopColor: theme.primary }}
        >
          <div
            className="spinner-inner"
            style={{ borderColor: theme.border }}
          ></div>
        </div>

        <div className="loading-text">
          <h2 style={{ color: theme.primary }}>KIITHub</h2>
          <p style={{ color: theme.textMuted }}>Loading your academic hub...</p>
        </div>

        <div className="loading-dots">
          <span style={{ backgroundColor: theme.primary }}></span>
          <span style={{ backgroundColor: theme.secondary }}></span>
          <span style={{ backgroundColor: theme.accent }}></span>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
