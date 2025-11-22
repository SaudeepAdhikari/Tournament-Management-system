/**
 * Firebase Database Service
 * Handles all Firestore operations for tournaments, teams, matches, and players
 */

import {
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    getDoc,
    getDocs,
    query,
    where,
    orderBy,
    onSnapshot,
    serverTimestamp
} from 'firebase/firestore';
import { db } from './config';

// ==================== TOURNAMENTS ====================

/**
 * Create a new tournament
 */
export async function createTournament(tournamentData) {
    try {
        const docRef = await addDoc(collection(db, 'tournaments'), {
            ...tournamentData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            status: 'upcoming'
        });
        return { id: docRef.id, ...tournamentData };
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
        const querySnapshot = await getDocs(
            query(collection(db, 'tournaments'), orderBy('createdAt', 'desc'))
        );
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
        const docRef = doc(db, 'tournaments', tournamentId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            throw new Error('Tournament not found');
        }
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
        const docRef = doc(db, 'tournaments', tournamentId);
        await updateDoc(docRef, {
            ...updates,
            updatedAt: serverTimestamp()
        });
        return { id: tournamentId, ...updates };
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
        await deleteDoc(doc(db, 'tournaments', tournamentId));
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
        const docRef = await addDoc(collection(db, 'teams'), {
            ...teamData,
            createdAt: serverTimestamp()
        });
        return { id: docRef.id, ...teamData };
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
        const q = query(
            collection(db, 'teams'),
            where('tournamentId', '==', tournamentId)
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
        const docRef = doc(db, 'teams', teamId);
        await updateDoc(docRef, updates);
        return { id: teamId, ...updates };
    } catch (error) {
        console.error('Error updating team:', error);
        throw error;
    }
}

// ==================== MATCHES ====================

/**
 * Create a new match
 */
export async function createMatch(matchData) {
    try {
        const docRef = await addDoc(collection(db, 'matches'), {
            ...matchData,
            createdAt: serverTimestamp()
        });
        return { id: docRef.id, ...matchData };
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
        const q = query(
            collection(db, 'matches'),
            where('tournamentId', '==', tournamentId),
            orderBy('round', 'asc'),
            orderBy('matchNumber', 'asc')
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error getting matches:', error);
        throw error;
    }
}

/**
 * Update match score
 */
export async function updateMatchScore(matchId, scoreData) {
    try {
        const docRef = doc(db, 'matches', matchId);
        await updateDoc(docRef, {
            ...scoreData,
            updatedAt: serverTimestamp()
        });
        return { id: matchId, ...scoreData };
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
        const docRef = await addDoc(collection(db, 'players'), {
            ...playerData,
            createdAt: serverTimestamp()
        });
        return { id: docRef.id, ...playerData };
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
        const q = query(
            collection(db, 'players'),
            where('teamId', '==', teamId)
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
        const docRef = doc(db, 'players', playerId);
        await updateDoc(docRef, {
            stats: stats,
            updatedAt: serverTimestamp()
        });
        return { id: playerId, stats };
    } catch (error) {
        console.error('Error updating player stats:', error);
        throw error;
    }
}

// ==================== REAL-TIME LISTENERS ====================

/**
 * Subscribe to tournament updates
 */
export function subscribeTournament(tournamentId, callback) {
    const docRef = doc(db, 'tournaments', tournamentId);
    return onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
            callback({ id: doc.id, ...doc.data() });
        }
    });
}

/**
 * Subscribe to matches updates
 */
export function subscribeMatches(tournamentId, callback) {
    const q = query(
        collection(db, 'matches'),
        where('tournamentId', '==', tournamentId)
    );
    return onSnapshot(q, (querySnapshot) => {
        const matches = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(matches);
    });
}
