import React from 'react';

export default function TeamSelectorModal({ teams, isOpen, onClose, onSelect, disabledTeam }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-[400px] max-h-[80vh] overflow-y-auto space-y-4 animate-fadeIn">
        <h2 className="text-xl font-bold mb-4 text-center">Select a Team</h2>

        {teams.map((team) => {
          const isDisabled = disabledTeam && team.id === disabledTeam.id;
          return (
            <button
              key={team.id}
              onClick={() => onSelect(team)}
              disabled={isDisabled}
              className={`flex items-center gap-3 w-full px-4 py-2 rounded-md border transition-all
                ${isDisabled
                  ? 'bg-gray-100 cursor-not-allowed opacity-50'
                  : 'hover:bg-gray-100'}
              `}
            >
              <img src={team.logo} alt={team.name} className="h-8 w-8 object-contain" />
              <span className="text-lg">{team.name}</span>
            </button>
          );
        })}

        <button
          onClick={onClose}
          className="w-full mt-4 py-2 bg-red-100 text-red-600 font-semibold rounded-xl hover:bg-red-200 transition"
        >
          ✖ Cancel
        </button>
      </div>
    </div>
  );
}
