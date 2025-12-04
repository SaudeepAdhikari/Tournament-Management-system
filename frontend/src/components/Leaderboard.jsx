import React, { useState, useEffect } from 'react';

export default function Leaderboard({ tournamentId }) {
    const [topScorers, setTopScorers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const response = await fetch(`http://localhost:5000/api/stats/top-scorers?tournamentId=${tournamentId}`);
                const data = await response.json();
                setTopScorers(data);
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        }
        if (tournamentId) fetchStats();
    }, [tournamentId]);

    if (loading) return <div className="text-white">Loading stats...</div>;

    return (
        <div className="glass-card p-6">
            <h2 className="text-2xl font-bold text-gradient mb-6">🏆 Top Scorers</h2>
            <div className="space-y-4">
                {topScorers.map((player, index) => (
                    <div key={player._id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                        <div className="flex items-center gap-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${index === 0 ? 'bg-yellow-500 text-black' :
                                    index === 1 ? 'bg-slate-400 text-black' :
                                        index === 2 ? 'bg-orange-700 text-white' : 'bg-white/10 text-white'
                                }`}>
                                {index + 1}
                            </div>
                            <div>
                                <p className="text-white font-bold">{player.name}</p>
                                <p className="text-xs text-slate-400">{player.teamId?.name || 'Unknown Team'}</p>
                            </div>
                        </div>
                        <div className="text-xl font-black text-green-400">
                            {player.stats.goals} ⚽
                        </div>
                    </div>
                ))}
                {topScorers.length === 0 && (
                    <p className="text-slate-500 text-center">No goals recorded yet.</p>
                )}
            </div>
        </div>
    );
}
