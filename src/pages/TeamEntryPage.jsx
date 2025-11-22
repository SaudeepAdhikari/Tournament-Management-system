import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TeamInputRow from '../components/TeamInputRow';

// TeamEntryPage: dynamic list of team inputs (8-16) and Generate Bracket
export default function TeamEntryPage() {
  const navigate = useNavigate();
  const MIN = 4;
  const MAX = 32;

  // initialize with MIN empty names
  const [teams, setTeams] = useState(() => Array.from({ length: MIN }, () => ''));

  function setTeamName(idx, name) {
    setTeams(prev => {
      const copy = [...prev];
      copy[idx] = name;
      return copy;
    });
  }

  function addRow() {
    setTeams(prev => (prev.length < MAX ? [...prev, ''] : prev));
  }

  function removeRow(idx) {
    setTeams(prev => {
      if (prev.length <= MIN) return prev;
      const copy = [...prev];
      copy.splice(idx, 1);
      return copy;
    });
  }

  function handleGenerate() {
    // filter out empty names
    const filtered = teams.map(t => t.trim()).filter(Boolean);

    // Validation
    if (filtered.length < 2) {
      alert('Please enter at least 2 team names.');
      return;
    }

    if (filtered.length > 32) {
      alert('Maximum 32 teams allowed.');
      return;
    }

    // Check for duplicate team names
    const uniqueTeams = new Set(filtered);
    if (uniqueTeams.size !== filtered.length) {
      alert('Duplicate team names found. Please ensure all team names are unique.');
      return;
    }

    // Validate team name length
    const invalidTeams = filtered.filter(t => t.length < 2 || t.length > 50);
    if (invalidTeams.length > 0) {
      alert('Team names must be between 2 and 50 characters.');
      return;
    }

    // save to localStorage as fallback
    try { localStorage.setItem('tournament_teams', JSON.stringify(filtered)); } catch (e) { }

    // navigate to bracket with state
    navigate('/bracket', { state: { teams: filtered } });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-dark p-6">
      <div className="w-full max-w-4xl animate-slide-in-up">
        {/* Header Card */}
        <div className="glass-card p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Team Registration</h2>
              <p className="text-slate-300">Add between <span className="text-indigo-400 font-semibold">{MIN}</span> and <span className="text-indigo-400 font-semibold">{MAX}</span> teams to your tournament</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-gradient">{teams.filter(t => t.trim()).length}</div>
              <div className="text-xs text-slate-400">Teams Added</div>
            </div>
          </div>
        </div>

        {/* Teams List */}
        <div className="glass-card p-6 mb-6 max-h-[500px] overflow-y-auto custom-scrollbar">
          <div className="space-y-3">
            {teams.map((t, idx) => (
              <div key={idx} className="animate-fade-in" style={{ animationDelay: `${idx * 0.05}s` }}>
                <TeamInputRow
                  idx={idx}
                  value={t}
                  onChange={setTeamName}
                  onRemove={removeRow}
                  canRemove={teams.length > MIN}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3">
            <button
              onClick={addRow}
              className="btn-secondary flex-1"
              disabled={teams.length >= MAX}
            >
              <span className="flex items-center justify-center gap-2">
                ➕ Add Team
                {teams.length >= MAX && <span className="text-xs">(Max reached)</span>}
              </span>
            </button>

            <button
              onClick={handleGenerate}
              className="btn-primary flex-1"
            >
              <span className="flex items-center justify-center gap-2">
                🏆 Generate Bracket
              </span>
            </button>
          </div>

          <div className="mt-4 flex items-center justify-center gap-4 text-xs text-slate-400">
            <span>✓ Duplicate detection</span>
            <span>✓ Auto-validation</span>
            <span>✓ Smart seeding</span>
          </div>
        </div>
      </div>
    </div>
  );
}
