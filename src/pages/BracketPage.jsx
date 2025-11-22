import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MatchCard from '../components/MatchCard';

// BracketPage: reads teams from navigation state or localStorage, builds simple 8-team bracket
export default function BracketPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // read teams from navigation state, fallback to localStorage
  const initialTeams = useMemo(() => {
    const navTeams = location.state && location.state.teams ? location.state.teams : null;
    if (navTeams && navTeams.length) return navTeams.slice(0, 8);
    try {
      const raw = localStorage.getItem('tournament_teams');
      if (raw) return JSON.parse(raw).slice(0, 8);
    } catch (e) { }
    return [];
  }, [location.state]);

  useEffect(() => {
    if (!initialTeams || initialTeams.length === 0) {
      // nothing to show — send back
      // navigate('/teams');
    }
  }, [initialTeams, navigate]);

  // pad to 8
  const teams = useMemo(() => {
    const t = [...initialTeams];
    while (t.length < 8) t.push('TBD');
    return t;
  }, [initialTeams]);

  // matches state: winners for matches 0..6 (4 quarters : 0-3, semis:4-5, final:6)
  const [winners, setWinners] = useState(() => Array(7).fill(null));

  function setWinner(matchIdx, winnerName) {
    setWinners(prev => {
      const copy = [...prev];
      copy[matchIdx] = winnerName;

      // auto-advance: if quarterfinal (0-3) -> set semifinal slots
      if (matchIdx >= 0 && matchIdx <= 3) {
        const semiIndex = 4 + Math.floor(matchIdx / 2);
        // set the appropriate semifinal team
        const slot = matchIdx % 2 === 0 ? 0 : 1; // even maps to top
        // If both quarter winners available, the semifinal winner remains null until user picks
        // We store winners[semiIndex] as null until selected.
      }

      return copy;
    });
  }

  // helper to compute match teams given current winners and base teams
  function getMatchTeams(idx) {
    // quarter finals mapping
    if (idx >= 0 && idx <= 3) {
      const a = teams[idx * 2];
      const b = teams[idx * 2 + 1];
      return [a, b];
    }

    // semifinals
    if (idx === 4) {
      return [winners[0], winners[1]]; // winners of QF0 and QF1
    }
    if (idx === 5) {
      return [winners[2], winners[3]]; // winners of QF2 and QF3
    }

    // final
    if (idx === 6) {
      return [winners[4], winners[5]];
    }

    return [null, null];
  }

  // When a winner is chosen for a match, it may allow the next match to show that team
  function handleSelectWinner(matchIdx, teamName) {
    setWinners(prev => {
      const copy = [...prev];
      copy[matchIdx] = teamName;

      // advance to next round where appropriate
      if (matchIdx >= 0 && matchIdx <= 3) {
        // quarter -> semifinal mapping
        const semiIdx = 4 + Math.floor(matchIdx / 2);
        // set placeholder into semifinal slot if empty
        if (!copy[semiIdx]) {
          // semifinal will still be unresolved until user selects winner there
          // but we want the available teams to appear, which is computed dynamically
        }
      }

      if (matchIdx >= 4 && matchIdx <= 5) {
        // semifinal -> final
        const finalIdx = 6;
        if (!copy[finalIdx]) {
          // computed dynamically
        }
      }

      return copy;
    });
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-dark text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="glass-card p-6 mb-6 animate-slide-in-up">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gradient mb-2">🏆 Tournament Bracket</h2>
              <p className="text-slate-400">Select winners to advance through the rounds</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/teams')}
                className="btn-ghost"
              >
                ← Back
              </button>
              <button
                onClick={() => navigate('/')}
                className="btn-secondary"
              >
                🏠 Home
              </button>
            </div>
          </div>
        </div>

        {/* Bracket Grid */}
        <div className="grid grid-cols-3 gap-8 items-start">
          {/* Left pole (A): quarters 0 and 1, semifinal 4 */}
          <div className="space-y-6 animate-slide-in-left">
            <div className="text-center">
              <span className="badge badge-info">Pole A</span>
            </div>
            <div className="space-y-4">
              <MatchCard
                matchId={0}
                teamA={getMatchTeams(0)[0]}
                teamB={getMatchTeams(0)[1]}
                winner={winners[0]}
                onSelectWinner={handleSelectWinner}
              />

              <MatchCard
                matchId={1}
                teamA={getMatchTeams(1)[0]}
                teamB={getMatchTeams(1)[1]}
                winner={winners[1]}
                onSelectWinner={handleSelectWinner}
              />
            </div>
          </div>

          {/* Center: semifinals and final */}
          <div className="flex flex-col items-center justify-start gap-8 animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <div className="text-center">
              <span className="badge badge-warning">Semifinal A</span>
            </div>
            <div className="w-64">
              <MatchCard
                matchId={4}
                teamA={getMatchTeams(4)[0]}
                teamB={getMatchTeams(4)[1]}
                winner={winners[4]}
                onSelectWinner={handleSelectWinner}
              />
            </div>

            <div className="h-6" />

            <div className="text-center">
              <span className="badge bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 border-yellow-500/30 animate-pulse-glow">
                🏆 Championship Final
              </span>
            </div>
            <div className="w-80">
              <MatchCard
                matchId={6}
                teamA={getMatchTeams(6)[0]}
                teamB={getMatchTeams(6)[1]}
                winner={winners[6]}
                onSelectWinner={handleSelectWinner}
              />
            </div>
          </div>

          {/* Right pole (B): quarters 2 and 3, semifinal 5 */}
          <div className="space-y-6 animate-slide-in-right">
            <div className="text-center">
              <span className="badge badge-info">Pole B</span>
            </div>
            <div className="space-y-4">
              <MatchCard
                matchId={2}
                teamA={getMatchTeams(2)[0]}
                teamB={getMatchTeams(2)[1]}
                winner={winners[2]}
                onSelectWinner={handleSelectWinner}
              />

              <MatchCard
                matchId={3}
                teamA={getMatchTeams(3)[0]}
                teamB={getMatchTeams(3)[1]}
                winner={winners[3]}
                onSelectWinner={handleSelectWinner}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
