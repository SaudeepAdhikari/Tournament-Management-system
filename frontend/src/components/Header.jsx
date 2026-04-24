import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { user, logout } = useAuth();

    const isActive = (path) => location.pathname === path;

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProfileDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Teams', path: '/teams' },
        { name: 'About', path: '/about' },
    ];

    const handleLogout = () => {
        logout();
        setIsMobileMenuOpen(false);
        navigate('/login');
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <div
                        className="flex items-center gap-3 cursor-pointer group"
                        onClick={() => navigate('/')}
                    >
                        <div className="text-3xl transform group-hover:scale-110 transition-transform duration-200">⚽</div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 group-hover:to-indigo-400 transition-all duration-300">
                            KickOff Arena
                        </span>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <button
                                key={link.path}
                                onClick={() => navigate(link.path)}
                                className={`text-sm font-medium transition-all duration-200 ${isActive(link.path)
                                    ? 'text-indigo-400'
                                    : 'text-slate-300 hover:text-white hover:scale-105'
                                    }`}
                            >
                                {link.name}
                            </button>
                        ))}

                        {user ? (
                            <div className="flex items-center gap-4 ml-4">
                                <button
                                    onClick={() => navigate('/dashboard')}
                                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transform hover:-translate-y-0.5 transition-all duration-200"
                                >
                                    Dashboard
                                </button>
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-sm text-slate-300 font-medium">Hi, {user.name}</span>
                                        <svg className={`w-4 h-4 text-slate-400 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                    </button>
                                    {isProfileDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-white/10 rounded-xl shadow-xl overflow-hidden py-1 z-50">
                                            <button
                                                onClick={() => {
                                                    setIsProfileDropdownOpen(false);
                                                    navigate('/profile');
                                                }}
                                                className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-2"
                                            >
                                                👤 Profile
                                            </button>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2"
                                            >
                                                🚪 Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => navigate('/login')}
                                className="ml-4 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transform hover:-translate-y-0.5 transition-all duration-200"
                            >
                                Login
                            </button>
                        )}
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-slate-300 hover:text-white"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isMobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-slate-900/95 backdrop-blur-xl border-b border-white/10 animate-slide-in-up">
                    <div className="px-4 pt-2 pb-6 space-y-2">
                        {navLinks.map((link) => (
                            <button
                                key={link.path}
                                onClick={() => {
                                    navigate(link.path);
                                    setIsMobileMenuOpen(false);
                                }}
                                className={`block w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-colors ${isActive(link.path)
                                    ? 'bg-indigo-500/20 text-indigo-300'
                                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                {link.name}
                            </button>
                        ))}

                        {user ? (
                            <>
                                <div className="px-4 py-2 text-sm text-slate-400 flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    Signed in as {user.name}
                                </div>
                                <button
                                    onClick={() => {
                                        navigate('/dashboard');
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="block w-full mt-2 px-4 py-3 bg-indigo-600 text-white text-center font-semibold rounded-xl shadow-lg"
                                >
                                    Dashboard
                                </button>
                                <button
                                    onClick={() => {
                                        navigate('/profile');
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="block w-full mt-2 px-4 py-3 border border-white/20 text-slate-300 hover:bg-white/5 hover:text-white text-center font-medium rounded-xl"
                                >
                                    Profile
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full mt-2 px-4 py-3 border border-red-500/20 text-red-400 hover:bg-red-500/10 text-center font-medium rounded-xl"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => {
                                    navigate('/login');
                                    setIsMobileMenuOpen(false);
                                }}
                                className="block w-full mt-4 px-4 py-3 bg-indigo-600 text-white text-center font-semibold rounded-xl shadow-lg"
                            >
                                Login
                            </button>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
