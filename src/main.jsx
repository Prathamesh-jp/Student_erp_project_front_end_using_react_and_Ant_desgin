import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ConfigProvider, theme } from "antd";
import { ThemeProvider } from "./context/ThemeContext";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <ConfigProvider
          theme={{
            algorithm: theme.darkAlgorithm,
            token: {
              colorPrimary: "#667eea",
              borderRadius: 10,
              colorBgContainer: "rgba(255,255,255,0.07)",
              colorBgElevated: "rgba(20,20,60,0.95)",
              colorBorder: "rgba(255,255,255,0.15)",
              colorText: "#ffffff",
              colorTextSecondary: "rgba(255,255,255,0.5)",
            },
          }}
        >
          <App />
        </ConfigProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);