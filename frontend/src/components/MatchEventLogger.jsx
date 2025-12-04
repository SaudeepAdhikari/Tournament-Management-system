import React, { useState, useEffect } from 'react';
import { useToast } from './Toast';

export default function MatchEventLogger({ matchId, team1, team2, onEventLogged }) {
    const [players, setPlayers] = useState([]);
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [eventType, setEventType] = useState('goal');
    const [minute, setMinute] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    useEffect(() => {
        // Fetch players for both teams
        async function fetchPlayers() {
            try {
                const res1 = await fetch(`http://localhost:5000/api/players?teamId=${team1.id}`);
                const p1 = await res1.json();
                const res2 = await fetch(`http://localhost:5000/api/players?teamId=${team2.id}`);
                const p2 = await res2.json();

                setPlayers([...p1.map(p => ({ ...p, teamName: team1.name })), ...p2.map(p => ({ ...p, teamName: team2.name }))]);
            } catch (error) {
                console.error('Error fetching players:', error);
            }
        }
        if (team1 && team2) fetchPlayers();
    }, [team1, team2]);

    async function handleSubmit(e) {
        e.preventDefault();
        if (!selectedPlayer || !minute) {
            toast.error('Please select player and minute');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`http://localhost:5000/api/matches/${matchId}/events`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: eventType,
                    playerId: selectedPlayer._id,
                    teamId: selectedPlayer.teamId,
                    minute: parseInt(minute),
                    description: `${eventType} by ${selectedPlayer.name}`
                })
            });

            if (!response.ok) throw new Error('Failed to log event');

            toast.success('Event logged!');
            setMinute('');
            if (onEventLogged) onEventLogged();
        } catch (error) {
            toast.error('Failed to log event');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="glass-card p-4 mt-4">
            <h3 className="text-lg font-bold text-white mb-4">Log Match Event</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-slate-400 text-sm mb-1">Event Type</label>
                        <select
                            value={eventType}
                            onChange={(e) => setEventType(e.target.value)}
                            className="input-glass w-full text-white"
                        >
                            <option value="goal" className="bg-slate-800 text-white">⚽ Goal</option>
                            <option value="yellowCard" className="bg-slate-800 text-white">🟨 Yellow Card</option>
                            <option value="redCard" className="bg-slate-800 text-white">🟥 Red Card</option>
                            <option value="assist" className="bg-slate-800 text-white">👟 Assist</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-slate-400 text-sm mb-1">Minute</label>
                        <input
                            type="number"
                            value={minute}
                            onChange={(e) => setMinute(e.target.value)}
                            className="input-glass w-full"
                            placeholder="e.g. 23"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-slate-400 text-sm mb-1">Player</label>
                    <select
                        onChange={(e) => setSelectedPlayer(players.find(p => p._id === e.target.value))}
                        className="input-glass w-full text-white"
                        defaultValue=""
                    >
                        <option value="" disabled className="bg-slate-800 text-white">Select Player</option>
                        {players.map(p => (
                            <option key={p._id} value={p._id} className="bg-slate-800 text-white">
                                {p.name} ({p.teamName})
                            </option>
                        ))}
                    </select>
                </div>

                <button type="submit" disabled={loading} className="btn-primary w-full">
                    {loading ? 'Logging...' : 'Log Event'}
                </button>
            </form>
        </div>
    );
}
