import React, { useMemo, useState } from 'react';
import Plot from 'react-plotly.js';
import { useDynamicEloQuery, useEnrichedMatches } from '../../services/api_hooks';

export default function SoloTeamEloChart({ team_id, settings }) {
  const { data: allEloData, eloIsLoading, eloError } = useDynamicEloQuery(settings);
  const { enrichedMatches, matchIsLoading, matchError } = useEnrichedMatches();
  const [hoveredMatch, setHoveredMatch] = useState(null)
  console.log('Elo data:', allEloData);

  console.log('Hovered match:', hoveredMatch);
  const teamEloData = useMemo(() => {
    if (!allEloData) return [];
    
    // Ensure team_id is compared as a number
    return allEloData.filter((d) => Number(d.team_id) === Number(team_id));
  }, [allEloData, team_id]);
    
  const dates = teamEloData.map((d) => new Date(d.date)); // safely converts to JS Date objects
  const elos = teamEloData.map((d) => d.rating_after);

  const enrichedMatchesWithElo = useMemo(() => {
    if (!enrichedMatches || !allEloData) return [];
    
    // Ensure team_id is compared as a number
    return enrichedMatches.map((match) => {
      return {
        ...match,
        homeElo: allEloData.find((elo) => Number(elo.match_id) === Number(match.match_id) && Number(elo.team_id) === Number(match.team1_id)),
        awayElo: allEloData.find((elo) => Number(elo.match_id) === Number(match.match_id) && Number(elo.team_id) === Number(match.team2_id)),
      };
    });
  }, [enrichedMatches, allEloData]);

  if (eloIsLoading || matchIsLoading) return <p>Loading Elo ratings...</p>;
  if (eloError || matchError) return <p>Error: {matchError.message}</p>;
  
  if (!dates.length || !elos.length) {
    return <p>No data available to display</p>;
  }
  
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Plot
        data={[
          {
            x: dates,
            y: elos,
            type: 'scatter',
            mode: 'lines+markers',
            name: `Team ${team_id}`,
            marker: { color: '#00bfa6' },
            line: { shape: 'spline' },
            customdata: teamEloData.map(d => d.match_id),
            hoverinfo: 'x+y',
          },
        ]}
        layout={{
          title: `Elo Over Time - Team ${team_id}`,
          xaxis: {
            title: 'Date',
            type: 'date', // Ensure Plotly knows it's a date-based x-axis
            tickformat: '%b %d, %Y', // Format the date as 'Month Day, Year'
          },
          yaxis: { title: 'Elo Rating' },
          autosize: true,
          margin: { t: 50, l: 50, r: 20, b: 40 },
          paper_bgcolor: 'var(--card-bg)',
          plot_bgcolor: 'var(--card-bg)',
          font: { color: 'var(--text-color)' },
        }}
        config={{
          responsive: true,
          displayModeBar: true,
          displaylogo: false,
        }}
        style={{ width: '100%', height: '100%' }}
        onHover={(event) => {
          const matchId = event.points?.[0]?.customdata;
          const match = enrichedMatchesWithElo.find(m => m.match_id === matchId);
          setHoveredMatch(match);
        }}
        onUnhover={() => setHoveredMatch(null)}
      />
      {hoveredMatch && (
        <div
          className="match-card"
          style={{
            position: 'absolute',
            top: 20,
            left: 20,
            zIndex: 1000,
            background: '#222',
            color: '#fff',
            padding: '1rem',
            borderRadius: '10px',
            boxShadow: '0 0 10px rgba(0,0,0,0.5)'
          }}
        >
          <h4>{new Date(hoveredMatch.date).toLocaleDateString()}</h4>
<div style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
  {/* Home Team */}
  <div style={{ textAlign: 'center' }}>
    <img src={hoveredMatch.home.logo} alt={hoveredMatch.home.name} height={40} width={40} />
    <div>{hoveredMatch.home.name}</div>
    <div> Score: {hoveredMatch.team1_score} </div>
    <div>ELO: {hoveredMatch.homeElo?.rating_after ?? 'N/A'}</div>
    <div style={{ color: hoveredMatch.homeElo?.rating_change > 0 ? 'green' : 'red' }}>
      {hoveredMatch.homeElo?.rating_change > 0 ? '▲' : '▼'} {Math.abs(hoveredMatch.homeElo?.rating_change ?? 0).toFixed(1)}
    </div>
  </div>

  <strong style={{ alignSelf: 'center' }}>vs</strong>

  {/* Away Team */}
  <div style={{ textAlign: 'center' }}>
    <img src={hoveredMatch.away.logo} alt={hoveredMatch.away.name} height={40} width={40} />
    <div>{hoveredMatch.away.name}</div>
    <div> Score: {hoveredMatch.team2_score} </div>
    <div>ELO: {hoveredMatch.awayElo?.rating_after ?? 'N/A'}</div>
    <div style={{ color: hoveredMatch.awayElo?.rating_change > 0 ? 'green' : 'red' }}>
      {hoveredMatch.awayElo?.rating_change > 0 ? '▲' : '▼'} {Math.abs(hoveredMatch.awayElo?.rating_change ?? 0).toFixed(1)}
    </div>
  </div>
</div>
        </div>
      )}
    </div>
  );
}