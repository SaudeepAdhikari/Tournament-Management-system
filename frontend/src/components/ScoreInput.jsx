import React, { useState } from 'react';

/**
 * ScoreInput Component
 * Allows real-time score input for a match with validation
 */
export default function ScoreInput({
    matchId,
    teamA,
    teamB,
    initialScoreA = 0,
    initialScoreB = 0,
    onScoreUpdate,
    matchStatus = 'pending',
    disabled = false
}) {
    const [scoreA, setScoreA] = useState(initialScoreA);
    const [scoreB, setScoreB] = useState(initialScoreB);
    const [overtime, setOvertime] = useState(false);
    const [penalties, setPenalties] = useState(false);

    const handleScoreChange = (team, value) => {
        const numValue = Math.max(0, parseInt(value) || 0);

        if (team === 'A') {
            setScoreA(numValue);
        } else {
            setScoreB(numValue);
        }
    };

    const handleSave = () => {
        if (onScoreUpdate) {
            onScoreUpdate(matchId, scoreA, scoreB, { overtime, penalties });
        }
    };

    const handleReset = () => {
        setScoreA(initialScoreA);
        setScoreB(initialScoreB);
        setOvertime(false);
        setPenalties(false);
    };

    const isCompleted = matchStatus === 'completed';
    const winner = scoreA > scoreB ? teamA : scoreB > scoreA ? teamB : null;

    return (
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white/70">Match Score</h3>
                <span className={`text-xs px-2 py-1 rounded ${matchStatus === 'completed' ? 'bg-green-500/20 text-green-300' :
                        matchStatus === 'in-progress' ? 'bg-yellow-500/20 text-yellow-300' :
                            'bg-slate-500/20 text-slate-300'
                    }`}>
                    {matchStatus === 'completed' ? 'Completed' :
                        matchStatus === 'in-progress' ? 'In Progress' :
                            'Pending'}
                </span>
            </div>

            <div className="space-y-3">
                {/* Team A Score */}
                <div className="flex items-center gap-3">
                    <div className="flex-1 text-white font-medium truncate">
                        {teamA || 'TBD'}
                    </div>
                    <input
                        type="number"
                        min="0"
                        value={scoreA}
                        onChange={(e) => handleScoreChange('A', e.target.value)}
                        disabled={disabled || isCompleted}
                        className="w-20 px-3 py-2 rounded-md bg-white/10 border border-white/20 text-white text-center font-bold focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                </div>

                {/* Team B Score */}
                <div className="flex items-center gap-3">
                    <div className="flex-1 text-white font-medium truncate">
                        {teamB || 'TBD'}
                    </div>
                    <input
                        type="number"
                        min="0"
                        value={scoreB}
                        onChange={(e) => handleScoreChange('B', e.target.value)}
                        disabled={disabled || isCompleted}
                        className="w-20 px-3 py-2 rounded-md bg-white/10 border border-white/20 text-white text-center font-bold focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                </div>
            </div>

            {/* Match Options */}
            {!isCompleted && (
                <div className="mt-4 space-y-2">
                    <label className="flex items-center gap-2 text-sm text-white/70 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={overtime}
                            onChange={(e) => setOvertime(e.target.checked)}
                            disabled={disabled}
                            className="rounded border-white/20 bg-white/10 text-indigo-600 focus:ring-indigo-500"
                        />
                        Overtime
                    </label>
                    <label className="flex items-center gap-2 text-sm text-white/70 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={penalties}
                            onChange={(e) => setPenalties(e.target.checked)}
                            disabled={disabled}
                            className="rounded border-white/20 bg-white/10 text-indigo-600 focus:ring-indigo-500"
                        />
                        Penalties
                    </label>
                </div>
            )}

            {/* Winner Display */}
            {winner && (
                <div className="mt-3 p-2 rounded-md bg-green-500/10 border border-green-500/20">
                    <p className="text-sm text-green-300 text-center">
                        Winner: <span className="font-bold">{winner}</span>
                    </p>
                </div>
            )}

            {/* Action Buttons */}
            {!isCompleted && (
                <div className="mt-4 flex gap-2">
                    <button
                        onClick={handleSave}
                        disabled={disabled || !teamA || !teamB}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md font-medium transition"
                    >
                        Save Score
                    </button>
                    <button
                        onClick={handleReset}
                        disabled={disabled}
                        className="px-4 py-2 border border-white/20 hover:bg-white/5 text-white rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Reset
                    </button>
                </div>
            )}
        </div>
    );
}
