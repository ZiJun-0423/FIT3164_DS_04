import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EloSettings from '../components/EloSettings';
import MultiTeamEloChart from '../components/datavis/multiteamline';
import TeamSelectorModal from '../components/TeamSelectorModal';

export default function DataVisPage() {
  const [eloSettings, setEloSettings] = useState({
    k_value: 32,
    initial_elo: 1000,
    start_season: 2005,
    home_adv: 100,
  });

  const [teams, setTeams] = useState([]);
  const [team1, setTeam1] = useState(null);
  const [team2, setTeam2] = useState(null);
  const [modalFor, setModalFor] = useState(null);
  const [prediction, setPrediction] = useState(null);

  // Load teams from CSV
  useEffect(() => {
    fetch('/data/teams.csv')
      .then(res => res.text())
      .then(text => {
        const rows = text.trim().split('\n').slice(1);
        const parsed = rows.map(row => {
          const [id, name, logo] = row.split(',');
          return { id: +id, name, logo };
        });
        setTeams(parsed);
      });
  }, []);

  // Predict winner when both teams are selected
  useEffect(() => {
    if (team1 && team2) {
      const winner = Math.random() < 0.5 ? team1 : team2;
      setPrediction(winner);
    } else {
      setPrediction(null);
    }
  }, [team1, team2]);

  const handleReset = () => {
    setTeam1(null);
    setTeam2(null);
    setPrediction(null);
    setModalFor(null);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow p-6 space-y-10 w-full">
        <h1 className="text-3xl font-bold text-center mb-4">📊 Data Visualization Playground</h1>

        <section className="flex gap-6">
          {/* Chart */}
          <div className="flex-1 border p-4 rounded-xl shadow-md space-y-6">
            <div className="h-[650px] overflow-hidden">
              <h2 className="text-xl font-semibold mb-2">Combined Elo Chart</h2>
              <div className="h-full overflow-auto">
                <MultiTeamEloChart settings={eloSettings} />
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-2">⚙️ Elo Settings</h3>
              <EloSettings onSettingsChange={setEloSettings} eloSettings={eloSettings} />
            </div>
          </div>

          {/* Match Prediction */}
          <div className="w-[400px] border p-6 rounded-xl shadow-md flex flex-col items-center space-y-5">
            <h2 className="text-xl font-semibold">🔮 Match Prediction</h2>

            {/* Team 1 Button */}
            <button
              onClick={() => setModalFor('team1')}
              className="w-[90%] py-4 rounded-xl text-lg font-medium bg-blue-100 hover:bg-blue-200"
            >
              {team1 ? (
                <div className="flex items-center justify-center gap-3">
                  <img src={team1.logo} alt={team1.name} className="h-8 w-8 object-contain" />
                  <span>{team1.name}</span>
                </div>
              ) : 'Select Team 1'}
            </button>

            {/* Predicted Winner */}
            {team1 && team2 && prediction && (
              <div className="text-center">
                <div className="text-lg font-bold text-green-700 flex items-center justify-center gap-2">
                  🏆 Predicted Winner:
                  <img src={prediction.logo} alt={prediction.name} className="h-6 w-6 object-contain" />
                  <span>{prediction.name}</span>
                </div>
              </div>
            )}

            {/* Team 2 Button */}
            <button
              onClick={() => setModalFor('team2')}
              className="w-[90%] py-4 rounded-xl text-lg font-medium bg-pink-100 hover:bg-pink-200"
            >
              {team2 ? (
                <div className="flex items-center justify-center gap-3">
                  <img src={team2.logo} alt={team2.name} className="h-8 w-8 object-contain" />
                  <span>{team2.name}</span>
                </div>
              ) : 'Select Team 2'}
            </button>

            {/* Reset */}
            {(team1 || team2) && (
            <button
              onClick={handleReset}
              className="w-[90%] py-3 mt-4 bg-red-100 text-red-600 font-semibold rounded-xl hover:bg-red-200 transition"
            >
              🔁 Reset Selection
            </button>
          )}

          </div>
        </section>
      </main>

      <Footer />

      {/* Modal */}
      <TeamSelectorModal
        teams={teams}
        isOpen={modalFor !== null}
        onClose={() => setModalFor(null)}
        onSelect={(team) => {
          if (modalFor === 'team1') setTeam1(team);
          if (modalFor === 'team2') setTeam2(team);
          setModalFor(null);
        }}
        disabledTeam={modalFor === 'team1' ? team2 : team1}
      />
    </div>
  );
}
