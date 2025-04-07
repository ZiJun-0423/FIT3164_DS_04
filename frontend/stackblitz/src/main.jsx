import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import StatsPage from "./pages/StatsPage";
import PredictionsPage from "./pages/PredictionsPage";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="/predictions" element={<PredictionsPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
