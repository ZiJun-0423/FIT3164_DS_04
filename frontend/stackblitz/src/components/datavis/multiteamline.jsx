import React, { useMemo, useState, useRef } from 'react';
import Plot from 'react-plotly.js';
import { useDynamicEloQuery, useEnrichedMatches, useTeamsWithLogos } from '../../services/api_hooks';

export default function MultiTeamEloChart({ settings }) {
  const { data: allEloData, eloLoading, eloError } = useDynamicEloQuery(settings);
  const { enrichedMatches, matchLoading, matchError } = useEnrichedMatches();
  const { teamsWithLogos, teamsLoading, teamsError } = useTeamsWithLogos();
  const [hoveredMatch, setHoveredMatch] = useState(null);
  const [hoverSource, setHoverSource] = useState(null);
  const chartRef = useRef();

  console.log('hovered data:', hoveredMatch);

  const enrichedMatchesWithElo = useMemo(() => {
    if (!enrichedMatches || !allEloData) return [];
    return enrichedMatches
      .filter(match => {
        const year = new Date(match.date).getFullYear();
        return year >= settings.start_season && year <= settings.end_season;
      })
    
    // Ensure team_id is compared as a number
    .map((match) => {
      return {
        ...match,
        homeElo: allEloData.find((elo) => Number(elo.match_id) === Number(match.match_id) && Number(elo.team_id) === Number(match.team1_id)),
        awayElo: allEloData.find((elo) => Number(elo.match_id) === Number(match.match_id) && Number(elo.team_id) === Number(match.team2_id)),
      };
    });
  }, [enrichedMatches, allEloData]);

  const groupedData = useMemo(() => {
    if (!allEloData) return {};
    return allEloData
      .filter(d => {
        const year = new Date(d.date).getFullYear();
        return (
          year >= settings.start_season &&
          year <= settings.end_season
        );
      })
      .reduce((acc, d) => {
        const team_id = Number(d.team_id);
        if (!acc[team_id]) acc[team_id] = [];
        acc[team_id].push(d);
        return acc;
      }, {});
  }, [allEloData, settings.start_season, settings.end_season]);

  const traces = useMemo(() => {
    return Object.entries(groupedData).map(([team_id, entries]) => {
      const sorted = entries.sort((a, b) => new Date(a.date) - new Date(b.date));
      return {
        x: sorted.map(d => new Date(d.date)),
        y: sorted.map(d => d.rating_after),
        customdata: sorted.map(d => d.match_id),
        type: 'scatter',
        mode: 'lines',
        name: teamsWithLogos.find(team => team.id === Number(team_id))?.name,
        line: { shape: 'spline' },
        hoverinfo: 'x+y+name',
      };
    });
  }, [groupedData, teamsWithLogos]);
  console.log('traces:', traces);


  if (eloLoading || matchLoading) return <p>Loading data...</p>;
  if (matchError) return <p>Error: {matchError.message}</p>;
  if (eloError) return <p>Error: {matchError.message}</p>;
  
  if (traces.length === 0) return <p>No ELO data available</p>;
  
  return (
    <div
      ref={chartRef}
      style={{ position: 'relative', width: '100%', height: '100%' }}
    >
      <Plot
        data={traces}
        layout={{
          title: 'ELO Ratings Over Time (All Teams)',
          xaxis: {
            title: 'Date',
            type: 'date',
            tickformat: '%b %d, %Y',
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
        useResizeHandler={true}
        style={{ width: '100%', height: '100%' }}
        onHover={(event) => {
          const matchId = event.points?.[0]?.customdata;
          const match = enrichedMatchesWithElo.find(m => m.match_id === matchId);

          const chartBounds = chartRef.current.getBoundingClientRect();
          const cursorX = event.event.clientX;
          const relativeX = cursorX - chartBounds.left;
          const side = relativeX < chartBounds.width / 2 ? 'left' : 'right';

          if (hoveredMatch?.match_id !== match?.match_id || hoverSource !== side) {
            setHoveredMatch(match);
            setHoverSource(side);
          }
        }}
        onUnhover={() => {
          setHoveredMatch(null);
          setHoverSource(null);
        }}
      />

      {hoveredMatch && (
        <div
          className="match-card"
          style={{
            pointerEvents: 'none', 
            position: 'absolute',
            top: 20,
            zIndex: 1000,
            background: '#222',
            color: '#fff',
            padding: '1rem',
            borderRadius: '10px',
            boxShadow: '0 0 10px rgba(0,0,0,0.5)',
            maxWidth: '300px',
            ...(hoverSource === 'left' ? { right: 20 } : { left: 20 }),
          }}
        >
          <h4>
            {new Date(hoveredMatch.dateObj).toLocaleString('en-AU', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            })}
          </h4>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
            {/* Home Team */}
            <div style={{ textAlign: 'center' }}>
              <img src={hoveredMatch.home.logo} alt={hoveredMatch.home.name} height={40} width={40} />
              <div>{hoveredMatch.home.name}</div>
              <div>Score: {hoveredMatch.team1_score}</div>
              <div>ELO: {hoveredMatch.homeElo?.rating_after ?? 'N/A'}</div>
              <div style={{ color: hoveredMatch.homeElo?.rating_change > 0 ? 'green' : 'red' }}>
                {hoveredMatch.homeElo?.rating_change > 0 ? '▲' : '▼'}{' '}
                {Math.abs(hoveredMatch.homeElo?.rating_change ?? 0).toFixed(1)}
              </div>
            </div>

            <strong style={{ alignSelf: 'center' }}>vs</strong>

            {/* Away Team */}
            <div style={{ textAlign: 'center' }}>
              <img src={hoveredMatch.away.logo} alt={hoveredMatch.away.name} height={40} width={40} />
              <div>{hoveredMatch.away.name}</div>
              <div>Score: {hoveredMatch.team2_score}</div>
              <div>ELO: {hoveredMatch.awayElo?.rating_after ?? 'N/A'}</div>
              <div style={{ color: hoveredMatch.awayElo?.rating_change > 0 ? 'green' : 'red' }}>
                {hoveredMatch.awayElo?.rating_change > 0 ? '▲' : '▼'}{' '}
                {Math.abs(hoveredMatch.awayElo?.rating_change ?? 0).toFixed(1)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}