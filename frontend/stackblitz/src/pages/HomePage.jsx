import Navbar from "../components/Navbar";
import EloChart from "../components/EloChart";
import PredictionCard from "../components/PredictionCard";
import "./HomePage.css";
import { Link } from "react-router-dom";

export default function HomePage() {
  const teams = [
    { rank: 1, name: "Collingwood", elo: 1650, streak: "5 Wins" },
    { rank: 2, name: "Richmond", elo: 1620, streak: "3 Wins" },
    { rank: 3, name: "Geelong", elo: 1585, streak: "2 Wins" },
  ];

  return (
    <div className="home-container">
      <Navbar />

      <div className="hero-section">
        <h1 className="hero-title">Track AFL Team Rankings in Real Time!</h1>
        <p className="hero-subtitle">
          Get live ELO ratings, match predictions, and team insights!
        </p>
      </div>

      <div className="card-container">
        <div className="card-box">
          <h2>
            Upcoming Match 
          </h2>
          <h3 className="match-title">
            <span className="team">
              <img src="/teamlogo/richmond.png" alt="Richmond Logo" className="mini-logo" />
              Richmond
            </span>
            <span className="vs-text">VS</span>
            <span className="team">
              <img src="/teamlogo/collingwood.png" alt="Collingwood Logo" className="mini-logo" />
              Collingwood
            </span>
          </h3>
          <h3>Thursday, 3 Apr</h3>
          <h3>7:30 pm</h3>
        </div>
      <table className="table-container">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Club</th>
            <th>ELO Score</th>
            <th>Win Streak</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team) => (
            <tr key={team.rank}>
              <td>{team.rank}</td>
              <td>{team.name}</td>
              <td>{team.elo}</td>
              <td>{team.streak}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      
    </div>
  );
}