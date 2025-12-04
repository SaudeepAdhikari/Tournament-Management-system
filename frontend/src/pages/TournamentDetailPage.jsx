import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '../components/Toast';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmModal from '../components/ConfirmModal';
import BracketTree from '../components/BracketTree';
import PrintableTiesheet from '../components/PrintableTiesheet';
import Leaderboard from '../components/Leaderboard';
import MatchEventLogger from '../components/MatchEventLogger';
import PlayerManagerModal from '../components/PlayerManagerModal';
import { downloadBracketAsPDF } from '../utils/downloadBracket';

import { getTournament, getTeamsByTournament, createTeam, deleteTeam, createMatch, getMatchesByTournament, updateMatchScore, deleteMatchesByTournament } from '../backend/firebase/database';
import { useSocket } from '../context/SocketContext';

export default function TournamentDetailPage() {
    const { tournamentId } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const socket = useSocket();

    const [tournament, setTournament] = useState(null);
    const [teams, setTeams] = useState([]);
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newTeamName, setNewTeamName] = useState('');
    const [bracket, setBracket] = useState(null);
    const [showBracket, setShowBracket] = useState(false);
    const [activeTab, setActiveTab] = useState('matches'); // matches, stats
    const [selectedMatchId, setSelectedMatchId] = useState('');
    const [downloading, setDownloading] = useState(false);
    const [playerModal, setPlayerModal] = useState({ isOpen: false, team: null });
    const [confirmModal, setConfirmModal] = useState({ isOpen: false });

    const printableRef = useRef(null);

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);
                const tournamentData = await getTournament(tournamentId);
                setTournament(tournamentData);

                const teamsData = await getTeamsByTournament(tournamentId);
                setTeams(teamsData);

                // Load bracket from API
                const matchesData = await getMatchesByTournament(tournamentId);
                if (matchesData && matchesData.length > 0) {
                    setMatches(matchesData);
                    // Bracket will be updated by useEffect
                }
            } catch (error) {
                console.error('Error loading data:', error);
                toast.error('Failed to load tournament data');
                navigate('/dashboard');
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [tournamentId]); // eslint-disable-line react-hooks/exhaustive-deps

    // Update bracket when matches change
    useEffect(() => {
        if (matches.length > 0 && teams.length > 0) {
            const reconstructedBracket = reconstructBracketFromMatches(matches, teams.length);
            setBracket(reconstructedBracket);
            setShowBracket(true);
        }
    }, [matches, teams]);

    // Socket listener
    useEffect(() => {
        if (!socket) return;

        socket.on('matchUpdate', (updatedMatch) => {
            if (updatedMatch.tournamentId === tournamentId) {
                setMatches(prevMatches => {
                    const exists = prevMatches.find(m => m._id === updatedMatch._id);
                    if (exists) {
                        return prevMatches.map(m => m._id === updatedMatch._id ? updatedMatch : m);
                    } else {
                        return [...prevMatches, updatedMatch];
                    }
                });
            }
        });

        return () => {
            socket.off('matchUpdate');
        };
    }, [socket, tournamentId]);

    async function handleAddTeam(e) {
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

        try {
            const newTeam = await createTeam({
                name: teamName,
                tournamentId: tournamentId,
                status: 'registered'
            });

            setTeams([...teams, newTeam]);
            toast.success(`${teamName} added successfully!`);
            setNewTeamName('');
            setShowAddForm(false);
        } catch (error) {
            toast.error('Failed to add team');
        }
    }

    function handleRemoveTeam(teamId) {
        setConfirmModal({
            isOpen: true,
            action: 'removeTeam',
            data: teamId,
            title: 'Remove Team?',
            message: 'Are you sure you want to remove this team from the tournament?',
            type: 'danger'
        });
    }

    async function confirmRemoveTeam() {
        try {
            const teamId = confirmModal.data;
            await deleteTeam(teamId);
            setTeams(teams.filter(t => t._id !== teamId));
            setConfirmModal({ isOpen: false });
            toast.success('Team removed');
        } catch (error) {
            toast.error('Failed to remove team');
        }
    }

    async function generateBracket() {
        if (teams.length < 2) {
            toast.error('At least 2 teams required');
            return;
        }

        setLoading(true);
        try {
            // Delete old matches first
            await deleteMatchesByTournament(tournamentId);

            const shuffled = [...teams].sort(() => Math.random() - 0.5);
            const matches = [];
            let matchNumber = 1;

            for (let i = 0; i < shuffled.length; i += 2) {
                let matchData;
                if (i + 1 < shuffled.length) {
                    matchData = {
                        tournamentId,
                        round: 1,
                        matchNumber: matchNumber++,
                        team1: { id: shuffled[i]._id, name: shuffled[i].name },
                        team2: { id: shuffled[i + 1]._id, name: shuffled[i + 1].name },
                        winner: { id: null, name: null },
                        status: 'scheduled'
                    };
                } else {
                    // Bye
                    matchData = {
                        tournamentId,
                        round: 1,
                        matchNumber: matchNumber++,
                        team1: { id: shuffled[i]._id, name: shuffled[i].name },
                        team2: null,
                        winner: { id: shuffled[i]._id, name: shuffled[i].name }, // Auto win
                        status: 'completed',
                        isBye: true
                    };
                }

                // Save to backend
                const createdMatch = await createMatch(matchData);
                matches.push(createdMatch);
            }

            const newBracket = reconstructBracketFromMatches(matches, teams.length);
            setBracket(newBracket);
            setShowBracket(true);
            toast.success('Tie sheet created!');
        } catch (error) {
            console.error('Error creating bracket:', error);
            toast.error('Failed to create tie sheet');
        } finally {
            setLoading(false);
        }
    }

    function handleResetBracket() {
        setConfirmModal({
            isOpen: true,
            action: 'resetBracket',
            title: 'Reset Tie Sheet?',
            message: 'This will delete all match results and you will need to create a new tie sheet. This action cannot be undone.',
            type: 'warning'
        });
    }

    async function confirmReset() {
        try {
            // Delete all matches from database
            await deleteMatchesByTournament(tournamentId);

            // Clear local state
            setMatches([]);
            setBracket(null);
            setShowBracket(false);
            localStorage.removeItem(`tournament_${tournamentId}_bracket`);
            setConfirmModal({ isOpen: false });
            toast.success('Tie sheet reset');
        } catch (error) {
            console.error('Error resetting tie sheet:', error);
            toast.error('Failed to reset tie sheet');
        }
    }

    async function handleDownloadTiesheet() {
        if (!printableRef.current) {
            toast.error('Tiesheet not found');
            return;
        }

        try {
            setDownloading(true);
            toast.success('Generating tiesheet...');

            const filename = `${tournament.name.replace(/\s+/g, '_')}_Tiesheet.pdf`;
            await downloadBracketAsPDF(printableRef.current, filename);

            toast.success('Tiesheet downloaded!');
        } catch (error) {
            console.error('Error downloading tiesheet:', error);
            toast.error('Failed to download tiesheet');
        } finally {
            setDownloading(false);
        }
    }

    async function selectWinner(matchId, winner) {
        try {
            // 1. Update match winner in backend
            await updateMatchScore(matchId, {
                winner: winner,
                status: 'completed'
            });

            // 2. Check if round is complete to generate next round
            // We need current bracket state to know if round is complete
            const currentRoundMatches = bracket.rounds[bracket.currentRound - 1];
            const allComplete = currentRoundMatches.every(m =>
                (m._id === matchId ? true : m.winner && m.winner.id)
            );

            if (allComplete) {
                const winners = currentRoundMatches.map(m =>
                    m._id === matchId ? winner : m.winner
                );

                if (winners.length === 1) {
                    // Champion
                    toast.success(`🏆 ${winners[0].name} is the champion!`);
                } else {
                    // Generate next round matches
                    // But for simplicity let's just use timestamp based IDs or let backend handle ID if we had a counter.
                    // Here we will just create matches.

                    for (let i = 0; i < winners.length; i += 2) {
                        let matchData;
                        if (i + 1 < winners.length) {
                            matchData = {
                                tournamentId,
                                round: bracket.currentRound + 1,
                                matchNumber: Date.now() + i, // Temporary unique ID
                                team1: { id: winners[i].id, name: winners[i].name },
                                team2: { id: winners[i + 1].id, name: winners[i + 1].name },
                                winner: { id: null, name: null },
                                status: 'scheduled'
                            };
                        } else {
                            // Bye
                            matchData = {
                                tournamentId,
                                round: bracket.currentRound + 1,
                                matchNumber: Date.now() + i,
                                team1: { id: winners[i].id, name: winners[i].name },
                                team2: null,
                                winner: { id: winners[i].id, name: winners[i].name },
                                status: 'completed',
                                isBye: true
                            };
                        }
                        await createMatch(matchData);
                    }
                    toast.success(`Round ${bracket.currentRound + 1} started!`);
                }
            }
        } catch (error) {
            console.error('Error updating match:', error);
            toast.error('Failed to update match');
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-dark">
                <LoadingSpinner size="lg" text="Loading tournament..." />
            </div>
        );
    }

    if (!tournament) return null;

    const canAddMore = teams.length < tournament.teamCount;

    function reconstructBracketFromMatches(matches, teamCount) {
        const rounds = [];
        const totalRounds = Math.ceil(Math.log2(teamCount));

        // Group matches by round
        const matchesByRound = matches.reduce((acc, match) => {
            if (!acc[match.round]) acc[match.round] = [];
            acc[match.round].push(match);
            return acc;
        }, {});

        for (let i = 1; i <= totalRounds; i++) {
            if (matchesByRound[i]) {
                // Sort by matchNumber to ensure correct order
                rounds.push(matchesByRound[i].sort((a, b) => a.matchNumber - b.matchNumber));
            }
        }

        // Determine current round (last round with matches)
        const currentRound = rounds.length;

        // Check for champion
        let champion = null;
        const lastRoundMatches = rounds[rounds.length - 1];
        if (lastRoundMatches && lastRoundMatches.length === 1 && lastRoundMatches[0].winner && lastRoundMatches[0].winner.id) {
            champion = lastRoundMatches[0].winner;
        }

        return {
            rounds,
            currentRound,
            totalRounds,
            champion
        };
    }

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
                            <h1 className="text-4xl font-bold text-white">{tournament.name}</h1>
                            <p className="text-slate-400 mt-2">
                                📅 {tournament.date} • 📍 {tournament.location}
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-4xl font-black text-gradient">{teams.length}/{tournament.teamCount}</div>
                            <div className="text-xs text-slate-400">Teams</div>
                            {canAddMore && (
                                <button
                                    onClick={() => navigate(`/tournament/${tournamentId}/register`)}
                                    className="mt-2 text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-full transition"
                                >
                                    Register Team
                                </button>
                            )}
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

                    {/* Tabs */}
                    <div className="flex gap-4 mt-6 border-b border-white/10 pb-1">
                        <button
                            onClick={() => setActiveTab('matches')}
                            className={`px-4 py-2 font-bold transition-all ${activeTab === 'matches' ? 'text-white border-b-2 border-indigo-500' : 'text-slate-400 hover:text-white'}`}
                        >
                            Matches & Teams
                        </button>
                        <button
                            onClick={() => setActiveTab('stats')}
                            className={`px-4 py-2 font-bold transition-all ${activeTab === 'stats' ? 'text-white border-b-2 border-indigo-500' : 'text-slate-400 hover:text-white'}`}
                        >
                            Statistics
                        </button>
                    </div>
                </div>

                {activeTab === 'stats' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Leaderboard tournamentId={tournamentId} />
                        {/* Placeholder for other stats */}
                        <div className="glass-card p-6">
                            <h3 className="text-xl font-bold text-white mb-4">Fair Play</h3>
                            <p className="text-slate-400">Coming soon...</p>
                        </div>
                    </div>
                ) : (
                    !showBracket ? (
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
                                            <div key={team._id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 group">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white font-bold flex items-center justify-center">
                                                        {index + 1}
                                                    </div>
                                                    <p className="text-white font-semibold text-lg">{team.name}</p>
                                                </div>
                                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => setPlayerModal({ isOpen: true, team })}
                                                        className="px-4 py-2 rounded-lg bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20"
                                                    >
                                                        Manage Players
                                                    </button>
                                                    <button
                                                        onClick={() => handleRemoveTeam(team._id)}
                                                        className="px-4 py-2 rounded-lg bg-red-500/10 text-red-300 hover:bg-red-500/20"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
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
                                        onClick={handleDownloadTiesheet}
                                        disabled={downloading}
                                        className="btn-primary disabled:opacity-50"
                                    >
                                        {downloading ? '⏳ Generating...' : '📥 Download Tiesheet'}
                                    </button>
                                    <button onClick={handleResetBracket} className="btn-secondary">
                                        🔄 Reset
                                    </button>
                                </div>
                            </div>

                            {/* Interactive Bracket Tree */}
                            <BracketTree
                                bracket={bracket}
                                tournament={tournament}
                                onSelectWinner={selectWinner}
                            />

                            {/* Admin Event Logger (Demo) */}
                            <div className="mt-8 border-t border-white/10 pt-8">
                                <h3 className="text-xl font-bold text-white mb-4">Admin Control: Log Events</h3>
                                <p className="text-slate-400 mb-4 text-sm">Select a match to log events (goals, cards).</p>

                                <select
                                    className="input-glass w-full mb-4 text-white"
                                    value={selectedMatchId}
                                    onChange={(e) => setSelectedMatchId(e.target.value)}
                                >
                                    <option value="" className="bg-slate-800 text-white">Select Match to Log Event...</option>
                                    {matches.filter(m => m.status !== 'completed').map(m => (
                                        <option key={m._id} value={m._id} className="bg-slate-800 text-white">
                                            {m.team1.name} vs {m.team2.name} (Round {m.round})
                                        </option>
                                    ))}
                                </select>

                                {selectedMatchId && matches.find(m => m._id === selectedMatchId) && (
                                    <MatchEventLogger
                                        matchId={selectedMatchId}
                                        team1={matches.find(m => m._id === selectedMatchId).team1}
                                        team2={matches.find(m => m._id === selectedMatchId).team2}
                                    />
                                )}
                            </div>
                        </div>
                    )
                )}
            </div>

            {/* Hidden Printable Version for PDF Export */}
            <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
                <div ref={printableRef}>
                    {bracket && <PrintableTiesheet tournament={tournament} bracket={bracket} />}
                </div>
            </div>

            {/* Confirm Modal */}
            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ isOpen: false })}
                onConfirm={() => {
                    if (confirmModal.action === 'removeTeam') {
                        confirmRemoveTeam();
                    } else if (confirmModal.action === 'resetBracket') {
                        confirmReset();
                    }
                }}
                title={confirmModal.title}
                message={confirmModal.message}
                type={confirmModal.type}
                confirmText={confirmModal.action === 'removeTeam' ? 'Remove' : 'Reset'}
            />
            {/* Player Manager Modal */}
            <PlayerManagerModal
                isOpen={playerModal.isOpen}
                onClose={() => setPlayerModal({ isOpen: false, team: null })}
                team={playerModal.team}
            />
        </div>
    );
}
