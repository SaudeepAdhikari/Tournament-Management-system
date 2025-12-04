/**
 * API Service
 * Handles all backend API operations for tournaments, teams, matches, and players
 * Replaces previous Firebase implementation
 */

const API_URL = 'http://localhost:5000/api';

// ==================== TOURNAMENTS ====================

/**
 * Create a new tournament
 */
export async function createTournament(tournamentData) {
    try {
        const response = await fetch(`${API_URL}/tournaments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(tournamentData),
        });
        if (!response.ok) throw new Error('Failed to create tournament');
        return await response.json();
    } catch (error) {
        console.error('Error creating tournament:', error);
        throw error;
    }
}

/**
 * Get all tournaments
 */
export async function getTournaments() {
    try {
        const response = await fetch(`${API_URL}/tournaments`);
        if (!response.ok) throw new Error('Failed to fetch tournaments');
        return await response.json();
    } catch (error) {
        console.error('Error getting tournaments:', error);
        throw error;
    }
}

/**
 * Get a single tournament by ID
 */
export async function getTournament(tournamentId) {
    try {
        const response = await fetch(`${API_URL}/tournaments/${tournamentId}`);
        if (!response.ok) throw new Error('Failed to fetch tournament');
        return await response.json();
    } catch (error) {
        console.error('Error getting tournament:', error);
        throw error;
    }
}

/**
 * Update tournament
 */
export async function updateTournament(tournamentId, updates) {
    try {
        const response = await fetch(`${API_URL}/tournaments/${tournamentId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updates),
        });
        if (!response.ok) throw new Error('Failed to update tournament');
        return await response.json();
    } catch (error) {
        console.error('Error updating tournament:', error);
        throw error;
    }
}

/**
 * Delete tournament
 */
export async function deleteTournament(tournamentId) {
    try {
        const response = await fetch(`${API_URL}/tournaments/${tournamentId}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete tournament');
        return tournamentId;
    } catch (error) {
        console.error('Error deleting tournament:', error);
        throw error;
    }
}

// ==================== TEAMS ====================

/**
 * Create a new team
 */
export async function createTeam(teamData) {
    try {
        const response = await fetch(`${API_URL}/teams`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(teamData),
        });
        if (!response.ok) throw new Error('Failed to create team');
        return await response.json();
    } catch (error) {
        console.error('Error creating team:', error);
        throw error;
    }
}

/**
 * Get teams for a tournament
 */
export async function getTeamsByTournament(tournamentId) {
    try {
        const response = await fetch(`${API_URL}/teams?tournamentId=${tournamentId}`);
        if (!response.ok) throw new Error('Failed to fetch teams');
        return await response.json();
    } catch (error) {
        console.error('Error getting teams:', error);
        throw error;
    }
}

/**
 * Update team
 */
export async function updateTeam(teamId, updates) {
    try {
        const response = await fetch(`${API_URL}/teams/${teamId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updates),
        });
        if (!response.ok) throw new Error('Failed to update team');
        return await response.json();
    } catch (error) {
        console.error('Error updating team:', error);
        throw error;
    }
}

/**
 * Delete team
 */
export async function deleteTeam(teamId) {
    try {
        const response = await fetch(`${API_URL}/teams/${teamId}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete team');
        return teamId;
    } catch (error) {
        console.error('Error deleting team:', error);
        throw error;
    }
}

// ==================== MATCHES ====================

/**
 * Create a new match
 */
export async function createMatch(matchData) {
    try {
        const response = await fetch(`${API_URL}/matches`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(matchData),
        });
        if (!response.ok) throw new Error('Failed to create match');
        return await response.json();
    } catch (error) {
        console.error('Error creating match:', error);
        throw error;
    }
}

/**
 * Get matches for a tournament
 */
export async function getMatchesByTournament(tournamentId) {
    try {
        const response = await fetch(`${API_URL}/matches?tournamentId=${tournamentId}`);
        if (!response.ok) throw new Error('Failed to fetch matches');
        return await response.json();
    } catch (error) {
        console.error('Error getting matches:', error);
        throw error;
    }
}

/**
 * Delete all matches for a tournament
 */
export async function deleteMatchesByTournament(tournamentId) {
    try {
        const response = await fetch(`${API_URL}/matches?tournamentId=${tournamentId}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete matches');
        return await response.json();
    } catch (error) {
        console.error('Error deleting matches:', error);
        throw error;
    }
}

/**
 * Update match score
 */
export async function updateMatchScore(matchId, scoreData) {
    try {
        const response = await fetch(`${API_URL}/matches/${matchId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(scoreData),
        });
        if (!response.ok) throw new Error('Failed to update match score');
        return await response.json();
    } catch (error) {
        console.error('Error updating match score:', error);
        throw error;
    }
}

// ==================== PLAYERS ====================

/**
 * Create a new player
 */
export async function createPlayer(playerData) {
    try {
        const response = await fetch(`${API_URL}/players`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(playerData),
        });
        if (!response.ok) throw new Error('Failed to create player');
        return await response.json();
    } catch (error) {
        console.error('Error creating player:', error);
        throw error;
    }
}

/**
 * Get players for a team
 */
export async function getPlayersByTeam(teamId) {
    try {
        const response = await fetch(`${API_URL}/players?teamId=${teamId}`);
        if (!response.ok) throw new Error('Failed to fetch players');
        return await response.json();
    } catch (error) {
        console.error('Error getting players:', error);
        throw error;
    }
}

/**
 * Update player stats
 */
export async function updatePlayerStats(playerId, stats) {
    try {
        const response = await fetch(`${API_URL}/players/${playerId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ stats }),
        });
        if (!response.ok) throw new Error('Failed to update player stats');
        return await response.json();
    } catch (error) {
        console.error('Error updating player stats:', error);
        throw error;
    }
}

// ==================== REAL-TIME LISTENERS (MOCKED FOR NOW) ====================

/**
 * Subscribe to tournament updates
 * Note: Real-time updates via WebSockets/Socket.io would be needed for full parity.
 * For now, we'll just fetch once.
 */
export function subscribeTournament(tournamentId, callback) {
    getTournament(tournamentId).then(callback).catch(console.error);
    // Return a dummy unsubscribe function
    return () => { };
}

/**
 * Subscribe to matches updates
 */
export function subscribeMatches(tournamentId, callback) {
    getMatchesByTournament(tournamentId).then(callback).catch(console.error);
    return () => { };
}
