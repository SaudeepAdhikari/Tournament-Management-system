/**
 * Export Utilities
 * Functions to export tournament data in various formats
 */

/**
 * Export bracket as printable HTML
 */
export function exportBracketHTML(tournament, matches) {
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${tournament.name} - Bracket</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 20px;
      background: #f5f5f5;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .header h1 {
      color: #333;
      margin: 0;
    }
    .header p {
      color: #666;
      margin: 5px 0;
    }
    .bracket {
      display: flex;
      justify-content: space-around;
      gap: 20px;
    }
    .round {
      flex: 1;
    }
    .round-title {
      text-align: center;
      font-weight: bold;
      margin-bottom: 10px;
      color: #4F46E5;
    }
    .match {
      background: white;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      padding: 10px;
      margin-bottom: 15px;
    }
    .team {
      padding: 8px;
      border-bottom: 1px solid #f3f4f6;
    }
    .team:last-child {
      border-bottom: none;
    }
    .team.winner {
      background: #dcfce7;
      font-weight: bold;
    }
    .score {
      float: right;
      font-weight: bold;
    }
    @media print {
      body { background: white; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${tournament.name}</h1>
    <p>${tournament.date} • ${tournament.location}</p>
    <p>${tournament.teamCount} Teams • ${tournament.format}</p>
    <button class="no-print" onclick="window.print()">Print Bracket</button>
  </div>
  
  <div class="bracket">
    ${generateRoundsHTML(matches)}
  </div>
</body>
</html>
  `;

    // Open in new window
    const printWindow = window.open('', '_blank');
    printWindow.document.write(html);
    printWindow.document.close();
}

function generateRoundsHTML(matches) {
    const rounds = {};
    matches.forEach(match => {
        if (!rounds[match.round]) rounds[match.round] = [];
        rounds[match.round].push(match);
    });

    const roundNames = {
        1: 'Quarterfinals',
        2: 'Semifinals',
        3: 'Finals'
    };

    return Object.keys(rounds).sort().map(round => `
    <div class="round">
      <div class="round-title">${roundNames[round] || `Round ${round}`}</div>
      ${rounds[round].map(match => `
        <div class="match">
          <div class="team ${match.winner === match.teamA ? 'winner' : ''}">
            ${match.teamA || 'TBD'}
            ${match.scoreA !== null ? `<span class="score">${match.scoreA}</span>` : ''}
          </div>
          <div class="team ${match.winner === match.teamB ? 'winner' : ''}">
            ${match.teamB || 'TBD'}
            ${match.scoreB !== null ? `<span class="score">${match.scoreB}</span>` : ''}
          </div>
        </div>
      `).join('')}
    </div>
  `).join('');
}

/**
 * Export matches to CSV
 */
export function exportMatchesCSV(tournament, matches) {
    const headers = ['Round', 'Match', 'Team A', 'Score A', 'Team B', 'Score B', 'Winner', 'Status'];

    const rows = matches.map(match => [
        match.round,
        match.matchNumber + 1,
        match.teamA || 'TBD',
        match.scoreA !== null ? match.scoreA : '-',
        match.teamB || 'TBD',
        match.scoreB !== null ? match.scoreB : '-',
        match.winner || '-',
        match.status
    ]);

    const csv = [
        [`Tournament: ${tournament.name}`],
        [`Date: ${tournament.date}`],
        [`Location: ${tournament.location}`],
        [],
        headers,
        ...rows
    ].map(row => row.join(',')).join('\n');

    downloadFile(csv, `${tournament.name}_matches.csv`, 'text/csv');
}

/**
 * Export player statistics to CSV
 */
export function exportPlayerStatsCSV(tournament, players) {
    const headers = ['Player', 'Team', 'Number', 'Position', 'Goals', 'Assists', 'Yellow Cards', 'Red Cards', 'Minutes'];

    const rows = players.map(player => [
        player.name,
        player.teamName || '-',
        player.number,
        player.position,
        player.stats?.goals || 0,
        player.stats?.assists || 0,
        player.stats?.yellowCards || 0,
        player.stats?.redCards || 0,
        player.stats?.minutesPlayed || 0
    ]);

    const csv = [
        [`Tournament: ${tournament.name}`],
        [`Date: ${tournament.date}`],
        [],
        headers,
        ...rows
    ].map(row => row.join(',')).join('\n');

    downloadFile(csv, `${tournament.name}_player_stats.csv`, 'text/csv');
}

/**
 * Export tournament data as JSON
 */
export function exportTournamentJSON(tournament, teams, matches, players) {
    const data = {
        tournament,
        teams,
        matches,
        players,
        exportedAt: new Date().toISOString()
    };

    const json = JSON.stringify(data, null, 2);
    downloadFile(json, `${tournament.name}_data.json`, 'application/json');
}

/**
 * Generate shareable link
 */
export function generateShareableLink(tournamentId) {
    const baseUrl = window.location.origin;
    const shareUrl = `${baseUrl}/tournament/${tournamentId}/view`;

    // Copy to clipboard
    navigator.clipboard.writeText(shareUrl).then(() => {
        alert('Shareable link copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy link:', err);
        prompt('Copy this link:', shareUrl);
    });

    return shareUrl;
}

/**
 * Helper function to download file
 */
function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
