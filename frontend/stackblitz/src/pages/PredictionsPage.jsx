import { useState } from 'react';
import './PredictionsPage.css';

export default function PredictionsPage() {
  const [teamA, setTeamA] = useState(null);
  const [teamB, setTeamB] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTeamSlot, setSelectedTeamSlot] = useState('');

  const teams = [
    { id: 1, name: 'Collingwood', logo: '/frontend/stackblitz/teamLogo/collingwood.png' },
    { id: 2, name: 'Richmond', logo: '/frontend/stackblitz/teamLogo/richmondTigers.png' },
    { id: 3, name: 'Geelong', logo: '/frontend/stackblitz/teamLogo/geelongCats.png' },
    { id: 4, name: 'Brisbane Lions', logo: '/frontend/stackblitz/teamLogo/brisbaneLions.png' },
    { id: 5, name: 'Adelaide', logo: '/frontend/stackblitz/teamLogo/adelaideCrows.png' },
    { id: 6, name: 'West Coast Eagles', logo: '/frontend/stackblitz/teamLogo/westCoastEagles.png' },
    { id: 7, name: 'Carlton', logo: '/frontend/stackblitz/teamLogo/carlton.png' },
    { id: 8, name: 'Fremantle', logo: '/frontend/stackblitz/teamLogo/fremantle.png' },
    { id: 9, name: 'Essendon', logo: '/frontend/stackblitz/teamLogo/essendon.png' },
    { id: 10, name: 'Hawthorn Hawks', logo: '/frontend/stackblitz/teamLogo/hawthornHawks.png' },
    { id: 11, name: 'Gold Coast Suns', logo: '/frontend/stackblitz/teamLogo/goldCoastSuns.png' },
    { id: 12, name: 'Greater Western Sydney Giants', logo: '/frontend/stackblitz/teamLogo/greatWesternSydneyGiants.png' },
    { id: 13, name: 'Melbourne', logo: '/frontend/stackblitz/teamLogo/melbourne.png' },
    { id: 14, name: 'North Melbourne', logo: '/frontend/stackblitz/teamLogo/northMelbourne.png' },
    { id: 15, name: 'Port Adelaide', logo: '/frontend/stackblitz/teamLogo/portAdelaide.png' },
    { id: 16, name: 'St Kilda', logo: '/frontend/stackblitz/teamLogo/stKilda.png' },
    { id: 17, name: 'Sydney Swans', logo: '/frontend/stackblitz/teamLogo/sydneySwan.png' },
    { id: 18, name: 'Western Bulldogs', logo: '/frontend/stackblitz/teamLogo/westernBulldogs.jpg' },
  ];

  const openModal = (teamSlot) => {
    setSelectedTeamSlot(teamSlot);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleTeamSelect = (team) => {
    if (selectedTeamSlot === 'teamA') {
      setTeamA(team);
    } else if (selectedTeamSlot === 'teamB') {
      setTeamB(team);
    }
    closeModal();
  };

  const predict = () => {
    if (teamA && teamB && teamA !== teamB) {
      const probA = Math.floor(Math.random() * 50) + 25;
      const probB = 100 - probA;
      alert(`${teamA.name} has ${probA}% chance to win, ${teamB.name} has ${probB}% chance.`);
    }
  };

  return (
    <div className="predictions-page">
      <div className="content">
        <h1>Match Predictions</h1>

        <div className="button-container">
          <button className="select-team-button" onClick={() => openModal('teamA')}>
            {teamA ? <img src={teamA.logo} alt={teamA.name} className="team-logo" /> : 'Select Team A'}
          </button>
          <button className="select-team-button" onClick={() => openModal('teamB')}>
            {teamB ? <img src={teamB.logo} alt={teamB.name} className="team-logo" /> : 'Select Team B'}
          </button>
        </div>

        <button className="predict-button" onClick={predict}>
          Predict Match
        </button>

        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <h2>Select a Team</h2>
              <ul className="team-list">
                {teams.map((team) => (
                  <li key={team.id} onClick={() => handleTeamSelect(team)}>
                    <img src={team.logo} alt={team.name} className="team-logo" />
                    {team.name}
                  </li>
                ))}
              </ul>
              <div className="modal-footer">
                <button className="close-button" onClick={closeModal}>Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
