import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";
import { SnackbarProvider } from "notistack";


ReactDOM.createRoot(document.getElementById("root")).render(
  <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
    <AuthProvider>
      <App />
    </AuthProvider>
  </SnackbarProvider>
);