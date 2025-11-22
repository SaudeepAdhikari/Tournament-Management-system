import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTournament } from '../firebase/database';
import { useToast } from '../components/Toast';
import { ButtonSpinner } from '../components/LoadingSpinner';

export default function CreateTournamentPage() {
    const navigate = useNavigate();
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        date: '',
        location: '',
        format: 'single-elimination',
        teamCount: 8
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'teamCount' ? parseInt(value) : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.name.trim()) {
            toast.error('Tournament name is required');
            return;
        }

        if (!formData.date) {
            toast.error('Tournament date is required');
            return;
        }

        if (!formData.location.trim()) {
            toast.error('Location is required');
            return;
        }

        if (formData.teamCount < 4 || formData.teamCount > 32) {
            toast.error('Team count must be between 4 and 32');
            return;
        }

        try {
            setLoading(true);

            const tournamentData = {
                ...formData,
                status: 'upcoming',
                id: Date.now().toString()
            };

            // TODO: Replace with Firebase call when configured
            // const result = await createTournament(tournamentData);

            // For now, save to localStorage
            const existing = JSON.parse(localStorage.getItem('tournaments') || '[]');
            existing.push(tournamentData);
            localStorage.setItem('tournaments', JSON.stringify(existing));

            toast.success('Tournament created successfully!');
            navigate('/dashboard');
        } catch (error) {
            console.error('Error creating tournament:', error);
            toast.error('Failed to create tournament');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-black p-6">
            <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="text-slate-400 hover:text-white transition mb-4"
                    >
                        ← Back to Dashboard
                    </button>
                    <h1 className="text-3xl font-bold text-white mb-2">Create New Tournament</h1>
                    <p className="text-slate-400">Set up your futsal tournament details</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white/5 rounded-xl p-8 border border-white/10">
                    <div className="space-y-6">
                        {/* Tournament Name */}
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                Tournament Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g., Summer Championship 2025"
                                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                required
                            />
                        </div>

                        {/* Date */}
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                Tournament Date *
                            </label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                required
                            />
                        </div>

                        {/* Location */}
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                Location *
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="e.g., Central Futsal Arena"
                                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                required
                            />
                        </div>

                        {/* Format */}
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                Tournament Format *
                            </label>
                            <select
                                name="format"
                                value={formData.format}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            >
                                <option value="single-elimination">Single Elimination</option>
                                <option value="double-elimination">Double Elimination</option>
                                <option value="round-robin">Round Robin</option>
                                <option value="group-knockout">Group Stage + Knockout</option>
                            </select>
                        </div>

                        {/* Team Count */}
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                Number of Teams *
                            </label>
                            <select
                                name="teamCount"
                                value={formData.teamCount}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            >
                                <option value={4}>4 teams</option>
                                <option value={8}>8 teams</option>
                                <option value={16}>16 teams</option>
                                <option value={32}>32 teams</option>
                            </select>
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="mt-8 flex gap-3">
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard')}
                            className="flex-1 px-6 py-3 border border-white/20 hover:bg-white/5 text-white rounded-lg font-medium transition"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-600 text-white px-6 py-3 rounded-lg font-medium shadow-md transition flex items-center justify-center gap-2"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <ButtonSpinner />
                                    Creating...
                                </>
                            ) : (
                                'Create Tournament'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
