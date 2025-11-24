import React from 'react';

export default function PrintableTiesheet({ tournament, bracket }) {
    if (!bracket) return null;

    const getRoundName = (roundIndex, totalRounds) => {
        if (roundIndex === totalRounds - 1) return 'FINAL';
        if (roundIndex === totalRounds - 2) return 'SEMI FINALS';
        if (roundIndex === totalRounds - 3) return 'QUARTER FINALS';
        return `ROUND ${roundIndex + 1}`;
    };

    return (
        <div className="bg-white text-black p-12 min-h-screen" style={{ fontFamily: 'Arial, sans-serif' }}>
            {/* Header */}
            <div className="text-center mb-12 border-b-4 border-black pb-6">
                <h1 className="text-5xl font-black mb-2" style={{ letterSpacing: '2px' }}>
                    TIE SHEET
                </h1>
                <h2 className="text-3xl font-bold mb-3">{tournament.name}</h2>
                <div className="flex justify-center gap-8 text-lg">
                    <div><strong>Date:</strong> {tournament.date}</div>
                    <div><strong>Location:</strong> {tournament.location}</div>
                    <div><strong>Format:</strong> {tournament.format.replace('-', ' ').toUpperCase()}</div>
                </div>
            </div>

            {/* Champion Display */}
            {bracket.champion && (
                <div className="text-center mb-12 p-8 border-4 border-black bg-yellow-100">
                    <div className="text-6xl mb-4">🏆</div>
                    <h2 className="text-4xl font-black mb-2">CHAMPION</h2>
                    <p className="text-3xl font-bold">{bracket.champion.name}</p>
                </div>
            )}

            {/* Rounds */}
            <div className="space-y-16">
                {bracket.rounds.map((roundMatches, roundIndex) => (
                    <div key={roundIndex}>
                        {/* Round Header */}
                        <div className="mb-8">
                            <h3 className="text-3xl font-black border-b-2 border-black pb-2 inline-block">
                                {getRoundName(roundIndex, bracket.totalRounds)}
                            </h3>
                        </div>

                        {/* Matches Grid */}
                        <div className="grid grid-cols-2 gap-8">
                            {roundMatches.map((match, matchIndex) => (
                                <div key={match.id} className="relative">
                                    {/* Match Box */}
                                    <div className="border-4 border-black bg-white">
                                        {/* Match Number */}
                                        <div className="bg-black text-white px-4 py-2 font-bold text-center">
                                            MATCH {matchIndex + 1}
                                        </div>

                                        {match.isBye ? (
                                            <div className="p-6 text-center">
                                                <div className="text-2xl font-bold mb-2">{match.team1.name}</div>
                                                <div className="bg-yellow-200 border-2 border-yellow-600 px-4 py-2 inline-block font-bold">
                                                    BYE - AUTO ADVANCE
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="p-6">
                                                {/* Team 1 */}
                                                <div className={`flex items-center justify-between p-4 border-2 mb-4 ${match.winner?.id === match.team1.id
                                                    ? 'border-green-600 bg-green-100'
                                                    : 'border-gray-400'
                                                    }`}>
                                                    <span className="text-xl font-bold">{match.team1.name}</span>
                                                    {match.winner?.id === match.team1.id && (
                                                        <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                                                            ✓
                                                        </div>
                                                    )}
                                                    {!match.winner && (
                                                        <div className="w-10 h-10 border-2 border-gray-400 rounded-full"></div>
                                                    )}
                                                </div>

                                                {/* VS */}
                                                <div className="text-center font-black text-xl mb-4 text-gray-500">
                                                    VS
                                                </div>

                                                {/* Team 2 */}
                                                <div className={`flex items-center justify-between p-4 border-2 ${match.winner?.id === match.team2.id
                                                    ? 'border-green-600 bg-green-100'
                                                    : 'border-gray-400'
                                                    }`}>
                                                    <span className="text-xl font-bold">{match.team2.name}</span>
                                                    {match.winner?.id === match.team2.id && (
                                                        <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                                                            ✓
                                                        </div>
                                                    )}
                                                    {!match.winner && (
                                                        <div className="w-10 h-10 border-2 border-gray-400 rounded-full"></div>
                                                    )}
                                                </div>

                                                {/* Winner Advances */}
                                                {match.winner && roundIndex < bracket.totalRounds - 1 && (
                                                    <div className="mt-4 text-center">
                                                        <div className="inline-block bg-blue-600 text-white px-4 py-2 font-bold">
                                                            → ADVANCES TO {getRoundName(roundIndex + 1, bracket.totalRounds)}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Arrow to next round */}
                                    {match.winner && roundIndex < bracket.totalRounds - 1 && (
                                        <div className="absolute -right-4 top-1/2 transform -translate-y-1/2">
                                            <div className="text-4xl text-blue-600">→</div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="mt-16 pt-8 border-t-2 border-black text-center text-sm text-gray-600">
                <p>Generated by Tournament Management System for "{tournament.name}"</p>
                <p className="mt-1">Date Generated: {new Date().toLocaleDateString()}</p>
            </div>
        </div>
    );
}
