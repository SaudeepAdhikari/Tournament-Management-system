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
        loadTournaments();
    }, []);

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

    const getStatusBadge = (status) => {
        switch (status) {
            case 'upcoming': return 'badge-info';
            case 'active': return 'badge-success';
            case 'completed': return 'badge-purple';
            default: return 'badge';
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
        <div className="min-h-screen p-6 pb-20">
            <div className="max-w-7xl mx-auto">
                {/* Hero Section */}
                <div className="relative mb-12 pt-8 animate-fade-in">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="z-10">
                            <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tight">
                                <span className="text-gradient">Kick Off</span> <br />
                                <span className="text-white">Arena</span>
                            </h1>
                            <p className="text-slate-400 text-lg max-w-xl leading-relaxed">
                                The ultimate platform for managing professional futsal tournaments.
                                Track scores, manage teams, and visualize brackets in real-time.
                            </p>

                            <div className="flex gap-4 mt-8">
                                <button
                                    onClick={() => navigate('/tournament/create')}
                                    className="btn-primary"
                                >
                                    + Create Tournament
                                </button>
                                <button
                                    onClick={() => navigate('/')}
                                    className="btn-secondary"
                                >
                                    Back to Home
                                </button>
                            </div>
                        </div>

                        {/* Floating 3D Element (Decorative) */}
                        <div className="hidden md:block relative animate-float">
                            <div className="absolute inset-0 bg-indigo-500/20 blur-[100px] rounded-full"></div>
                            <div className="relative text-[120px] leading-none filter drop-shadow-2xl transform rotate-12 hover:rotate-0 transition-transform duration-500 cursor-default">
                                🏆
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-3 mb-8 animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
                    {['all', 'upcoming', 'active', 'completed'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 ${filter === status
                                ? 'bg-white text-slate-900 shadow-lg scale-105'
                                : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Tournaments Grid */}
                {filteredTournaments.length === 0 ? (
                    <div className="glass-card p-16 text-center animate-scale-in">
                        <div className="text-7xl mb-6 animate-pulse-slow">⚽</div>
                        <h3 className="text-2xl font-bold text-white mb-3">No tournaments found</h3>
                        <p className="text-slate-400 mb-8 max-w-md mx-auto">
                            {filter === 'all'
                                ? 'Get the ball rolling by creating your first tournament.'
                                : `There are no ${filter} tournaments at the moment.`}
                        </p>
                        <button
                            onClick={() => navigate('/tournament/create')}
                            className="btn-primary"
                        >
                            Create Tournament
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
                        {filteredTournaments.map((tournament, index) => (
                            <div
                                key={tournament._id}
                                className="glass-card-premium p-6 group hover:border-indigo-500/30 transition-all duration-500"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="flex items-start justify-between mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-2xl border border-white/10 group-hover:scale-110 transition-transform duration-300">
                                        ⚽
                                    </div>
                                    <span className={getStatusBadge(tournament.status)}>
                                        {tournament.status.toUpperCase()}
                                    </span>
                                </div>

                                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                                    {tournament.name}
                                </h3>
                                <p className="text-slate-400 text-sm mb-6 flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    {tournament.location}
                                </p>

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                                        <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Teams</div>
                                        <div className="text-lg font-bold text-white">{tournament.teamCount}</div>
                                    </div>
                                    <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                                        <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Format</div>
                                        <div className="text-lg font-bold text-white capitalize">{tournament.format}</div>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => navigate(`/tournament/${tournament._id}`)}
                                        className="flex-1 btn-primary py-2.5 text-sm"
                                    >
                                        Manage
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(tournament._id)}
                                        className="px-3 py-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                                        title="Delete Tournament"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
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
