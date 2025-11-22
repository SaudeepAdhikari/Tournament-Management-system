import React from 'react';
import { useNavigate } from 'react-router-dom';

// HomePage: Landing screen with premium glassmorphism design
export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-primary relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 glass-card p-12 max-w-2xl w-full mx-4 animate-scale-in">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-block mb-4">
            <div className="text-6xl mb-2">⚽</div>
          </div>
          <h1 className="text-5xl font-black text-gradient mb-3">
            Professional Tournament Management System
          </h1>

          <p className="text-sm text-slate-400 mt-2">
            Organize, track, and manage futsal tournaments with ease
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="text-3xl mb-2">🏆</div>
            <p className="text-xs text-slate-300 font-medium">Multi-Tournament</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="text-3xl mb-2">📊</div>
            <p className="text-xs text-slate-300 font-medium">Live Statistics</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="text-3xl mb-2">📱</div>
            <p className="text-xs text-slate-300 font-medium">Real-time Updates</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-primary w-full group"
          >
            <span className="flex items-center justify-center gap-2">
              🎯 Tournament Dashboard
              <span className="transform group-hover:translate-x-1 transition-transform">→</span>
            </span>
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate('/teams')}
              className="btn-secondary"
            >
              ⚡ Quick Start
            </button>

            <button
              onClick={() => navigate('/about')}
              className="btn-ghost border border-white/10"
            >
              ℹ️ About Us
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-xs text-slate-400">
            Supports 4-32 teams • Multiple formats • Export & Share
          </p>
        </div>
      </div>
    </div>
  );
}
