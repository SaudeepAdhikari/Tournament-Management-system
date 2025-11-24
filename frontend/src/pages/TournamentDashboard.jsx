import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTournaments, deleteTournament } from '../backend/firebase/database';
import LoadingSpinner from '../components/LoadingSpinner';
import { useToast } from '../components/Toast';
import ConfirmModal from '../components/ConfirmModal';

export default function TournamentDashboard() {
    const navigate = useNavigate();
    const [tournaments, setTournaments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, upcoming, active, completed
    const [confirmModal, setConfirmModal] = useState({ isOpen: false });
    const toast = useToast();

    useEffect(() => {
        loadTournaments();
    }, []);

    async function loadTournaments() {
        try {
            setLoading(true);
            const data = await getTournaments();
            setTournaments(data);
        } catch (error) {
            console.error('Error loading tournaments:', error);
            toast.error('Failed to load tournaments');
        } finally {
            setLoading(false);
        }
    }

    function handleDeleteClick(tournamentId) {
        setConfirmModal({
            isOpen: true,
            tournamentId,
            title: 'Delete Tournament?',
            message: 'Are you sure you want to delete this tournament? This action cannot be undone.',
            type: 'danger'
        });
    }

    async function confirmDelete() {
        const { tournamentId } = confirmModal;
        try {
            await deleteTournament(tournamentId);
            const updated = tournaments.filter(t => t._id !== tournamentId);
            setTournaments(updated);
            toast.success('Tournament deleted successfully');
            setConfirmModal({ isOpen: false });
        } catch (error) {
            console.error('Error deleting tournament:', error);
            toast.error('Failed to delete tournament');
        }
    }

    const filteredTournaments = tournaments.filter(t => {
        if (filter === 'all') return true;
        return t.status === filter;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'upcoming': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
            case 'active': return 'bg-green-500/20 text-green-300 border-green-500/30';
            case 'completed': return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
            default: return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-black">
                <LoadingSpinner size="lg" text="Loading tournaments..." />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-black p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Tournament Dashboard</h1>
                        <p className="text-slate-400">Manage all your futsal tournaments</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate('/')}
                            className="px-4 py-2 border border-white/20 hover:bg-white/5 text-white rounded-lg transition"
                        >
                            Home
                        </button>
                        <button
                            onClick={() => navigate('/tournament/create')}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium shadow-md transform transition hover:scale-105"
                        >
                            + Create Tournament
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex gap-2 mb-6">
                    {['all', 'upcoming', 'active', 'completed'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-lg font-medium transition ${filter === status
                                ? 'bg-indigo-600 text-white'
                                : 'bg-white/5 text-slate-300 hover:bg-white/10'
                                }`}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Tournaments Grid */}
                {filteredTournaments.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">🏆</div>
                        <h3 className="text-xl font-semibold text-white mb-2">No tournaments found</h3>
                        <p className="text-slate-400 mb-6">
                            {filter === 'all'
                                ? 'Create your first tournament to get started'
                                : `No ${filter} tournaments`}
                        </p>
                        <button
                            onClick={() => navigate('/tournament/create')}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium shadow-md transform transition hover:scale-105"
                        >
                            Create Tournament
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTournaments.map(tournament => (
                            <div
                                key={tournament._id}
                                className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-white/20 transition group"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-indigo-300 transition">
                                            {tournament.name}
                                        </h3>
                                        <p className="text-sm text-slate-400">{tournament.location}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(tournament.status)}`}>
                                        {tournament.status}
                                    </span>
                                </div>

                                <div className="space-y-2 mb-4 text-sm text-slate-300">
                                    <div className="flex items-center gap-2">
                                        <span className="text-slate-500">📅</span>
                                        <span>{tournament.date}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-slate-500">👥</span>
                                        <span>{tournament.teamCount} teams</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-slate-500">🏅</span>
                                        <span className="capitalize">{tournament.format}</span>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => navigate(`/tournament/${tournament._id}`)}
                                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition"
                                    >
                                        View
                                    </button>
                                    <button
                                        onClick={() => navigate(`/tournament/${tournament._id}/edit`)}
                                        className="px-4 py-2 border border-white/20 hover:bg-white/5 text-white rounded-lg transition"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(tournament._id)}
                                        className="px-4 py-2 border border-red-500/30 hover:bg-red-500/10 text-red-300 rounded-lg transition"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ isOpen: false })}
                onConfirm={confirmDelete}
                title={confirmModal.title}
                message={confirmModal.message}
                type={confirmModal.type}
                confirmText="Delete"
            />
        </div>
    );
}
