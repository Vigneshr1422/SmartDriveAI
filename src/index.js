import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import './index.css';  // Or the correct path to your Tailwind CSS file


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);