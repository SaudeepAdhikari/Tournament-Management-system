/**
 * Random Draw Utilities
 * Functions to generate random matchups and fixtures
 */

/**
 * Shuffle array using Fisher-Yates algorithm
 */
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Generate random matchups from a list of teams
 * @param {Array} teams - Array of team objects
 * @returns {Array} Array of match objects
 */
export function generateRandomDraw(teams) {
    if (teams.length < 2) {
        throw new Error('At least 2 teams are required for a draw');
    }

    // Shuffle teams randomly
    const shuffledTeams = shuffleArray(teams);
    const matches = [];

    // Pair teams sequentially after shuffle
    for (let i = 0; i < shuffledTeams.length - 1; i += 2) {
        if (i + 1 < shuffledTeams.length) {
            matches.push({
                id: `match-${Date.now()}-${i}`,
                matchNumber: Math.floor(i / 2) + 1,
                teamA: shuffledTeams[i],
                teamB: shuffledTeams[i + 1],
                status: 'pending',
                scoreA: null,
                scoreB: null,
                winner: null,
                round: 1
            });
        }
    }

    // If odd number of teams, last team gets a bye
    if (shuffledTeams.length % 2 !== 0) {
        const byeTeam = shuffledTeams[shuffledTeams.length - 1];
        matches.push({
            id: `match-bye-${Date.now()}`,
            matchNumber: matches.length + 1,
            teamA: byeTeam,
            teamB: null,
            status: 'bye',
            scoreA: null,
            scoreB: null,
            winner: byeTeam.name,
            round: 1,
            isBye: true
        });
    }

    return matches;
}

/**
 * Generate round-robin fixtures (all teams play each other once)
 * @param {Array} teams - Array of team objects
 * @returns {Array} Array of match objects grouped by rounds
 */
export function generateRoundRobinDraw(teams) {
    if (teams.length < 2) {
        throw new Error('At least 2 teams are required');
    }

    const matches = [];
    let matchId = 0;

    // Generate all possible pairings
    for (let i = 0; i < teams.length; i++) {
        for (let j = i + 1; j < teams.length; j++) {
            matches.push({
                id: `rr-match-${Date.now()}-${matchId}`,
                matchNumber: matchId + 1,
                teamA: teams[i],
                teamB: teams[j],
                status: 'pending',
                scoreA: null,
                scoreB: null,
                winner: null,
                round: Math.floor(matchId / Math.floor(teams.length / 2)) + 1
            });
            matchId++;
        }
    }

    return matches;
}

/**
 * Generate group stage fixtures
 * @param {Array} teams - Array of team objects
 * @param {number} groupCount - Number of groups
 * @returns {Object} Object with groups and matches
 */
export function generateGroupStageDraw(teams, groupCount = 2) {
    if (teams.length < groupCount * 2) {
        throw new Error(`Need at least ${groupCount * 2} teams for ${groupCount} groups`);
    }

    // Shuffle and divide into groups
    const shuffled = shuffleArray(teams);
    const groups = [];
    const teamsPerGroup = Math.floor(shuffled.length / groupCount);

    for (let i = 0; i < groupCount; i++) {
        const groupTeams = shuffled.slice(i * teamsPerGroup, (i + 1) * teamsPerGroup);
        groups.push({
            id: `group-${String.fromCharCode(65 + i)}`,
            name: `Group ${String.fromCharCode(65 + i)}`,
            teams: groupTeams,
            matches: generateRoundRobinDraw(groupTeams)
        });
    }

    // Handle remaining teams if any
    const remainingTeams = shuffled.slice(groupCount * teamsPerGroup);
    if (remainingTeams.length > 0) {
        // Distribute to existing groups
        remainingTeams.forEach((team, index) => {
            groups[index % groupCount].teams.push(team);
        });
    }

    return { groups };
}

/**
 * Visualize draw results
 * @param {Array} matches - Array of match objects
 * @returns {string} Formatted string of matchups
 */
export function formatDrawResults(matches) {
    return matches.map((match, index) => {
        if (match.isBye) {
            return `Match ${index + 1}: ${match.teamA.name} (BYE)`;
        }
        return `Match ${index + 1}: ${match.teamA.name} vs ${match.teamB.name}`;
    }).join('\n');
}
