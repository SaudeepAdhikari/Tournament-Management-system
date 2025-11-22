import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import TeamEntryPage from './pages/TeamEntryPage';
import BracketPage from './pages/BracketPage';
import AboutPage from './pages/AboutPage';
import TournamentDashboard from './pages/TournamentDashboard';
import CreateTournamentPage from './pages/CreateTournamentPage';
import TournamentDetailPage from './pages/TournamentDetailPage';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/teams" element={<TeamEntryPage />} />
          <Route path="/bracket" element={<BracketPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/dashboard" element={<TournamentDashboard />} />
          <Route path="/tournament/create" element={<CreateTournamentPage />} />
          <Route path="/tournament/:tournamentId" element={<TournamentDetailPage />} />
        </Routes>
      </div>
    </ErrorBoundary>
  );
}

export default App;
