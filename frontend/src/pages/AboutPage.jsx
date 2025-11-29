import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-slate-900 to-black p-6">
      <div className="max-w-4xl w-full rounded-2xl border border-white/20 p-10 shadow-xl backdrop-blur-lg bg-white/5">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-white mb-2">About KickOff Arena</h1>
          <p className="text-indigo-200/80 text-lg">Professional Tournament Management System</p>
        </div>

        <div className="space-y-6 text-white/90">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">Our Mission</h2>
            <p className="text-slate-300 leading-relaxed">
              KickOff Arena is dedicated to providing a comprehensive, easy-to-use tournament
              management system for futsal organizers, teams, and players. We believe in making
              tournament organization seamless and accessible to everyone.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">Features</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">✓</span>
                <span>Dynamic bracket generation (4-32 teams)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">✓</span>
                <span>Real-time match scoring</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">✓</span>
                <span>Player roster management</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">✓</span>
                <span>Tournament statistics & analytics</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">✓</span>
                <span>Multiple tournament formats</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">✓</span>
                <span>Export & sharing capabilities</span>
              </li>
            </ul>
          </section>



          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">Contact</h2>
            <p className="text-slate-300 leading-relaxed">
              For support, feedback, or partnership inquiries, please reach out to us at{' '}
              <a href="mailto:support@kickoffarena.com" className="text-indigo-400 hover:text-indigo-300 underline">
                support@kickoffarena.com
              </a>
            </p>
          </section>
        </div>

        <div className="mt-10 flex justify-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium shadow-md transform transition hover:scale-105"
          >
            Back to Home
          </button>
          <button
            onClick={() => navigate('/teams')}
            className="border border-white/20 hover:bg-white/5 text-white px-6 py-3 rounded-lg font-medium transform transition hover:scale-105"
          >
            Create Tournament
          </button>
        </div>
      </div>
    </div>
  );
}
