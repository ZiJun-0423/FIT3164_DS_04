import React from 'react';
import './TeamTable.css'; // optional: for styling

export default function TeamTable({ teams }) {
  return (
    <div className="table-wrapper">
      <h2>Team Rankings</h2>
      <table className="team-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Club</th>
            <th>Points For</th>
            <th>Points Against</th>
            <th>Percentage (%)</th>
            <th>ELO Score</th>
            <th>Win Streak</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team, index) => (
            <tr key={team.team_id || team.name}>
              <td>{index + 1}</td>
              <td>
                <img
                  src={team.logo_path}
                  alt={`${team.name} logo`}
                  className="team-logo"
                  style={{ width: 24, height: 24, marginRight: 8 }}
                />
                {team.name}
              </td>
              <td>{team.points_for}</td>
              <td>{team.points_against}</td>
              <td>{team.percentage?.toFixed(2)}</td>
              <td>{team.elo_rating?.toFixed(1)}</td>
              <td>{team.win_streak} Wins</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
