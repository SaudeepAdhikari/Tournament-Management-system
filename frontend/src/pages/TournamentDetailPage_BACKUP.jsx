import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '../components/Toast';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmModal from '../components/ConfirmModal';

export default function TournamentDetailPage() {
    const { tournamentId } = useParams();
    const navigate = useNavigate();
    const toast = useToast();

    const [tournament, setTournament] = useState(null);
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newTeamName, setNewTeamName] = useState('');
    const [bracket, setBracket] = useState(null);
    const [showBracket, setShowBracket] = useState(false);
    const [confirmModal, setConfirmModal] = useState({ isOpen: false });

    useEffect(() => {
        loadTournament();
    }, [tournamentId]);

    function loadTournament() {
        try {
            setLoading(true);
            const stored = localStorage.getItem('tournaments');
            if (stored) {
                const tournaments = JSON.parse(stored);
                const found = tournaments.find(t => t.id === tournamentId);
                if (found) {
                    setTournament(found);

                    const storedTeams = localStorage.getItem(`tournament_${tournamentId}_teams`);
                    if (storedTeams) {
                        setTeams(JSON.parse(storedTeams));
                    }

                    const storedBracket = localStorage.getItem(`tournament_${tournamentId}_bracket`);
                    if (storedBracket) {
                        setBracket(JSON.parse(storedBracket));
                        setShowBracket(true);
                    }
                } else {
                    toast.error('Tournament not found');
                    navigate('/dashboard');
                }
            }
        } catch (error) {
            console.error('Error loading tournament:', error);
            toast.error('Failed to load tournament');
        } finally {
            setLoading(false);
        }
    }

    function handleAddTeam(e) {
        e.preventDefault();

        const teamName = newTeamName.trim();

        if (!teamName) {
            toast.error('Team name is required');
            return;
        }

        if (teamName.length < 2 || teamName.length > 50) {
            toast.error('Team name must be between 2 and 50 characters');
            return;
        }

        if (teams.some(t => t.name.toLowerCase() === teamName.toLowerCase())) {
            toast.error('Team name already exists');
            return;
        }

        if (teams.length >= tournament.teamCount) {
            toast.error(`Maximum ${tournament.teamCount} teams allowed`);
            return;
        }

        const newTeam = {
            id: Date.now().toString(),
            name: teamName,
            tournamentId: tournamentId,
            addedAt: new Date().toISOString()
        };

        const updatedTeams = [...teams, newTeam];
        setTeams(updatedTeams);
        localStorage.setItem(`tournament_${tournamentId}_teams`, JSON.stringify(updatedTeams));

        toast.success(`${teamName} added successfully!`);
        setNewTeamName('');
        setShowAddForm(false);
    }

    function handleRemoveTeam(teamId) {
        if (!window.confirm('Are you sure you want to remove this team?')) {
            return;
        }

        const updatedTeams = teams.filter(t => t.id !== teamId);
        setTeams(updatedTeams);
        localStorage.setItem(`tournament_${tournamentId}_teams`, JSON.stringify(updatedTeams));
        toast.success('Team removed');
    }

    function generateBracket() {
        if (teams.length < 2) {
            toast.error('At least 2 teams required');
            return;
        }

        // Shuffle teams
        const shuffled = [...teams].sort(() => Math.random() - 0.5);

        // Create initial round matches
        const matches = [];
        for (let i = 0; i < shuffled.length; i += 2) {
            if (i + 1 < shuffled.length) {
                matches.push({
                    id: `match-${Date.now()}-${i}`,
                    team1: shuffled[i],
                    team2: shuffled[i + 1],
                    winner: null,
                    round: 1
                });
            } else {
                // Bye - team advances automatically
                matches.push({
                    id: `match-bye-${Date.now()}`,
                    team1: shuffled[i],
                    team2: null,
                    winner: shuffled[i],
                    round: 1,
                    isBye: true
                });
            }
        }

        const newBracket = {
            rounds: [matches],
            currentRound: 1,
            totalRounds: Math.ceil(Math.log2(teams.length)),
            champion: null
        };

        setBracket(newBracket);
        setShowBracket(true);
        localStorage.setItem(`tournament_${tournamentId}_bracket`, JSON.stringify(newBracket));
        toast.success('Bracket generated!');
    }

    function selectWinner(matchId, winner) {
        const updatedBracket = { ...bracket };
        const currentRoundMatches = updatedBracket.rounds[bracket.currentRound - 1];

        // Update winner in current match
        const match = currentRoundMatches.find(m => m.id === matchId);
        if (!match) return;

        match.winner = winner;

        // Check if all matches in current round are complete
        const allComplete = currentRoundMatches.every(m => m.winner !== null);

        if (allComplete) {
            // Get all winners
            const winners = currentRoundMatches.map(m => m.winner);

            // Check if we have a champion
            if (winners.length === 1) {
                updatedBracket.champion = winners[0];
                toast.success(`🏆 ${winners[0].name} is the champion!`);
            } else {
                // Create next round
                const nextRoundMatches = [];
                for (let i = 0; i < winners.length; i += 2) {
                    if (i + 1 < winners.length) {
                        nextRoundMatches.push({
                            id: `match-r${bracket.currentRound + 1}-${Date.now()}-${i}`,
                            team1: winners[i],
                            team2: winners[i + 1],
                            winner: null,
                            round: bracket.currentRound + 1
                        });
                    } else {
                        // Bye
                        nextRoundMatches.push({
                            id: `match-bye-r${bracket.currentRound + 1}-${Date.now()}`,
                            team1: winners[i],
                            team2: null,
                            winner: winners[i],
                            round: bracket.currentRound + 1,
                            isBye: true
                        });
                    }
                }

                updatedBracket.rounds.push(nextRoundMatches);
                updatedBracket.currentRound += 1;
                toast.success(`Round ${updatedBracket.currentRound} started!`);
            }
        }

        setBracket(updatedBracket);
        localStorage.setItem(`tournament_${tournamentId}_bracket`, JSON.stringify(updatedBracket));
    }

    function confirmReset() {
        setBracket(null);
        setShowBracket(false);
        localStorage.removeItem(`tournament_${tournamentId}_bracket`);
        setConfirmModal({ isOpen: false });
        toast.success('Tie sheet reset');
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-dark">
                <LoadingSpinner size="lg" text="Loading tournament..." />
            </div>
        );
    }

    if (!tournament) return null;

    const spotsRemaining = tournament.teamCount - teams.length;
    const canAddMore = teams.length < tournament.teamCount;

    return (
        <div className="min-h-screen bg-gradient-dark p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="glass-card p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <button onClick={() => navigate('/dashboard')} className="btn-ghost mb-2">
                                ← Back
                            </button>
                            <h1 className="text-4xl font-bold text-gradient">{tournament.name}</h1>
                            <p className="text-slate-400 mt-2">
                                📅 {tournament.date} • 📍 {tournament.location}
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-4xl font-black text-gradient">{teams.length}/{tournament.teamCount}</div>
                            <div className="text-xs text-slate-400">Teams</div>
                        </div>
                    </div>

                    {!showBracket && (
                        <div className="mt-4">
                            <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all"
                                    style={{ width: `${(teams.length / tournament.teamCount) * 100}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {!showBracket ? (
                    /* Team Management View */
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 glass-card p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-white">Teams</h2>
                                {canAddMore && !showAddForm && (
                                    <button onClick={() => setShowAddForm(true)} className="btn-primary">
                                        + Add Team
                                    </button>
                                )}
                            </div>

                            {showAddForm && (
                                <form onSubmit={handleAddTeam} className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
                                    <div className="flex gap-3">
                                        <input
                                            type="text"
                                            value={newTeamName}
                                            onChange={(e) => setNewTeamName(e.target.value)}
                                            placeholder="Team name..."
                                            className="flex-1 input-glass"
                                            autoFocus
                                        />
                                        <button type="submit" className="btn-primary">Add</button>
                                        <button type="button" onClick={() => { setShowAddForm(false); setNewTeamName(''); }} className="btn-ghost">
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            )}

                            {teams.length === 0 ? (
                                <div className="text-center py-16">
                                    <div className="text-6xl mb-4">👥</div>
                                    <h3 className="text-xl font-semibold text-white mb-2">No teams yet</h3>
                                    <button onClick={() => setShowAddForm(true)} className="btn-primary mt-4">
                                        Add First Team
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar">
                                    {teams.map((team, index) => (
                                        <div key={team.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white font-bold flex items-center justify-center">
                                                    {index + 1}
                                                </div>
                                                <p className="text-white font-semibold text-lg">{team.name}</p>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveTeam(team.id)}
                                                className="opacity-0 group-hover:opacity-100 px-4 py-2 rounded-lg bg-red-500/10 text-red-300 hover:bg-red-500/20"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="glass-card p-6">
                            <h3 className="text-lg font-bold text-white mb-4">Actions</h3>
                            <div className="space-y-3">
                                <button
                                    onClick={generateBracket}
                                    disabled={teams.length < 2}
                                    className="btn-primary w-full disabled:opacity-50"
                                >
                                    📋 Create Tie Sheet
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Bracket View */
                    <div className="glass-card p-8">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-bold text-gradient">Tournament Tie Sheet</h2>
                            <div className="flex gap-3">
                                <button onClick={() => setShowBracket(false)} className="btn-ghost">
                                    ← Back to Teams
                                </button>
                                <button
                                    onClick={() => window.print()}
                                    className="btn-primary"
                                >
                                    📥 Download Tiesheet
                                </button>
                                <button
                                    onClick={() => {
                                        setConfirmModal({
                                            isOpen: true,
                                            title: 'Reset Tie Sheet?',
                                            message: 'This will delete all match results and you will need to create a new tie sheet. This action cannot be undone.',
                                            type: 'warning'
                                        });
                                    }}
                                    className="btn-secondary"
                                >
                                    🔄 Reset
                                </button>
                            </div>
                        </div>

                        {bracket.champion ? (
                            <div className="text-center py-16">
                                <div className="text-8xl mb-6 animate-pulse-glow">🏆</div>
                                <h2 className="text-5xl font-black text-gradient mb-4">CHAMPION</h2>
                                <p className="text-4xl font-bold text-white">{bracket.champion.name}</p>
                            </div>
                        ) : (
                            <div className="space-y-12">
                                {bracket.rounds.map((roundMatches, roundIndex) => (
                                    <div key={roundIndex}>
                                        <div className="flex items-center gap-3 mb-6">
                                            <h3 className="text-2xl font-bold text-white">
                                                {roundIndex === bracket.totalRounds - 1 ? 'FINAL' :
                                                    roundIndex === bracket.totalRounds - 2 ? 'SEMI FINALS' :
                                                        roundIndex === bracket.totalRounds - 3 ? 'QUARTER FINALS' :
                                                            `Round ${roundIndex + 1}`}
                                            </h3>
                                            {roundIndex + 1 === bracket.currentRound && (
                                                <span className="badge badge-success animate-pulse">Current</span>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {roundMatches.map((match) => (
                                                <div key={match.id} className="glass-card p-6 border-2 border-white/10">
                                                    {match.isBye ? (
                                                        <div className="text-center py-4">
                                                            <p className="text-white font-semibold text-lg">{match.team1.name}</p>
                                                            <span className="badge badge-warning mt-2">BYE - Auto Advance</span>
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-4">
                                                            {/* Team 1 */}
                                                            <div
                                                                onClick={() => !match.winner && selectWinner(match.id, match.team1)}
                                                                className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all ${match.winner?.id === match.team1.id
                                                                    ? 'bg-green-500/20 border-2 border-green-500'
                                                                    : 'bg-white/5 hover:bg-white/10 border-2 border-white/10'
                                                                    }`}
                                                            >
                                                                <span className="text-white font-semibold">{match.team1.name}</span>
                                                                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${match.winner?.id === match.team1.id
                                                                    ? 'bg-green-500 border-green-500'
                                                                    : 'border-white/30'
                                                                    }`}>
                                                                    {match.winner?.id === match.team1.id && <span className="text-white text-xl">✓</span>}
                                                                </div>
                                                            </div>

                                                            <div className="text-center text-slate-500 font-bold">VS</div>

                                                            {/* Team 2 */}
                                                            <div
                                                                onClick={() => !match.winner && selectWinner(match.id, match.team2)}
                                                                className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all ${match.winner?.id === match.team2.id
                                                                    ? 'bg-green-500/20 border-2 border-green-500'
                                                                    : 'bg-white/5 hover:bg-white/10 border-2 border-white/10'
                                                                    }`}
                                                            >
                                                                <span className="text-white font-semibold">{match.team2.name}</span>
                                                                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${match.winner?.id === match.team2.id
                                                                    ? 'bg-green-500 border-green-500'
                                                                    : 'border-white/30'
                                                                    }`}>
                                                                    {match.winner?.id === match.team2.id && <span className="text-white text-xl">✓</span>}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ isOpen: false })}
                onConfirm={confirmReset}
                title={confirmModal.title}
                message={confirmModal.message}
                type={confirmModal.type}
                confirmText="Reset"
            />
        </div>
    );
}
