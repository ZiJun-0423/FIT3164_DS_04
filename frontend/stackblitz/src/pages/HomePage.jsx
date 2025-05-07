import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MiniDateSelector from '../components/DatePicker';
import Dropdown from '../components/Dropdown.jsx';
import './HomePage.css';
import {API} from '../config.js'
import { useQuery } from '@tanstack/react-query';
import { fetchAllMatches, fetchAllTeams,fetchTeamRankings } from '../services/api.js';

// helper: normalize team name → logo filename
const makeLogo = name =>
  `/teamlogo/${name.toLowerCase().replace(/\s+/g, '')}.png`;

// Get Season Year
const getSeasonYear = (date) => {
  const month = date.getMonth(); // Jan = 0
  const year = date.getFullYear();
  return month >= 2 ? year : year - 1; // AFL season usually starts in March (month 2)
};

export default function HomePage() {
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [showElo, setShowElo]               = useState(true);
  const [recentMatchCount, setRecentMatchCount] = useState(5);

  // Teams
  const {
    data: teams,
    isLoading: loadingTeams,
    isError: errorTeams,
  } = useQuery({ queryKey: ['teams'], queryFn: fetchAllTeams });

  // All Matches
  const {
    data: allMatches,
    isLoading: loadingMatches,
    isError: errorMatches,
  } = useQuery({ queryKey: ['allMatches'], queryFn: fetchAllMatches });

  // Create a fast lookup map for teams with logos
  const teamMap = useMemo(() => {
    if (!teams) return {};
    return teams.reduce((acc, team) => {
      acc[team.id] = { ...team, logo: makeLogo(team.name) };
      return acc;
    }, {});
  }, [teams]);

  // --- UTILITY: Determine season type based on date ---
  const getSeasonFromDate = (date) => {
    const month = date.getMonth(); // March = 2, September = 8
    return month >= 8 ? 'Finals' : 'Regular';
  };

  // --- MEMO: Find latest match date from all matches ---
  const latestMatchDate = useMemo(() => {
    if (!allMatches?.length) return new Date();
    return allMatches.reduce((latest, match) => {
      const matchDate = new Date(match.date);
      return matchDate > latest ? matchDate : latest;
    }, new Date(0));
  }, [allMatches]);

  // --- MEMO: Derive default dropdown season from latest match ---
  const defaultSeason = useMemo(() => {
    return {
      year: latestMatchDate.getFullYear(),
      type: getSeasonFromDate(latestMatchDate),
    };
  }, [latestMatchDate]);

  // --- STATE: Selected date for rankings (sets on first load or update) ---
  const [selectedDate, setSelectedDate] = useState(null);

  // --- EFFECT: Set selectedDate on first load ---
  useEffect(() => {
    if (!allMatches?.length) return;

    const today = new Date();
    const hasTodayMatch = allMatches.some(match => {
      const matchDate = new Date(match.date);
      return matchDate.toDateString() === today.toDateString();
    });

    setSelectedDate(hasTodayMatch ? today : latestMatchDate);
  }, [allMatches, latestMatchDate]);

  // --- QUERY: Fetch rankings based on selected date ---
  const {
    data: rankings,
    isLoading: loadingRankings,
    isError: errorRankings,
  } = useQuery({
    queryKey: ['rankings', selectedDate?.toISOString().split('T')[0]],
    queryFn: () => fetchTeamRankings(selectedDate.toISOString().split('T')[0]),
    enabled: !!selectedDate,
  });

  // --- MEMO: Enrich matches with team data ---
  const enrichedMatches = useMemo(() => {
    if (!allMatches || !Object.keys(teamMap).length) return [];
    return allMatches.map(match => ({
      ...match,
      dateObj: new Date(match.date),
      home: teamMap[match['team1 id']],
      away: teamMap[match['team2 id']],
    }));
  }, [allMatches, teamMap]);


  // Recent matches
  const recentMatches = useMemo(() => {
    return [...enrichedMatches]
      .sort((a, b) => b.dateObj - a.dateObj)
      .slice(0, recentMatchCount);
  }, [enrichedMatches, recentMatchCount]);

  // Enriched rankings
  const enrichedRankings = useMemo(() => {
    if (!rankings || !Object.keys(teamMap).length) return [];
    return rankings.map((team) => ({
      ...team,
      team: teamMap[team.team_id],
    }));
  }, [rankings, teamMap]);

  // Loading/Error UI
  if (loadingTeams || loadingMatches) return <div>Loading...</div>;
  if (errorTeams || errorMatches) return <div>Error loading data.</div>;

  console.log('selectedDate', selectedDate);
  console.log('latestMatchDate', latestMatchDate);
  console.log('enrichedRankings', enrichedRankings);

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

      {/* Show Recent Matches */}
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
        <div className={`recent-grid ${recentMatchCount >= 5 ? 'fixed-grid' : 'auto-grid'}`}>
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

      {/* Date Selector*/}
      {/* <MiniDateSelector defaultDate={latestMatchDate} onDateChange={(date) => setSelectedDate(date)}/> */}

      {/* Dropdown*/}
      <Dropdown
        defaultValue={defaultSeason}
        onSeasonChange={(season) => {
          console.log("Selected season:", season); // e.g., { year: 2024, type: 'Finals' }

          // Map season to a representative date
          const representativeDate = new Date(
            season.year,
            season.type === 'Finals' ? 8 : 2, // September (8) for Finals, March (2) for Regular
            15 // Mid-month to avoid edge cases
          );

          setSelectedDate(representativeDate);
        }}
      />


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
              {loadingRankings || errorRankings ? (
                <tr>
                  <td colSpan="7">
                    <div className="loading-container">
                      <div className="spinner" />
                    </div>
                  </td>
                </tr>
              ) : (
                enrichedRankings.map((ranking, i) => (
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
                    <td>{ranking.points_for}</td>
                    <td>{ranking.points_against}</td>
                    <td>{ranking.percentage ? Number(ranking.percentage).toFixed(2) : '—'}</td>
                    <td>{ranking.elo}</td>
                    <td>{4}</td>
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
