import React, { useState, useEffect } from 'react';

/**
 * TournamentStats Component
 * Displays comprehensive tournament statistics and leaderboards
 */
export default function TournamentStats({ tournament, teams, matches, players }) {
    const [activeTab, setActiveTab] = useState('overview');

    // Calculate statistics
    const stats = calculateStats(teams, matches, players);

    return (
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-6">Tournament Statistics</h2>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-white/10">
                {['overview', 'scorers', 'teams', 'discipline'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 font-medium transition ${activeTab === tab
                                ? 'text-white border-b-2 border-indigo-500'
                                : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && <OverviewTab stats={stats} />}
            {activeTab === 'scorers' && <ScorersTab players={stats.topScorers} />}
            {activeTab === 'teams' && <TeamsTab teams={stats.teamStats} />}
            {activeTab === 'discipline' && <DisciplineTab players={stats.disciplineRecords} />}
        </div>
    );
}

// Overview Tab
function OverviewTab({ stats }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Total Matches" value={stats.totalMatches} icon="⚽" color="text-indigo-400" />
            <StatCard label="Total Goals" value={stats.totalGoals} icon="🥅" color="text-green-400" />
            <StatCard label="Avg Goals/Match" value={stats.avgGoalsPerMatch} icon="📊" color="text-blue-400" />
            <StatCard label="Yellow Cards" value={stats.totalYellowCards} icon="🟨" color="text-yellow-400" />
        </div>
    );
}

// Top Scorers Tab
function ScorersTab({ players }) {
    return (
        <div className="space-y-2">
            {players.length === 0 ? (
                <p className="text-center text-slate-400 py-8">No goals scored yet</p>
            ) : (
                players.map((player, index) => (
                    <div
                        key={player.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${index === 0 ? 'bg-yellow-600 text-white' :
                                    index === 1 ? 'bg-slate-400 text-white' :
                                        index === 2 ? 'bg-orange-600 text-white' :
                                            'bg-slate-700 text-slate-300'
                                }`}>
                                {index + 1}
                            </div>
                            <div>
                                <p className="text-white font-medium">{player.name}</p>
                                <p className="text-sm text-slate-400">{player.teamName} • #{player.number}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-green-400">{player.stats.goals}</p>
                            <p className="text-xs text-slate-400">goals</p>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

// Teams Tab
function TeamsTab({ teams }) {
    return (
        <div className="space-y-2">
            {teams.map((team, index) => (
                <div
                    key={team.id}
                    className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition"
                >
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="text-white font-bold">{team.name}</h4>
                        <span className="text-sm text-slate-400">Rank #{index + 1}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-3 text-center">
                        <div>
                            <p className="text-xl font-bold text-green-400">{team.stats.wins}</p>
                            <p className="text-xs text-slate-400">Wins</p>
                        </div>
                        <div>
                            <p className="text-xl font-bold text-red-400">{team.stats.losses}</p>
                            <p className="text-xs text-slate-400">Losses</p>
                        </div>
                        <div>
                            <p className="text-xl font-bold text-blue-400">{team.stats.goalsFor}</p>
                            <p className="text-xs text-slate-400">Goals For</p>
                        </div>
                        <div>
                            <p className="text-xl font-bold text-orange-400">{team.stats.goalsAgainst}</p>
                            <p className="text-xs text-slate-400">Goals Against</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

// Discipline Tab
function DisciplineTab({ players }) {
    const playersWithCards = players.filter(p =>
        (p.stats.yellowCards > 0 || p.stats.redCards > 0)
    );

    return (
        <div className="space-y-2">
            {playersWithCards.length === 0 ? (
                <p className="text-center text-slate-400 py-8">No cards issued yet</p>
            ) : (
                playersWithCards.map(player => (
                    <div
                        key={player.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-white/5"
                    >
                        <div>
                            <p className="text-white font-medium">{player.name}</p>
                            <p className="text-sm text-slate-400">{player.teamName}</p>
                        </div>
                        <div className="flex gap-4">
                            {player.stats.yellowCards > 0 && (
                                <div className="flex items-center gap-1">
                                    <span className="text-yellow-400">🟨</span>
                                    <span className="text-white font-bold">{player.stats.yellowCards}</span>
                                </div>
                            )}
                            {player.stats.redCards > 0 && (
                                <div className="flex items-center gap-1">
                                    <span className="text-red-400">🟥</span>
                                    <span className="text-white font-bold">{player.stats.redCards}</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

// Stat Card Component
function StatCard({ label, value, icon, color }) {
    return (
        <div className="p-4 rounded-lg bg-white/5 text-center">
            <div className="text-3xl mb-2">{icon}</div>
            <div className={`text-3xl font-bold ${color}`}>{value}</div>
            <div className="text-sm text-slate-400 mt-1">{label}</div>
        </div>
    );
}

// Calculate all statistics
function calculateStats(teams, matches, players) {
    const completedMatches = matches.filter(m => m.status === 'completed');

    const totalGoals = completedMatches.reduce((sum, m) =>
        sum + (m.scoreA || 0) + (m.scoreB || 0), 0
    );

    const topScorers = players
        .filter(p => p.stats?.goals > 0)
        .sort((a, b) => (b.stats.goals - a.stats.goals))
        .slice(0, 10);

    const teamStats = teams.map(team => ({
        ...team,
        stats: {
            wins: matches.filter(m => m.winner === team.name).length,
            losses: matches.filter(m =>
                (m.teamA === team.name || m.teamB === team.name) &&
                m.winner && m.winner !== team.name
            ).length,
            goalsFor: matches.reduce((sum, m) => {
                if (m.teamA === team.name) return sum + (m.scoreA || 0);
                if (m.teamB === team.name) return sum + (m.scoreB || 0);
                return sum;
            }, 0),
            goalsAgainst: matches.reduce((sum, m) => {
                if (m.teamA === team.name) return sum + (m.scoreB || 0);
                if (m.teamB === team.name) return sum + (m.scoreA || 0);
                return sum;
            }, 0)
        }
    })).sort((a, b) => b.stats.wins - a.stats.wins);

    const disciplineRecords = players
        .filter(p => (p.stats?.yellowCards > 0 || p.stats?.redCards > 0))
        .sort((a, b) =>
            (b.stats.yellowCards + b.stats.redCards * 2) -
            (a.stats.yellowCards + a.stats.redCards * 2)
        );

    const totalYellowCards = players.reduce((sum, p) => sum + (p.stats?.yellowCards || 0), 0);
    const totalRedCards = players.reduce((sum, p) => sum + (p.stats?.redCards || 0), 0);

    return {
        totalMatches: completedMatches.length,
        totalGoals,
        avgGoalsPerMatch: completedMatches.length > 0
            ? (totalGoals / completedMatches.length).toFixed(1)
            : 0,
        totalYellowCards,
        totalRedCards,
        topScorers,
        teamStats,
        disciplineRecords
    };
}
