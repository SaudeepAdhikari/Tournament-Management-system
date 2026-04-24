import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTournaments } from '../backend/firebase/database';
import LoadingSpinner from '../components/LoadingSpinner';
import { useToast } from '../components/Toast';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function PublicTournamentsPage() {
    const navigate = useNavigate();
    const [tournaments, setTournaments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const toast = useToast();

    useEffect(() => {
        async function loadTournaments() {
            try {
                setLoading(true);
                const data = await getTournaments(); // Fetches all
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
        <div className="min-h-screen flex flex-col bg-gradient-dark">
            <Header />
            <main className="flex-grow p-6 pt-28 pb-20">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-12 animate-fade-in">
                        <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
                            Explore <span className="text-gradient">Tournaments</span>
                        </h1>
                        <p className="text-slate-400 text-lg max-w-2xl">
                            Browse and follow live futsal tournaments from around the world.
                        </p>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-3 mb-8">
                        {['all', 'upcoming', 'active', 'completed'].map(status => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${filter === status
                                    ? 'bg-white text-slate-900'
                                    : 'bg-white/5 text-slate-400 hover:text-white'
                                    }`}
                            >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                        ))}
                    </div>

                    {/* Grid */}
                    {filteredTournaments.length === 0 ? (
                        <div className="glass-card p-16 text-center">
                            <div className="text-6xl mb-4">⚽</div>
                            <h3 className="text-xl font-bold text-white">No tournaments found</h3>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredTournaments.map((tournament) => (
                                <div key={tournament._id} className="glass-card-premium p-6 group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="text-2xl">🏆</div>
                                        <span className={getStatusBadge(tournament.status)}>
                                            {tournament.status.toUpperCase()}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                                        {tournament.name}
                                    </h3>
                                    <p className="text-slate-400 text-sm mb-6">
                                        📍 {tournament.location}
                                    </p>
                                    <div className="flex gap-4 mb-6 text-sm">
                                        <div className="text-slate-500">Teams: <span className="text-white font-bold">{tournament.teamCount}</span></div>
                                        <div className="text-slate-500">Format: <span className="text-white font-bold capitalize">{tournament.format.replace('-', ' ')}</span></div>
                                    </div>
                                    <button
                                        onClick={() => navigate(`/tournament/${tournament._id}`)}
                                        className="btn-primary w-full"
                                    >
                                        View Tournament
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
