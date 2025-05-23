import { useState, useEffect } from 'react';
import './PredictionsPage.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PredictionsPage() {
  const [teams, setTeams] = useState([]);
  const [teamA, setTeamA] = useState(null);
  const [teamB, setTeamB] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTeamSlot, setSelectedTeamSlot] = useState('');
  const [predictionResult, setPredictionResult] = useState('');

  // Load teams from CSV
  useEffect(() => {
    fetch('/data/teams.csv')
      .then(res => res.text())
      .then(text => {
        const rows = text.trim().split('\n').slice(1);
        const parsed = rows.map(row => {
          const [id, name, logo] = row.split(',').map(s => s.trim());
          return { id: +id, name, logo };
        });
        setTeams(parsed);
      })
      .catch(error => console.error("Failed to load teams.csv:", error));
  }, []);

  const openModal = (teamSlot) => {
    setSelectedTeamSlot(teamSlot);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleTeamSelect = (team) => {
    if (selectedTeamSlot === 'teamA') {
      setTeamA(team);
    } else if (selectedTeamSlot === 'teamB') {
      setTeamB(team);
    }
    closeModal();
  };

  const predict = () => {
    if (teamA && teamB && teamA !== teamB) {
      const probA = Math.floor(Math.random() * 50) + 25;
      const probB = 100 - probA;

      let scoreA, scoreB;

      if (probA > probB) {
        scoreA = Math.floor(Math.random() * 121) + 40;
        scoreB = Math.floor(Math.random() * (scoreA - 40)) + 40;
      } else {
        scoreB = Math.floor(Math.random() * 121) + 40;
        scoreA = Math.floor(Math.random() * (scoreB - 40)) + 40;
      }

      const resultText = `Final score: ${teamA.name} ${scoreA} - ${teamB.name} ${scoreB}`;
      setPredictionResult(resultText);
    }
  };

  return (
    <div className="predictions-page">
      <Navbar />
      <div className="content">
        <h1>Match Predictions</h1>

        <div className="button-container">
          <button className="select-team-button" onClick={() => openModal('teamA')}>
            {teamA ? (
              <div className="team-button-content">
                <img src={teamA.logo} alt={teamA.name} className="team-logo-large" />
                <div className="team-button-name">{teamA.name}</div>
              </div>
            ) : 'Select Team A'}
          </button>

          <button className="select-team-button" onClick={() => openModal('teamB')}>
            {teamB ? (
              <div className="team-button-content">
                <img src={teamB.logo} alt={teamB.name} className="team-logo-large" />
                <div className="team-button-name">{teamB.name}</div>
              </div>
            ) : 'Select Team B'}
          </button>
        </div>

        <button className="predict-button" onClick={predict}>
          Predict Match Outcome
        </button>

        {predictionResult && (
          <div className="prediction-result">
            {predictionResult.split('\n').map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        )}

        {isModalOpen && (
          <div className="bottom-drawer">
            <h2 className="text-xl font-bold mb-3">Select a Team</h2>
            <div className="team-selector-list">
              {teams
                .filter(team =>
                  selectedTeamSlot === 'teamA' ? team.id !== teamB?.id : team.id !== teamA?.id
                )
                .map(team => (
                  <button
                    key={team.id}
                    onClick={() => handleTeamSelect(team)}
                    className="team-card"
                  >
                    <img src={team.logo} alt={team.name} className="team-card-logo" />
                    <span className="team-card-name">{team.name}</span>
                  </button>
                ))}
            </div>
            <button className="close-button" onClick={closeModal}>Close</button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
