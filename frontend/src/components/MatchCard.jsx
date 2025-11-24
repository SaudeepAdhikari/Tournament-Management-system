import React from 'react';

// MatchCard: displays two teams and allows selecting winner
export default function MatchCard({ matchId, teamA, teamB, winner, onSelectWinner }) {
  return (
    <div className="glass-card-hover p-4 card-hover">
      <div className="flex flex-col gap-2">
        <div
          onClick={() => teamA && onSelectWinner(matchId, teamA)}
          className={`p-3 rounded-xl cursor-pointer transition-all duration-200 ${winner === teamA
              ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-500/40 font-bold text-white shadow-lg'
              : teamA
                ? 'hover:bg-white/10 border border-white/10'
                : 'bg-white/5 border border-white/5 text-slate-500 cursor-not-allowed'
            }`}
        >
          <div className="flex items-center justify-between">
            <span>{teamA || 'TBD'}</span>
            {winner === teamA && <span className="text-green-400">✓</span>}
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="text-xs text-slate-500 font-semibold">VS</div>
        </div>

        <div
          onClick={() => teamB && onSelectWinner(matchId, teamB)}
          className={`p-3 rounded-xl cursor-pointer transition-all duration-200 ${winner === teamB
              ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-500/40 font-bold text-white shadow-lg'
              : teamB
                ? 'hover:bg-white/10 border border-white/10'
                : 'bg-white/5 border border-white/5 text-slate-500 cursor-not-allowed'
            }`}
        >
          <div className="flex items-center justify-between">
            <span>{teamB || 'TBD'}</span>
            {winner === teamB && <span className="text-green-400">✓</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
