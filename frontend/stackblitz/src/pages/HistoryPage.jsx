import React, { useMemo, useState, useTransition, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import './HistoryPage.css';
import { fetchAllTeams, fetchAllMatches } from "../services/api"; // adjust path if needed
// import makeLogo from "../components/util";

const makeLogo = name =>
  `/teamlogo/${name.toLowerCase().replace(/\s+/g, '')}.png`;


export default function HistoryPage() {
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [showElo, setShowElo]               = useState(true);
  const [recentMatchCount, setRecentMatchCount] = useState(5);
  const [visibleCount, setVisibleCount] = useState(10);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [isPending, startTransition] = useTransition();

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

  const hasMore = visibleCount < enrichedMatches.length;
  
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
  
  useEffect(() => {
    setVisibleCount(10);
  }, [selectedTeams]);
  
  console.log('teamsWithLogos', teamsWithLogos);
  // console.log('recent', recentMatches);
//   if (loadingTeams || loadingMatches) return <div>Loading...</div>;
//   if (errorTeams || errorMatches) return <div>Error loading data.</div>;

  const toggleTeam = (teamId) => {
    startTransition(() => {
      setSelectedTeams(prev =>
        prev.includes(teamId)
          ? prev.filter(id => id !== teamId)
          : [...prev, teamId]
      );
    });
  };

  const filteredMatches = useMemo(() => {
    if (!enrichedMatches) return [];
    if (selectedTeams.length === 0) return enrichedMatches;
    return enrichedMatches.filter(
      match =>
        selectedTeams.includes(match.home.id) ||
        selectedTeams.includes(match.away.id)
    );
  }, [enrichedMatches, selectedTeams]);

  const visibleMatches = filteredMatches.slice(0, visibleCount);

  

  useEffect(() => {
    setVisibleCount(10);
  }, [selectedTeams]);

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
      <div className="team-info-card card-box ">
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

  // Loading/Error UI
  if (loadingTeams || loadingMatches) return <div>Loading...</div>;
  if (errorTeams || errorMatches) return <div>Error loading data.</div>;

  return (
    <div className="home-container">
        <Navbar />
        <div className="history-page-container">
        {/* Jump to Team Dropdown
        <section className="team-search-section">
            <label htmlFor="team-select">Jump to team:</label>
            <select
            id="team-select"
            value={selectedTeamId}
            onChange={(e) => setSelectedTeamId(e.target.value)}
            >
            <option value="">Select team…</option>
            {teams.map((t) => (
                <option key={t.id} value={t.id}>
                {t.name}
                </option>
            ))}
            </select>
            {renderTeamCard()}
        </section> */}

        {/* Recent Matches Display */}
        <section className="recent-section ">
            <h1>Recent Matches</h1>
            <div className="team-icon-row">
              {teamsWithLogos.map((team) => (
                <img
                  key={team.id}
                  src={team.logo}
                  alt={team.name}
                  className={`team-icon ${selectedTeams.includes(team.id) ? 'selected' : ''}`}
                  onClick={() => toggleTeam(team.id)}
                  title={team.name}
                />
              ))}
            </div>
            <div className="recent-grid">
            {visibleMatches.map((m) => (
                <div className="recent-card" key={m.id}>
                    <p className="recent-date">
                    {m.dateObj.toLocaleDateString(undefined, {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                    })}{" "}
                    | Round {m.round_num} @ {m.venue}
                    </p>
                    <div className="recent-teams">
                    <span className="team">
                        <img src={m.home.logo} alt={m.home.name} />
                        {m.home.name}
                    </span>
                    <span className="score">
                        {m.team1_score}&nbsp;–&nbsp;{m.team2_score}
                    </span>
                    <span className="team">
                        <img src={m.away.logo} alt={m.away.name} />
                        {m.away.name}
                    </span>
                    </div>
                </div>
                ))}
            </div>
            {visibleCount < filteredMatches.length && (
              <button
                className="show-more-button"
                onClick={() => setVisibleCount(prev => prev + 10)}
              >
                Show More Matches
              </button>
            )}
        </section>
        </div>
    </div>
  );
}
