import React, { useState } from 'react';

function EloSettings({ onSettingsChange }) {
  const [k_value, setk_value] = useState(32);
  const [initial_elo, setinitial_elo] = useState(1000);
  const [start_season, setstart_season] = useState(2023);
  const [home_adv, sethome_adv] = useState(50);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Convert values to numbers before passing them to the parent component
    onSettingsChange({
      k_value,
      initial_elo: parseInt(initial_elo, 10),  // Ensure it's an integer
      start_season: parseInt(start_season, 10), // Ensure it's an integer
      home_adv: parseInt(home_adv, 10), // Ensure it's an integer
    });
  };

  return (
    <div className="settings-container border p-6 rounded-xl shadow-xl bg-gradient-to-r from-teal-200 to-teal-100">
      <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">Elo Settings</h2>

      <button 
        onClick={() => setIsExpanded(!isExpanded)} 
        className="w-full text-left text-teal-700 bg-teal-100 hover:bg-teal-200 rounded-xl py-2 px-4 font-medium focus:outline-none transition duration-300">
        {isExpanded ? 'Hide Settings' : 'Show Settings'}
      </button>

      {isExpanded && (
        <form onSubmit={handleSubmit} className="mt-4 space-y-6">
          <div className="form-group space-y-2">
            <label htmlFor="k_value" className="block text-lg font-medium text-gray-700">K Value</label>
            <input
              type="number"
              id="k_value"
              value={k_value}
              onChange={(e) => setk_value(parseInt(e.target.value, 10))} // Ensure it's an integer
              className="input-field rounded-lg py-2 px-4 w-full border border-teal-300 shadow-sm focus:ring-teal-500 focus:border-teal-500 transition duration-300"
              min="1"
              max="100"
            />
          </div>

          <div className="form-group space-y-2">
            <label htmlFor="initial_elo" className="block text-lg font-medium text-gray-700">Initial Elo</label>
            <input
              type="number"
              id="initial_elo"
              value={initial_elo}
              onChange={(e) => setinitial_elo(e.target.value)} // No need for parseInt here as the value is updated in handleSubmit
              className="input-field rounded-lg py-2 px-4 w-full border border-teal-300 shadow-sm focus:ring-teal-500 focus:border-teal-500 transition duration-300"
              min="100"
              max="3000"
            />
          </div>

          <div className="form-group space-y-2">
            <label htmlFor="start_season" className="block text-lg font-medium text-gray-700">Start Season</label>
            <input
              type="number"
              id="start_season"
              value={start_season}
              onChange={(e) => setstart_season(parseInt(e.target.value, 10))} // Ensure it's an integer
              className="input-field rounded-lg py-2 px-4 w-full border border-teal-300 shadow-sm focus:ring-teal-500 focus:border-teal-500 transition duration-300"
              min="1897"
              max="2023"
            />
          </div>

          <div className="form-group space-y-2">
            <label htmlFor="home_adv" className="block text-lg font-medium text-gray-700">Home Advantage</label>
            <input
              type="number"
              id="home_adv"
              value={home_adv}
              onChange={(e) => sethome_adv(parseInt(e.target.value, 10))} // Ensure it's an integer
              className="input-field rounded-lg py-2 px-4 w-full border border-teal-300 shadow-sm focus:ring-teal-500 focus:border-teal-500 transition duration-300"
              min="0"
              max="1000"
            />
          </div>

          <button type="submit" className="btn w-full bg-teal-600 text-white hover:bg-teal-700 rounded-lg py-2 font-semibold focus:outline-none transition duration-300">
            Save Settings
          </button>
        </form>
      )}
    </div>
  );
}

export default EloSettings;
