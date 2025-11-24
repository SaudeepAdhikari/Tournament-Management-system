import React from 'react';

/**
 * PlayerStats Component
 * Displays detailed player statistics
 */
export default function PlayerStats({ player }) {
    const stats = player.stats || {
        goals: 0,
        assists: 0,
        yellowCards: 0,
        redCards: 0,
        minutesPlayed: 0
    };

    const statItems = [
        { label: 'Goals', value: stats.goals, icon: '⚽', color: 'text-green-400' },
        { label: 'Assists', value: stats.assists, icon: '🎯', color: 'text-blue-400' },
        { label: 'Yellow Cards', value: stats.yellowCards, icon: '🟨', color: 'text-yellow-400' },
        { label: 'Red Cards', value: stats.redCards, icon: '🟥', color: 'text-red-400' },
        { label: 'Minutes', value: stats.minutesPlayed, icon: '⏱️', color: 'text-slate-400' }
    ];

    return (
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                    {player.number}
                </div>
                <div>
                    <h4 className="text-white font-bold">{player.name}</h4>
                    <p className="text-sm text-slate-400">{player.position}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {statItems.map(stat => (
                    <div key={stat.label} className="text-center p-3 rounded-lg bg-white/5">
                        <div className="text-2xl mb-1">{stat.icon}</div>
                        <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                        <div className="text-xs text-slate-400 mt-1">{stat.label}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/**
 * TeamStats Component
 * Displays aggregated team statistics
 */
export function TeamStats({ players }) {
    const totalGoals = players.reduce((sum, p) => sum + (p.stats?.goals || 0), 0);
    const totalAssists = players.reduce((sum, p) => sum + (p.stats?.assists || 0), 0);
    const totalYellowCards = players.reduce((sum, p) => sum + (p.stats?.yellowCards || 0), 0);
    const totalRedCards = players.reduce((sum, p) => sum + (p.stats?.redCards || 0), 0);

    const topScorer = players.reduce((top, p) =>
        (p.stats?.goals || 0) > (top.stats?.goals || 0) ? p : top
        , players[0]);

    return (
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4">Team Statistics</h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 rounded-lg bg-white/5">
                    <div className="text-3xl font-bold text-green-400">{totalGoals}</div>
                    <div className="text-sm text-slate-400 mt-1">Total Goals</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-white/5">
                    <div className="text-3xl font-bold text-blue-400">{totalAssists}</div>
                    <div className="text-sm text-slate-400 mt-1">Total Assists</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-white/5">
                    <div className="text-3xl font-bold text-yellow-400">{totalYellowCards}</div>
                    <div className="text-sm text-slate-400 mt-1">Yellow Cards</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-white/5">
                    <div className="text-3xl font-bold text-red-400">{totalRedCards}</div>
                    <div className="text-sm text-slate-400 mt-1">Red Cards</div>
                </div>
            </div>

            {topScorer && topScorer.stats?.goals > 0 && (
                <div className="p-4 rounded-lg bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
                    <p className="text-sm text-slate-400 mb-1">Top Scorer</p>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-yellow-600 flex items-center justify-center text-white font-bold">
                            {topScorer.number}
                        </div>
                        <div>
                            <p className="text-white font-bold">{topScorer.name}</p>
                            <p className="text-sm text-yellow-300">{topScorer.stats.goals} goals</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
