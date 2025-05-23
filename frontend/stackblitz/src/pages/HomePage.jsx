import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MiniDateSelector from '../components/DatePicker';
import './HomePage.css';
import {API} from '../config.js'
import { useQuery } from '@tanstack/react-query';
import { fetchAllMatches, fetchAllTeams, fetchTeamRankings } from '../services/api.js';

// helper: normalize team name -> logo filename
const makeLogo = name =>
  `/teamlogo/${name.toLowerCase().replace(/\s+/g, '')}.png`;

export default function HomePage() {
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [showElo, setShowElo]               = useState(true);
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
      : null;
  }, [allMatches]);

  const [selectedDate, setSelectedDate] = useState(latestMatchDate);
  
  // Sync when latestMatchDate is available
  useEffect(() => {
    if (latestMatchDate) {
      setSelectedDate(latestMatchDate);
    }
  }, [latestMatchDate]);
//   console.log('selectedDate', selectedDate);
//   console.log('latestMatchDate', latestMatchDate);

  const {
    data: Rankings,
    isLoading: loadingRankings,
    isError: errorRankings,
  } = useQuery({queryKey: ['rankings'], queryFn: () => fetchTeamRankings(selectedDate.toLocaleDateString('en-CA')), enabled:!! selectedDate});

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
      dateObj: new Date(match.date+ '+10:00'),
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
    if (!Rankings || !teamsWithLogos.length || !allMatches) return [];
  
    return Rankings.map(team => {
      const teamMatches = allMatches
        .filter(
          match =>
            match.team1_id === team.team_id || match.team2_id === team.team_id
        )
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 9); // most recent 9 matches
  
      const winHistory = teamMatches.map(match => {
        const isHome = match.team1_id === team.team_id;
        const teamScore = isHome ? match.team1_score : match.team2_score;
        const oppScore = isHome ? match.team2_score : match.team1_score;
        return teamScore > oppScore ? "W" : "L";
      });
  
      return {
        ...team,
        team: teamsWithLogos.find(t => t.id === team.team_id),
        winHistory,
      };
    });
  }, [Rankings, teamsWithLogos, allMatches]);
  

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
      .slice(0, 5);

    return (
      <div className="team-info-card card-box">
        {/* header row */}
        <div className="team-header">
          <span className="team-name">{team.name}</span>
          <span className="elo-score">ELO Score: —</span>
          <span className="last3-label">Last 5 Results:</span>
        </div>
        <ul className="team-results">
          {results.map(m => {
            const home = teamsWithLogos.find(t => t.id === m.team1_id);
            const away = teamsWithLogos.find(t => t.id === m.team2_id);
            const date = new Date(m.date).toLocaleDateString(undefined, {
              month: 'short', day: 'numeric', year: 'numeric'
            });
            return (
              <li key={m.id} className="match-result">
                <strong>{date}</strong> :&nbsp;
                <img src={home.logo} alt={home.name} className="team-logo" style={{ height: '40px', width: '40px', objectFit: 'contain' }}/>
                {home.name} {m.team1_score}–{m.team2_score}
                <img src={away.logo} alt={away.name} className="team-logo" style={{ height: '40px', width: '40px', objectFit: 'contain' }}/>
                {away.name}
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
          Track AFL Team Rankings in All Time!
        </h1>
        <h2 className="hero-subtitle">
          Get live ELO ratings, match predictions, and team insights!
        </h2>
      </section>

      {latestMatchDate && (
        <MiniDateSelector
          defaultDate={latestMatchDate}
          maxValidDate={latestMatchDate}
          onDateChange={setSelectedDate}
        />
      )}
      {/* Standings Table */}
      <section className="table-section" data-testid="team-standings-table">
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
                <th>Win Streaks</th>
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
                        <Link 
                            to={`/team/${ranking.team_id}`} 
                            style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}
                        >
                            <img 
                            src={ranking.team.logo} 
                            alt={ranking.team.name}
                            style={{ width: '24px', height: '24px', objectFit: 'contain', marginRight: '8px' }}
                            />
                            {ranking.team.name}
                        </Link>
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
                      <td className="win-history">
                        {ranking.winHistory
                          ? ranking.winHistory.map((r, idx) => (
                              <span key={idx} className={r === 'W' ? 'win' : 'loss'}>
                                {r}
                              </span>
                            ))
                          : '-'}
                      </td>
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
              The ELO rating is a number that represents a team's strength based on past performance.
              Every team starts with a base rating of <strong>1000</strong>.
              After each match, the winner gains points and the loser loses points.
            </p>
            <p>
              The number of points exchanged depends on how strong each team was before the match.
              Beating a strong opponent increases your rating more than beating a weak one.
              Over time, ELO helps show which teams are on a hot streak or underperforming.
            </p>
            <p>
              ELO is used in sports, chess, and esports — and here, it helps rank AFL teams more fairly than just win/loss records.
            </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}