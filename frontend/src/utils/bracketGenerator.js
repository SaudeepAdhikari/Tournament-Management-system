/**
 * Dynamic Bracket Generator Utility
 * Supports 4, 8, 16, 32 teams with automatic bye handling
 */

/**
 * Calculate number of rounds needed for a tournament
 * @param {number} teamCount - Number of teams
 * @returns {number} Number of rounds
 */
export function calculateRounds(teamCount) {
    if (teamCount < 2) return 0;
    return Math.ceil(Math.log2(teamCount));
}

/**
 * Get next power of 2 (for bracket size)
 * @param {number} n - Input number
 * @returns {number} Next power of 2
 */
export function nextPowerOf2(n) {
    return Math.pow(2, Math.ceil(Math.log2(n)));
}

/**
 * Generate seeding for teams (1 vs 16, 8 vs 9, etc.)
 * @param {number} bracketSize - Size of bracket (must be power of 2)
 * @returns {Array<[number, number]>} Array of matchup pairs
 */
export function generateSeeding(bracketSize) {
    const seeds = Array.from({ length: bracketSize }, (_, i) => i + 1);
    const matchups = [];

    // Standard tournament seeding algorithm
    for (let i = 0; i < bracketSize / 2; i++) {
        matchups.push([seeds[i], seeds[bracketSize - 1 - i]]);
    }

    return matchups;
}

/**
 * Generate complete bracket structure
 * @param {Array<string>} teams - Array of team names
 * @returns {Object} Bracket structure with matches
 */
export function generateBracket(teams) {
    if (!teams || teams.length < 2) {
        throw new Error('At least 2 teams are required');
    }

    const teamCount = teams.length;
    const bracketSize = nextPowerOf2(teamCount);
    const rounds = calculateRounds(bracketSize);
    const byeCount = bracketSize - teamCount;

    // Create seeding
    const seeding = generateSeeding(bracketSize);

    // Assign teams to seeds (top teams get byes)
    const seedAssignments = new Array(bracketSize).fill(null);
    teams.forEach((team, idx) => {
        seedAssignments[idx] = team;
    });

    // Generate first round matches
    const firstRoundMatches = seeding.map(([seed1, seed2], idx) => {
        const team1 = seedAssignments[seed1 - 1];
        const team2 = seedAssignments[seed2 - 1];

        // Handle byes
        let winner = null;
        if (!team1 && team2) winner = team2;
        if (team1 && !team2) winner = team1;

        return {
            id: `r1-m${idx}`,
            round: 1,
            matchNumber: idx,
            teamA: team1 || null,
            teamB: team2 || null,
            scoreA: null,
            scoreB: null,
            winner: winner,
            status: winner ? 'bye' : 'pending',
            nextMatchId: null // Will be calculated
        };
    });

    // Generate subsequent rounds
    const allMatches = [...firstRoundMatches];
    let previousRoundMatches = firstRoundMatches;

    for (let round = 2; round <= rounds; round++) {
        const matchesInRound = Math.pow(2, rounds - round);
        const roundMatches = [];

        for (let i = 0; i < matchesInRound; i++) {
            const match = {
                id: `r${round}-m${i}`,
                round: round,
                matchNumber: i,
                teamA: null,
                teamB: null,
                scoreA: null,
                scoreB: null,
                winner: null,
                status: 'pending',
                nextMatchId: null,
                sourceMatchIds: [
                    previousRoundMatches[i * 2].id,
                    previousRoundMatches[i * 2 + 1].id
                ]
            };

            roundMatches.push(match);

            // Set next match for previous round
            previousRoundMatches[i * 2].nextMatchId = match.id;
            previousRoundMatches[i * 2 + 1].nextMatchId = match.id;
        }

        allMatches.push(...roundMatches);
        previousRoundMatches = roundMatches;
    }

    return {
        teams,
        teamCount,
        bracketSize,
        rounds,
        byeCount,
        matches: allMatches,
        metadata: {
            createdAt: new Date().toISOString(),
            format: 'single-elimination'
        }
    };
}

/**
 * Update match winner and propagate to next round
 * @param {Array} matches - All matches
 * @param {string} matchId - Match to update
 * @param {string} winnerTeam - Winning team name
 * @param {number} scoreA - Team A score
 * @param {number} scoreB - Team B score
 * @returns {Array} Updated matches
 */
export function updateMatchWinner(matches, matchId, winnerTeam, scoreA = null, scoreB = null) {
    const updatedMatches = [...matches];
    const matchIndex = updatedMatches.findIndex(m => m.id === matchId);

    if (matchIndex === -1) return matches;

    const match = { ...updatedMatches[matchIndex] };
    match.winner = winnerTeam;
    match.scoreA = scoreA;
    match.scoreB = scoreB;
    match.status = 'completed';

    updatedMatches[matchIndex] = match;

    // Propagate winner to next match
    if (match.nextMatchId) {
        const nextMatchIndex = updatedMatches.findIndex(m => m.id === match.nextMatchId);
        if (nextMatchIndex !== -1) {
            const nextMatch = { ...updatedMatches[nextMatchIndex] };

            // Determine which slot (A or B) this winner goes to
            const sourceMatches = updatedMatches.filter(m => m.nextMatchId === match.nextMatchId);
            const slotIndex = sourceMatches.findIndex(m => m.id === matchId);

            if (slotIndex === 0) {
                nextMatch.teamA = winnerTeam;
            } else {
                nextMatch.teamB = winnerTeam;
            }

            // Update status if both teams are set
            if (nextMatch.teamA && nextMatch.teamB) {
                nextMatch.status = 'ready';
            }

            updatedMatches[nextMatchIndex] = nextMatch;
        }
    }

    return updatedMatches;
}

/**
 * Get matches for a specific round
 * @param {Array} matches - All matches
 * @param {number} round - Round number
 * @returns {Array} Matches in that round
 */
export function getMatchesByRound(matches, round) {
    return matches.filter(m => m.round === round);
}

/**
 * Get tournament champion
 * @param {Array} matches - All matches
 * @returns {string|null} Champion team name or null
 */
export function getChampion(matches) {
    if (!matches || matches.length === 0) return null;

    const finalMatch = matches.reduce((latest, match) => {
        return match.round > latest.round ? match : latest;
    }, matches[0]);

    return finalMatch.winner;
}

/**
 * Calculate tournament progress percentage
 * @param {Array} matches - All matches
 * @returns {number} Progress percentage (0-100)
 */
export function getTournamentProgress(matches) {
    if (!matches || matches.length === 0) return 0;

    const completedMatches = matches.filter(m => m.status === 'completed' || m.status === 'bye').length;
    return Math.round((completedMatches / matches.length) * 100);
}
