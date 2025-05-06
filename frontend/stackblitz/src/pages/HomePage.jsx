import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MiniDateSelector from '../components/DatePicker';
import './HomePage.css';
import {API} from '../config.js'
import { useQuery } from '@tanstack/react-query';
import { fetchAllMatches, fetchAllTeams,fetchTeamRankings } from '../services/api.js';

// helper: normalize team name → logo filename
const makeLogo = name =>
  `/teamlogo/${name.toLowerCase().replace(/\s+/g, '')}.png`;

export default function HomePage() {
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [showElo, setShowElo]               = useState(false);
  const [recentMatchCount, setRecentMatchCount] = useState(5);

  const {
    data: teams,
    isLoading: loadingTeams,
    isError: errorTeams,
    } = useQuery({ queryKey: ['teams'], queryFn: fetchAllTeams });

  const {
    data: allMatches,
    isLoading: loadingMatches,
    isError: errorMatches,
    } = useQuery({ queryKey: ['allMatches'], queryFn: fetchAllMatches });

  const latestMatchDate = useMemo(() => {
    return allMatches?.length
      ? new Date(Math.max(...allMatches.map(m => new Date(m.date))))
      : new Date(); // fallback
  }, [allMatches]);

  const [selectedDate, setSelectedDate] = useState(latestMatchDate);

  const {
    data: Rankings,
    isLoading: loadingRankings,
    isError: errorRankings,
  } = useQuery({queryKey: ['rankings'], queryFn: () => fetchTeamRankings(selectedDate.toISOString().split('T')[0]), enabled:!! selectedDate});

  const teamsWithLogos = useMemo(() => {
    if (!teams) return [];
    return teams.map(team => ({
      ...team,
      logo: makeLogo(team.name),
    }));
  }, [teams]);

  const enrichedMatches = useMemo(() => {
    if (!allMatches || !teamsWithLogos.length) return [];
  
    return allMatches.map(match => ({
      ...match,
      dateObj: new Date(match.date),
      home: teamsWithLogos.find(t => t.id === match['team1_id']),
      away: teamsWithLogos.find(t => t.id === match['team2_id']),
    }));
  }, [allMatches, teamsWithLogos]);

  const recentMatches = useMemo(() => {
    if (!enrichedMatches.length) return [];
    
    // Sort by date descending and take the 5 most recent
    return [...enrichedMatches]
      .sort((a, b) => b.dateObj - a.dateObj)
      .slice(0, recentMatchCount);
  }, [enrichedMatches, recentMatchCount]);

  const enrichedRankings = useMemo(() => {
    if (!Rankings || !teamsWithLogos.length) return [];
    return Rankings.map(team => ({
      ...team,
      team: teamsWithLogos.find(t => t.id === team.team_id)
    }));
  }, [Rankings, teamsWithLogos]);

//   console.log('selectedDate', selectedDate);
//   console.log('recent', recentMatches);
//   if (loadingTeams || loadingMatches) return <div>Loading...</div>;
//   if (errorTeams || errorMatches) return <div>Error loading data.</div>;

  // render selected team's info card
  const renderTeamCard = () => {
    if (!selectedTeamId) return null;
    const id = +selectedTeamId;``
    const team = teamsWithLogos.find(t => t.id === id);
    const results = enrichedMatches
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
            const home = teamsWithLogos.find(t => t.id === m.team1_id);
            const away = teamsWithLogos.find(t => t.id === m.team2_id);
            const date = new Date(m.date).toLocaleDateString(undefined, {
              month: 'short', day: 'numeric', year: 'numeric'
            });
            return (
              <li key={m.id}>
                <strong>{date}</strong> – {home.name} {m.team1_score}–{m.team2_score} {away.name}
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
          {teamsWithLogos.map(t => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
        {renderTeamCard()}
      </section>
      <label>
      Show recent matches:&nbsp;
      <select
        value={recentMatchCount}
        onChange={(e) => setRecentMatchCount(parseInt(e.target.value))}
      >
        <option value={3}>3</option>
        <option value={5}>5</option>
        <option value={10}>10</option>
        <option value={20}>20</option>
      </select>
      </label>
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
                    {m.team1_score}–{m.team2_score}
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
      {latestMatchDate && (
        <MiniDateSelector
          defaultDate={latestMatchDate}
          maxValidDate={latestMatchDate}
          onDateChange={setSelectedDate}
        />
      )}
      {/* Standings Table */}
      <section className="table-section">
        <h2>Team Standings</h2>
        <div className="table-wrapper">
          <table className="table-container">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Club</th>
                <th>Played</th>
                <th>Points</th>
                <th>%</th>
                <th>Won</th>
                <th>Lost</th>
                <th>Drawn</th>
                <th>PF</th>
                <th>PA</th>
                <th>ELO Score</th>
                <th>Win Streak</th>
              </tr>
            </thead>
            <tbody>
              {!enrichedRankings.length ? (
                <tr>
                  <td colSpan="7">
                    <div className="loading-container">
                      <div className="spinner" />
                    </div>
                  </td>
                </tr>
              ) : (
                enrichedRankings
                  .sort((a, b) => b.points - a.points)
                  .map((ranking, i) => (
                    <tr key={ranking.team_id}>
                      <td>{i + 1}</td>
                      <td>
                        <img 
                          src={ranking.team.logo} 
                          alt={ranking.team.name}
                          style={{ width: '24px', height: '24px', objectFit: 'contain', marginRight: '8px' }}
                        />
                        {ranking.team.name}
                      </td>
                      <td>{ranking.played}</td>
                      <td>{ranking.points}</td>
                      <td>{ranking.percentage ? Number(ranking.percentage).toFixed(2) : '—'}</td>
                      <td>{ranking.wins}</td>
                      <td>{ranking.losses}</td>
                      <td>{ranking.draws}</td>
                      <td>{ranking.points_for}</td>
                      <td>{ranking.points_against}</td>
                      <td>{ranking.elo}</td>
                      <td>{ranking.win_streak}</td>
                    </tr>
                ))
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
