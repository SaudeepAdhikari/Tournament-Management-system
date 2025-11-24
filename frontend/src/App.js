import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import TeamEntryPage from './pages/TeamEntryPage';
import BracketPage from './pages/BracketPage';
import AboutPage from './pages/AboutPage';
import TournamentDashboard from './pages/TournamentDashboard';
import CreateTournamentPage from './pages/CreateTournamentPage';
import TournamentDetailPage from './pages/TournamentDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/teams" element={<TeamEntryPage />} />
            <Route path="/bracket" element={<BracketPage />} />
            <Route path="/about" element={<AboutPage />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <TournamentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tournament/create"
              element={
                <ProtectedRoute adminOnly={true}>
                  <CreateTournamentPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tournament/:tournamentId"
              element={
                <ProtectedRoute>
                  <TournamentDetailPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
