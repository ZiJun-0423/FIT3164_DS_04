import Navbar from '../components/Navbar';
import './HomePage.css';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  // Match information
  const match = {
    teams: [
      { name: 'Richmond', logo: '/teamlogo/richmond.png' },
      { name: 'Collingwood', logo: '/teamlogo/collingwood.png' },
    ],
    date: 'Thursday, 9 Apr 2025',
    time: '7:30 pm',
  };

  // Function to calculate the countdown to the match
  const getCountdown = () => {
    const matchDate = new Date(`${match.date} ${match.time}`);
    const now = new Date();
    const timeLeft = matchDate - now;

    if (timeLeft <= 0) {
      return 'The match has started!';
    }

    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  // State to hold the countdown timer
  const [countdown, setCountdown] = useState(getCountdown());

  // Update countdown every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getCountdown());
    }, 1000);

    // Cleanup timer when component is unmounted
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="home-container">
      <Navbar />

      <div className="hero-section">
        <h1 className="hero-title">Track AFL Team Rankings in Real Time!</h1>
        <p className="hero-subtitle">
          Get live ELO ratings, match predictions, and team insights!
        </p>
      </div>

      {/* Upcoming Match Section */}
      <div className="card-container">
        <div className="card-box">
          <h2>Upcoming Match</h2>
          <h4 className="countdown-timer">Time left: {countdown}</h4>
          <h3 className="match-title">
            <span className="team">
              <img
                src={match.teams[0].logo}
                alt={match.teams[0].name}
                className="mini-logo"
              />
              {match.teams[0].name}
            </span>
            <span className="vs-text">VS</span>
            <span className="team">
              <img
                src={match.teams[1].logo}
                alt={match.teams[1].name}
                className="mini-logo"
              />
              {match.teams[1].name}
            </span>
          </h3>
          <h3>{match.date}</h3>
          <h3>{match.time}</h3>

          {/* View Predictions Button */}
          <Link to="/predictions" className="predict-btn">
            View Predictions
          </Link>
        </div>
      </div>

      {/* Table of teams */}
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
          <tr>
            <td>1</td>
            <td>Collingwood</td>
            <td>1650</td>
            <td>5 Wins</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Richmond</td>
            <td>1620</td>
            <td>3 Wins</td>
          </tr>
          <tr>
            <td>3</td>
            <td>Geelong</td>
            <td>1585</td>
            <td>2 Wins</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
