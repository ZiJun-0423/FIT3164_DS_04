import React, { useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchAllTeams, fetchAllMatches } from "../services/api"; // adjust path if needed
import makeLogo from "../components/util";

export default function HistoryPage() {
  const [recentMatchCount, setRecentMatchCount] = useState(5);
  const [selectedTeamId, setSelectedTeamId] = useState("");

  // Fetch teams
  const {
    data: teams,
    isLoading: loadingTeams,
    isError: errorTeams,
  } = useQuery({ queryKey: ["teams"], queryFn: fetchAllTeams });

  // Fetch matches
  const {
    data: allMatches,
    isLoading: loadingMatches,
    isError: errorMatches,
  } = useQuery({ queryKey: ["allMatches"], queryFn: fetchAllMatches });

  // Map team IDs to team objects with logos
  const teamMap = useMemo(() => {
    if (!teams) return {};
    return teams.reduce((acc, team) => {
      acc[team.id] = { ...team, logo: makeLogo(team.name) };
      return acc;
    }, {});
  }, [teams]);

  // Enrich match data with team info
  const enrichedMatches = useMemo(() => {
    if (!allMatches || !Object.keys(teamMap).length) return [];
  
    return allMatches
      .map(match => {
        const home = teamMap[match["team1 id"]];
        const away = teamMap[match["team2 id"]];
        if (!home || !away) return null;
  
        return {
          ...match,
          dateObj: new Date(match.date),
          home,
          away
        };
      })
      .filter(Boolean); // remove nulls
  }, [allMatches, teamMap]);

  // Team info card
  const renderTeamCard = () => {
    if (!selectedTeamId) return null;
    const id = +selectedTeamId;
    const team = teamMap[id];
    if (!team) return null;

    const results = enrichedMatches
      .filter((m) => m["team1 id"] === id || m["team2 id"] === id)
      .sort((a, b) => b.dateObj - a.dateObj)
      .slice(0, 5);

    return (
      <div className="team-info-card card-box">
        <div className="team-header">
          <span className="team-name">{team.name}</span>
          <span className="elo-score">ELO Score: —</span>
          <span className="last3-label">Last 5 Results:</span>
        </div>
        <ul className="team-results">
          {results.map((m) => {
            const date = m.dateObj.toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            });
            return (
              <li key={m.id} className="match-result">
                <strong>{date}</strong> :&nbsp;
                <img src={m.home.logo} alt={m.home.name} className="team-logo" />
                {m.home.name} {m.team1_score}–{m.team2_score}
                <img src={m.away.logo} alt={m.away.name} className="team-logo" />
                {m.away.name}
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
        {/* Jump to Team Dropdown */}
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
        </section>

        {/* Show Recent Matches Dropdown */}
        <label className="recent-matches-label">
            Show recent matches:&nbsp;
            <select
            value={recentMatchCount}
            onChange={(e) => setRecentMatchCount(parseInt(e.target.value))}
            >
            <option value={3}>3</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
            </select>
        </label>

        {/* Recent Matches Display */}
        <section className="recent-section">
            <h2>Recent Matches</h2>
            <div className="recent-grid">
            {[...enrichedMatches]
                .sort((a, b) => b.dateObj - a.dateObj)
                .slice(0, recentMatchCount)
                .map((m) => (
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
                        {m.team1_score}–{m.team2_score}
                    </span>
                    <span className="team">
                        <img src={m.away.logo} alt={m.away.name} />
                        {m.away.name}
                    </span>
                    </div>
                </div>
                ))}
            </div>
        </section>
        </div>
    </div>
  );
}
