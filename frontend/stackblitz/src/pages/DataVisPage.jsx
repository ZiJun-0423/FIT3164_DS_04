import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EloSettings from '../components/EloSettings'; // Import the EloSettings component
import SoloTeamEloChart from '../components/datavis/soloteamline'; // Import the SoloTeamEloChart component
import MultiTeamEloChart from '../components/datavis/multiteamline'; // Import the MultiTeamEloChart component

export default function DataVisPage() {
  const [eloSettings, setEloSettings] = useState({
    k_value: 32,
    initial_elo: 1000,
    start_season: 2005,
    home_adv: 100,
  });

  // Handler to update Elo settings
  const handleSettingsChange = (newSettings) => {
    setEloSettings(newSettings); // Update the Elo settings with the new values
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow p-6 space-y-10 w-full">
        {/* Title */}
        <h1 className="text-3xl font-bold text-center mb-4">📊 Data Visualization Playground</h1>

        {/* Elo Chart and Prediction Side-by-Side */}
        <section className="flex gap-6">
          {/* Left: Chart with EloSettings underneath */}
          <div className="flex-1 border p-4 rounded-xl shadow-md w-full space-y-6">
            <div className="h-[650px] overflow-hidden">
              <h2 className="text-xl font-semibold mb-2">Combined Elo Chart</h2>
              <div className="h-full overflow-auto">
                <MultiTeamEloChart settings={eloSettings} />
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-2">⚙️ Elo Settings</h3>
              <EloSettings onSettingsChange={handleSettingsChange} eloSettings={eloSettings} />
            </div>
          </div>


          {/* Right: Prediction Panel */}
          <div className="w-[400px] border p-4 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-2">🔮 Match Prediction</h2>
            <p>Prediction functionality goes here!</p>
            {/* Add inputs later */}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
