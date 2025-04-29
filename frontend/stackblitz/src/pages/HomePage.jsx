import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './HomePage.css';

const API = 'http://127.0.0.1:5000';

// helper: normalize team name → logo filename
const makeLogo = name =>
  `/teamlogo/${name.toLowerCase().replace(/\s+/g, '')}.png`;

export default function HomePage() {
  const [teams, setTeams]               = useState([]);
  const [allMatches, setAllMatches]     = useState([]);
  const [recentMatches, setRecentMatches] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [showElo, setShowElo]           = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/teams/`).then(r => r.json()),
      fetch(`${API}/matches/`).then(r => r.json()),
    ])
      .then(([teamsData, matchesData]) => {
        setAllMatches(matchesData);

        const teamsWithLogos = teamsData.map(t => ({
          ...t,
          logo: makeLogo(t.name),
        }));
        setTeams(teamsWithLogos);

        const enriched = matchesData
          .map(m => ({
            ...m,
            dateObj: new Date(m.date),
            home: teamsWithLogos.find(t => t.id === m['team1 id']),
            away: teamsWithLogos.find(t => t.id === m['team2 id']),
          }))
          .sort((a, b) => b.dateObj - a.dateObj)
          .slice(0, 5);

        setRecentMatches(enriched);
      })
      .catch(console.error);
  }, []);

  // render selected team's info card
  const renderTeamCard = () => {
    if (!selectedTeamId) return null;
    const id = +selectedTeamId;
    const team = teams.find(t => t.id === id);
    const results = allMatches
      .filter(m => m.team1_id === id || m.team2_id === id)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 3);

    return (
      <div className="team-info-card card-box">
        {/* header row */}
        <div className="team-header">
          <span className="team-name">{team.name}</span>
          <span className="elo-score">ELO Score: —</span>
          <span className="last3-label">Last 3 Results</span>
        </div>
        <ul className="team-results">
          {results.map(m => {
            const home = teams.find(t => t.id === m.team1_id);
            const away = teams.find(t => t.id === m.team2_id);
            const date = new Date(m.date).toLocaleDateString(undefined, {
              month: 'short', day: 'numeric', year: 'numeric'
            });
            return (
              <li key={m.id}>
                <strong>{date}</strong> – {home.name} {m.score_team1}–{m.score_team2} {away.name}
              </li>
            );
          })}
        </ul>
        <Link to={`/stats/${id}`} className="predict-btn">
          View Full Stats
        </Link>
      </div>
    );
  };

  return (
    <div className="home-container">
      <Navbar />

      {/* Hero */}
      <section className="hero-section">
        <h1 className="hero-title">
          Track AFL Team Rankings in Real Time!
        </h1>
        <p className="hero-subtitle">
          Get live ELO ratings, match predictions, and team insights!
        </p>
      </section>

      {/* Quick Team Jump */}
      <section className="team-search-section">
        <label htmlFor="team-select">Jump to team:</label>
        <select
          id="team-select"
          value={selectedTeamId}
          onChange={e => setSelectedTeamId(e.target.value)}
        >
          <option value="">Select team…</option>
          {teams.map(t => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
        {renderTeamCard()}
      </section>

      {/* Recent Matches */}
      <section className="recent-section">
        <h2>Recent Matches</h2>
        <div className="recent-grid">
          {recentMatches.length > 0 ? (
            recentMatches.map((m, idx) => (
              <div className="recent-card" key={idx}>
                <p className="recent-date">
                  {m.dateObj.toLocaleDateString(undefined, {
                    weekday: 'short',
                    day:     'numeric',
                    month:   'short',
                    year:    'numeric',
                  })}{' '}
                  | Round {m.round_num} @ {m.venue}
                </p>
                <div className="recent-teams">
                  <span className="team">
                    <img src={m.home.logo} alt={m.home.name} />
                    {m.home.name}
                  </span>
                  <span className="score">
                    {m.score_team1}–{m.score_team2}
                  </span>
                  <span className="team">
                    <img src={m.away.logo} alt={m.away.name} />
                    {m.away.name}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="loading-container">
              <div className="spinner" />
            </div>
          )}
        </div>
      </section>

      {/* Standings Table */}
      <section className="table-section">
        <h2>Team Standings</h2>
        <div className="table-wrapper">
          <table className="table-container">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Club</th>
                <th>Points For</th>
                <th>Points Against</th>
                <th>Percentage(%)</th>
                <th>ELO Score</th>
                <th>Win Streak</th>
              </tr>
            </thead>
            <tbody>
              {teams.length > 0 ? (
                teams.map((team, i) => (
                  <tr key={team.id}>
                    <td>{i + 1}</td>
                    <td>{team.name}</td>
                    <td>—</td>
                    <td>—</td>
                    <td>—</td>
                    <td>—</td>
                    <td>—</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="loading-cell">
                    <div className="spinner" />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ELO Explanation Card */}
      <section className="elo-section">
        <div className="card-box elo-card">
          <button
            className="elo-toggle"
            onClick={() => setShowElo(s => !s)}
          >
            What is an ELO rating? {showElo ? '▲' : '▼'}
          </button>
          {showElo && (
            <div className="elo-content">
              <p>
                The <strong>ELO rating</strong> system was originally devised
                for chess to measure the relative skill levels of competitors.
                Each AFL team starts with a base rating (e.g. 1500). After each
                match, the winner takes points from the loser—the amount depends
                on the margin of victory and pre-game ratings. Over the season,
                ELO provides a dynamic, self-correcting measure of who’s hot or
                in a slump.
              </p>
              <p>
                Wins against stronger opponents yield bigger jumps. Think of it
                as a real-time ladder that adjusts not just for wins/losses but
                also for the quality of each victory.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
