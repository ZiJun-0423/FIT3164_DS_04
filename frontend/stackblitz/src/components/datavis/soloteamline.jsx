import React, { useMemo } from 'react';
import Plot from 'react-plotly.js';
import { useDynamicEloQuery } from '../../services/api_hooks';

export default function SoloTeamEloChart({ team_id, settings }) {
    console.log('settings', JSON.stringify(settings));
    const { data, isLoading, error } = useDynamicEloQuery(settings);

    const teamData = useMemo(() => {
        if (!data) return [];
        
        // Ensure team_id is compared as a number
        return data.filter((d) => Number(d.team_id) === Number(team_id));
      }, [data, team_id]);
      
      const dates = teamData.map((d) => new Date(d.date)); // safely converts to JS Date objects
      const elos = teamData.map((d) => d.rating_after);    // use `rating_after` instead of `elo`
    console.log('Raw data:', data);
    console.log('Filtered data:', teamData);

    if (isLoading) return <p>Loading Elo ratings...</p>;
    if (error) return <p>Error: {error.message}</p>;
    
    if (!dates.length || !elos.length) {
      return <p>No data available to display</p>;
    }
    
    return (
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
      />
    );
}