import React from 'react';

export default function BracketTree({ bracket, tournament, onSelectWinner }) {
    if (!bracket) return null;

    const getRoundName = (roundIndex, totalRounds) => {
        if (roundIndex === totalRounds - 1) return 'FINAL';
        if (roundIndex === totalRounds - 2) return 'SEMI FINALS';
        if (roundIndex === totalRounds - 3) return 'QUARTER FINALS';
        return `ROUND ${roundIndex + 1}`;
    };

    return (
        <div className="bracket-container">
            {/* Champion Display */}
            {bracket.champion && (
                <div className="text-center mb-12 p-8 glass-card border-4 border-yellow-500">
                    <div className="text-8xl mb-4">🏆</div>
                    <h2 className="text-5xl font-black text-gradient mb-2">CHAMPION</h2>
                    <p className="text-4xl font-bold text-white">{bracket.champion.name}</p>
                </div>
            )}

            {/* Bracket Rounds */}
            <div className="flex justify-center gap-8 overflow-x-auto pb-8">
                {bracket.rounds.map((roundMatches, roundIndex) => (
                    <div key={roundIndex} className="flex flex-col justify-around min-w-[280px]">
                        {/* Round Header */}
                        <div className="text-center mb-6">
                            <h3 className="text-xl font-bold text-white mb-1">
                                {getRoundName(roundIndex, bracket.totalRounds)}
                            </h3>
                            {roundIndex + 1 === bracket.currentRound && (
                                <span className="badge badge-success animate-pulse text-xs">Current</span>
                            )}
                        </div>

                        {/* Matches */}
                        <div className="flex flex-col justify-around flex-1 gap-8">
                            {roundMatches.map((match, matchIndex) => (
                                <div key={match.id} className="relative">
                                    {/* Match Box */}
                                    <div className="glass-card border-2 border-white/20 rounded-lg overflow-hidden min-w-[250px]">
                                        {match.isBye ? (
                                            <div className="p-4 text-center">
                                                <div className="text-white font-semibold mb-1">{match.team1.name}</div>
                                                <div className="text-xs text-yellow-400 font-bold">BYE</div>
                                            </div>
                                        ) : (
                                            <div>
                                                {/* Team 1 */}
                                                <div
                                                    onClick={() => !match.winner && onSelectWinner && onSelectWinner(match.id, match.team1)}
                                                    className={`p-3 border-b border-white/10 cursor-pointer transition-all ${match.winner?.id === match.team1.id
                                                            ? 'bg-green-500/30 border-l-4 border-l-green-500'
                                                            : 'hover:bg-white/5'
                                                        }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-white font-medium text-sm">{match.team1.name}</span>
                                                        {match.winner?.id === match.team1.id && (
                                                            <span className="text-green-400 text-lg">✓</span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Team 2 */}
                                                <div
                                                    onClick={() => !match.winner && onSelectWinner && onSelectWinner(match.id, match.team2)}
                                                    className={`p-3 cursor-pointer transition-all ${match.winner?.id === match.team2.id
                                                            ? 'bg-green-500/30 border-l-4 border-l-green-500'
                                                            : 'hover:bg-white/5'
                                                        }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-white font-medium text-sm">{match.team2.name}</span>
                                                        {match.winner?.id === match.team2.id && (
                                                            <span className="text-green-400 text-lg">✓</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Connector Line to Next Round */}
                                    {match.winner && roundIndex < bracket.totalRounds - 1 && (
                                        <div className="absolute top-1/2 -right-8 w-8 h-0.5 bg-white/30 transform -translate-y-1/2"></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Soccer Ball in Center (for visual appeal) */}
            {!bracket.champion && bracket.rounds.length > 1 && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl opacity-10 pointer-events-none">
                    ⚽
                </div>
            )}
        </div>
    );
}
