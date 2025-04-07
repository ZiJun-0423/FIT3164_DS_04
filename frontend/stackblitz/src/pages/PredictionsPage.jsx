import Navbar from '../components/Navbar';
import { useState } from 'react';

export default function PredictionsPage() {
  const [teamA, setTeamA] = useState('');
  const [teamB, setTeamB] = useState('');
  const [result, setResult] = useState(null);

  const predict = () => {
    if (teamA && teamB && teamA !== teamB) {
      const probA = Math.floor(Math.random() * 50) + 25;
      const probB = 100 - probA;
      setResult({ teamA, probA, teamB, probB });
    } else {
      setResult(null);
    }
  };

  return (
    <div style={{ background: '#121212', color: '#fff', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ padding: '2rem' }}>
        <h1>Match Predictions</h1>

        <div style={{ marginBottom: '1rem' }}>
          <select
            value={teamA}
            onChange={(e) => setTeamA(e.target.value)}
            style={selectStyle}
          >
            <option value="">Select Team A</option>
            <option value="Collingwood">Collingwood</option>
            <option value="Richmond">Richmond</option>
            <option value="Geelong">Geelong</option>
          </select>

          <select
            value={teamB}
            onChange={(e) => setTeamB(e.target.value)}
            style={selectStyle}
          >
            <option value="">Select Team B</option>
            <option value="Collingwood">Collingwood</option>
            <option value="Richmond">Richmond</option>
            <option value="Geelong">Geelong</option>
          </select>

          <button onClick={predict} style={buttonStyle}>
            Predict Match
          </button>
        </div>

        {result && (
          <div>
            <p>
              <strong>{result.teamA}</strong>: {result.probA}% chance to win
            </p>
            <p>
              <strong>{result.teamB}</strong>: {result.probB}% chance to win
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

const selectStyle = {
  marginRight: '1rem',
  padding: '8px',
  background: '#1E1E1E',
  color: '#fff',
  border: '1px solid #333',
};

const buttonStyle = {
  padding: '8px 16px',
  background: '#00BFA6',
  color: '#fff',
  border: 'none',
  cursor: 'pointer',
};
