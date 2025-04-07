import { useState } from "react";

const teams = ["Collingwood", "Richmond", "Geelong", "Hawthorn"];

export default function PredictionCard() {
  const [teamA, setTeamA] = useState(teams[0]);
  const [teamB, setTeamB] = useState(teams[1]);
  const [result, setResult] = useState(null);

  const handlePredict = () => {
    if (teamA === teamB) {
      setResult("Please select two different teams.");
      return;
    }

    // Dummy ELO scores
    const elo = {
      Collingwood: 1650,
      Richmond: 1620,
      Geelong: 1585,
      Hawthorn: 1500,
    };

    const total = elo[teamA] + elo[teamB];
    const teamAChance = ((elo[teamA] / total) * 100).toFixed(1);
    const teamBChance = (100 - teamAChance).toFixed(1);

    setResult({
      [teamA]: teamAChance,
      [teamB]: teamBChance,
    });
  };

  return (
    <div>
      <h3>Prediction Match</h3>
      <div style={{ marginBottom: "1rem" }}>
        <select value={teamA} onChange={(e) => setTeamA(e.target.value)}>
          {teams.map((team) => (
            <option key={team}>{team}</option>
          ))}
        </select>
        <span style={{ margin: "0 0.5rem" }}>vs</span>
        <select value={teamB} onChange={(e) => setTeamB(e.target.value)}>
          {teams.map((team) => (
            <option key={team}>{team}</option>
          ))}
        </select>
      </div>
      <button onClick={handlePredict} className="predict-btn">
        Predict
      </button>

      {typeof result === "string" && (
        <p style={{ marginTop: "1rem", color: "#ff5e5e" }}>{result}</p>
      )}

      {result && typeof result === "object" && (
        <div style={{ marginTop: "1rem", textAlign: "left" }}>
          <p>
            <strong>{teamA}</strong>: {result[teamA]}% chance to win
          </p>
          <p>
            <strong>{teamB}</strong>: {result[teamB]}% chance to win
          </p>
        </div>
      )}
    </div>
  );
}
