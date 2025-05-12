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

  const handleSettingsChange = (newSettings) => {
    setEloSettings(newSettings); // Update the Elo settings with the new values
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow p-6 space-y-10 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-4">📊 Data Visualization Playground</h1>

        {/* Elo Settings Section */}
        <section className="border p-4 rounded-xl shadow-md bg-white">
          <EloSettings onSettingsChange={handleSettingsChange} /> {/* Pass the settings change handler */}
        </section>
        
        {/* //Solo line test
        <section className="border p-4 rounded-xl shadow-md bg-white">
            <h2 className="text-xl font-semibold mb-2">Solo Elo Chart</h2>
            <SoloTeamEloChart team_id={17} settings={eloSettings} /> 
        </section> */}
       

        {/* multi line test */}
        <section className="border p-4 rounded-xl shadow-md bg-white">
          <h2 className="text-xl font-semibold mb-2">Combined Elo Chart</h2>
          <MultiTeamEloChart settings={eloSettings} /> {/* Pass the Elo settings to the chart */}
        </section>
      </main>

      <Footer />
    </div>
  );
}
