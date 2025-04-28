import React, { useEffect, useState } from 'react';
import { useParams }               from 'react-router-dom';
import Navbar                      from '../components/Navbar.jsx';
import Footer                      from '../components/Footer.jsx';
import './TeamPage.css';

const API = 'http://127.0.0.1:5000';

export default function TeamPage() {
  const { id } = useParams();
  const [team, setTeam]       = useState(null);
  const [eloHistory, setElo]  = useState([]);
  const [stats, setStats]     = useState([]);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    fetch(`${API}/teams/`)
      .then(r => r.json())
      .then(ts => setTeam(ts.find(t => t.id === +id)))
      .catch(console.error);

    fetch(`${API}/elo_ratings/`)
      .then(r => r.json())
      .then(es =>
        setElo(es
          .filter(e => e.team_id === +id)
          .sort((a,b)=>new Date(b.date)-new Date(a.date)))
      )
      .catch(console.error);

    fetch(`${API}/match_stats/`)
      .then(r => r.json())
      .then(ms => setStats(ms.filter(s => s.team_id === +id)))
      .catch(console.error);

    fetch(`${API}/matches/`)
      .then(r => r.json())
      .then(ms =>
        setMatches(ms
          .filter(m => m.team1_id===+id||m.team2_id===+id)
          .map(m => ({ ...m, dateObj: new Date(m.date) }))
          .sort((a,b)=>b.dateObj-a.dateObj)
          .slice(0,5))
      )
      .catch(console.error);
  }, [id]);

  if (!team) {
    return (
      <div className="team-page-container">
        <Navbar />
        <div className="loading-container"><div className="spinner"/></div>
      </div>
    );
  }

  const currentElo = eloHistory[0]?.rating_after ?? '—';
  const agg = stats.reduce((acc, s) => {
    Object.entries(s).forEach(([k, v]) => {
      if (typeof v === 'number') acc[k] = (acc[k] || 0) + v;
    });
    return acc;
  }, {});

  return (
    <div className="team-page-container">
      <Navbar />

      <header className="team-header">
        <img
          src={`/teamlogo/${team.name.toLowerCase().replace(/\s+/g,'')}.png`}
          alt={team.name}
          className="team-logo"
        />
        <h1>{team.name}</h1>
        <p className="venue">{team.home_venue}</p>
      </header>

      <section className="elo-section">
        <h2>Current ELO Rating</h2>
        <div className="elo-card">
          <span className="elo-value">{currentElo}</span>
        </div>
      </section>

      <section className="stats-section">
        <h2>Season Totals</h2>
        <div className="stats-grid">
          <div className="stat-box">
            <h3>Disposals</h3>
            <p>{agg.disposals || 0}</p>
          </div>
          <div className="stat-box">
            <h3>Kicks</h3>
            <p>{agg.kicks || 0}</p>
          </div>
          <div className="stat-box">
            <h3>Marks</h3>
            <p>{agg.marks || 0}</p>
          </div>
          <div className="stat-box">
            <h3>Tackles</h3>
            <p>{agg.tackles || 0}</p>
          </div>
        </div>
      </section>

      <section className="matches-section">
        <h2>Last 5 Matches</h2>
        <ul className="matches-list">
          {matches.map(m => {
            const opponentId = m.team1_id === +id ? m.team2_id : m.team1_id;
            const opponent   = /* you can fetch name from teams list if you store it in context */
              `Team ${opponentId}`;
            return (
              <li key={m.id}>
                <strong>
                  {m.dateObj.toLocaleDateString(undefined, {
                    month: 'short',
                    day:   'numeric',
                    year:  'numeric',
                  })}
                </strong> vs {opponent} — {m.score_team1}–{m.score_team2}
              </li>
            );
          })}
        </ul>
      </section>

      <Footer />
    </div>
  );
}
