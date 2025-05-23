import {QueryClientProvider, QueryClient} from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import StatsPage from "./pages/StatsPage";
import PredictionsPage from "./pages/PredictionsPage";
import HistoryPage from "./pages/HistoryPage";
import TeamPage from "./pages/Teampage";
import DataVisPage from "./pages/DataVisPage";
import "./style.css"

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/predictions" element={<PredictionsPage />} />
          <Route path="/team/:id" element={<TeamPage />} />
          <Route
            path="/history"
            element={
              <HistoryPage
                teamsWithLogos={[]} // <-- must be an array
                enrichedMatches={[]}
                recentMatchCount={5}
                setRecentMatchCount={() => {}}
                selectedTeamId=""
                setSelectedTeamId={() => {}}
              />
            }
          />
          <Route path="/datavis" element={<DataVisPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
