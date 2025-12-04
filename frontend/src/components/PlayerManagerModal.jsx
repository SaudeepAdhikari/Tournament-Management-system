import React, { useState, useEffect } from 'react';
import { createPlayer, getPlayersByTeam } from '../backend/firebase/database';
import { useToast } from './Toast';
import { ButtonSpinner } from './LoadingSpinner';

export default function PlayerManagerModal({ isOpen, onClose, team }) {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [adding, setAdding] = useState(false);
    const [newPlayerName, setNewPlayerName] = useState('');
    const [newPlayerNumber, setNewPlayerNumber] = useState('');
    const [newPlayerPosition, setNewPlayerPosition] = useState('Player');
    const toast = useToast();

    useEffect(() => {
        if (isOpen && team) {
            loadPlayers();
        }
    }, [isOpen, team]);

    async function loadPlayers() {
        try {
            setLoading(true);
            const data = await getPlayersByTeam(team._id);
            setPlayers(data);
        } catch (error) {
            console.error('Error loading players:', error);
            toast.error('Failed to load players');
        } finally {
            setLoading(false);
        }
    }

    async function handleAddPlayer(e) {
        e.preventDefault();
        if (!newPlayerName.trim()) {
            toast.error('Player name is required');
            return;
        }

        try {
            setAdding(true);
            const newPlayer = await createPlayer({
                name: newPlayerName,
                number: newPlayerNumber || 0,
                position: newPlayerPosition,
                teamId: team._id
            });
            setPlayers([...players, newPlayer]);
            setNewPlayerName('');
            setNewPlayerNumber('');
            setNewPlayerPosition('Player');
            toast.success('Player added successfully');
        } catch (error) {
            console.error('Error adding player:', error);
            toast.error('Failed to add player');
        } finally {
            setAdding(false);
        }
    }

    if (!isOpen || !team) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="glass-card w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                <div className="p-6 border-b border-white/10 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-white">Manage Players: {team.name}</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1">
                    {/* Add Player Form */}
                    <form onSubmit={handleAddPlayer} className="mb-8 bg-white/5 p-4 rounded-xl border border-white/10">
                        <h3 className="text-lg font-semibold text-white mb-4">Add New Player</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Name</label>
                                <input
                                    type="text"
                                    value={newPlayerName}
                                    onChange={(e) => setNewPlayerName(e.target.value)}
                                    className="input-glass w-full"
                                    placeholder="Player Name"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Number</label>
                                <input
                                    type="number"
                                    value={newPlayerNumber}
                                    onChange={(e) => setNewPlayerNumber(e.target.value)}
                                    className="input-glass w-full"
                                    placeholder="Jersey No."
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Position</label>
                                <select
                                    value={newPlayerPosition}
                                    onChange={(e) => setNewPlayerPosition(e.target.value)}
                                    className="input-glass w-full text-white"
                                >
                                    <option value="Player" className="bg-slate-800">Player</option>
                                    <option value="Goalkeeper" className="bg-slate-800">Goalkeeper</option>
                                    <option value="Captain" className="bg-slate-800">Captain</option>
                                </select>
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <button
                                type="submit"
                                disabled={adding}
                                className="btn-primary py-2 px-6 text-sm"
                            >
                                {adding ? <ButtonSpinner /> : 'Add Player'}
                            </button>
                        </div>
                    </form>

                    {/* Players List */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Team Roster ({players.length})</h3>
                        {loading ? (
                            <div className="text-center py-8 text-slate-400">Loading players...</div>
                        ) : players.length === 0 ? (
                            <div className="text-center py-8 text-slate-500 bg-white/5 rounded-xl border border-white/5 border-dashed">
                                No players added yet.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-3">
                                {players.map((player) => (
                                    <div key={player._id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5 hover:border-white/20 transition">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold border border-indigo-500/30">
                                                {player.number || '#'}
                                            </div>
                                            <div>
                                                <div className="text-white font-medium">{player.name}</div>
                                                <div className="text-xs text-slate-400">{player.position}</div>
                                            </div>
                                        </div>
                                        {/* Future: Add delete/edit buttons here */}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
