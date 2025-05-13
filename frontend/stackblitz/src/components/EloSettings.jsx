import React, { useState } from 'react';

export default function EloSettings({ eloSettings, onSettingsChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSliderChange = (e) => {
    const { name, value } = e.target;
    const val = Number(value);
    let newSettings = { ...eloSettings, [name]: val };

    // Constraint: end_season must be at least 1 greater than start_season
    if (name === 'start_season') {
      if (newSettings.end_season <= val) {
        newSettings.end_season = val + 1;
      }
    } else if (name === 'end_season') {
      if (val <= newSettings.start_season) {
        newSettings.start_season = val - 1;
      }
    }

    onSettingsChange(newSettings);
  };

  return (
    <div>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        {isOpen ? 'Hide Elo Settings' : 'Show Elo Settings'}
      </button>

      {/* Expandable Settings Panel */}
      <div
        className={`overflow-hidden transition-all duration-500 ${
          isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="space-y-6 border p-4 rounded-xl shadow-inner bg-gray-50">
          {/* K-Value Slider */}
          <div>
            <label className="block font-medium mb-1">
              K-Value: {eloSettings.k_value}
            </label>
            <input
              type="range"
              name="k_value"
              min="1"
              max="100"
              value={eloSettings.k_value}
              onChange={handleSliderChange}
              className="w-full"
            />
          </div>

          {/* Initial Elo Slider */}
          <div>
            <label className="block font-medium mb-1">
              Initial Elo: {eloSettings.initial_elo}
            </label>
            <input
              type="range"
              name="initial_elo"
              min="500"
              max="2000"
              step="10"
              value={eloSettings.initial_elo}
              onChange={handleSliderChange}
              className="w-full"
            />
          </div>

          {/* Start Season Slider */}
          <div>
            <label className="block font-medium mb-1">
              Start Season: {eloSettings.start_season}
            </label>
            <input
              type="range"
              name="start_season"
              min="1897"
              max="2023"
              value={eloSettings.start_season}
              onChange={handleSliderChange}
              className="w-full"
            />
          </div>

          {/* End Season Slider */}
          <div className="slider-group">
            <label>
              End Season: {eloSettings.end_season}
            </label>
            <input
              type="range"
              name="end_season"
              min="1898"
              max="2025"
              value={eloSettings.end_season}
              onChange={handleSliderChange}
              className="w-full"
            />
          </div>

          {/* Home Advantage Slider */}
          <div>
            <label className="block font-medium mb-1">
              Home Advantage: {eloSettings.home_adv}
            </label>
            <input
              type="range"
              name="home_adv"
              min="0"
              max="300"
              step="10"
              value={eloSettings.home_adv}
              onChange={handleSliderChange}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
