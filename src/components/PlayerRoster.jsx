import React, { useState } from 'react';

/**
 * PlayerRoster Component
 * Manages team roster with add/edit/remove players
 */
export default function PlayerRoster({ teamId, teamName, players = [], onUpdate }) {
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingPlayer, setEditingPlayer] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        number: '',
        position: 'Forward'
    });

    const positions = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'];

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            alert('Player name is required');
            return;
        }

        if (!formData.number || formData.number < 1 || formData.number > 99) {
            alert('Jersey number must be between 1 and 99');
            return;
        }

        // Check for duplicate jersey numbers
        const duplicate = players.find(p =>
            p.number === parseInt(formData.number) &&
            (!editingPlayer || p.id !== editingPlayer.id)
        );

        if (duplicate) {
            alert(`Jersey number ${formData.number} is already taken by ${duplicate.name}`);
            return;
        }

        const playerData = {
            id: editingPlayer?.id || Date.now().toString(),
            teamId,
            name: formData.name.trim(),
            number: parseInt(formData.number),
            position: formData.position,
            stats: editingPlayer?.stats || {
                goals: 0,
                assists: 0,
                yellowCards: 0,
                redCards: 0,
                minutesPlayed: 0
            }
        };

        if (editingPlayer) {
            // Update existing player
            const updated = players.map(p => p.id === editingPlayer.id ? playerData : p);
            onUpdate(updated);
        } else {
            // Add new player
            onUpdate([...players, playerData]);
        }

        // Reset form
        setFormData({ name: '', number: '', position: 'Forward' });
        setShowAddForm(false);
        setEditingPlayer(null);
    };

    const handleEdit = (player) => {
        setEditingPlayer(player);
        setFormData({
            name: player.name,
            number: player.number.toString(),
            position: player.position
        });
        setShowAddForm(true);
    };

    const handleDelete = (playerId) => {
        if (!window.confirm('Are you sure you want to remove this player?')) {
            return;
        }
        onUpdate(players.filter(p => p.id !== playerId));
    };

    const handleCancel = () => {
        setFormData({ name: '', number: '', position: 'Forward' });
        setShowAddForm(false);
        setEditingPlayer(null);
    };

    return (
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold text-white">{teamName} Roster</h3>
                    <p className="text-sm text-slate-400">{players.length} players</p>
                </div>
                {!showAddForm && (
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition"
                    >
                        + Add Player
                    </button>
                )}
            </div>

            {/* Add/Edit Form */}
            {showAddForm && (
                <form onSubmit={handleSubmit} className="mb-6 p-4 rounded-lg bg-white/5 border border-white/10">
                    <h4 className="text-white font-medium mb-4">
                        {editingPlayer ? 'Edit Player' : 'Add New Player'}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm text-slate-300 mb-1">Player Name *</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="John Doe"
                                className="w-full px-3 py-2 rounded-md bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-slate-300 mb-1">Jersey Number *</label>
                            <input
                                type="number"
                                min="1"
                                max="99"
                                value={formData.number}
                                onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                                placeholder="10"
                                className="w-full px-3 py-2 rounded-md bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-slate-300 mb-1">Position *</label>
                            <select
                                value={formData.position}
                                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                className="w-full px-3 py-2 rounded-md bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            >
                                {positions.map(pos => (
                                    <option key={pos} value={pos}>{pos}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                        <button
                            type="submit"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition"
                        >
                            {editingPlayer ? 'Update Player' : 'Add Player'}
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="border border-white/20 hover:bg-white/5 text-white px-4 py-2 rounded-lg transition"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {/* Players List */}
            {players.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                    <p>No players added yet</p>
                    <p className="text-sm mt-1">Click "Add Player" to get started</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {players.sort((a, b) => a.number - b.number).map(player => (
                        <div
                            key={player.id}
                            className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                                    {player.number}
                                </div>
                                <div>
                                    <p className="text-white font-medium">{player.name}</p>
                                    <p className="text-sm text-slate-400">{player.position}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-sm text-slate-300">
                                    <span className="font-medium">{player.stats.goals}</span> goals
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(player)}
                                        className="text-indigo-400 hover:text-indigo-300 text-sm px-3 py-1 rounded transition"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(player.id)}
                                        className="text-red-400 hover:text-red-300 text-sm px-3 py-1 rounded transition"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
