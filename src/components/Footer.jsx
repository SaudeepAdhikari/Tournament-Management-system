import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Footer() {
    const navigate = useNavigate();

    return (
        <footer className="relative z-10 bg-slate-900/50 backdrop-blur-md border-t border-white/10 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="text-3xl">⚽</div>
                            <span className="text-xl font-bold text-white">KickOff Arena</span>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-md mb-6">
                            The ultimate platform for organizing and managing professional futsal tournaments.
                            Experience real-time stats, dynamic brackets, and seamless team management.
                        </p>
                        <div className="flex gap-4">
                            {['twitter', 'facebook', 'instagram', 'github'].map((social) => (
                                <button
                                    key={social}
                                    className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200 hover:scale-110"
                                >
                                    <span className="sr-only">{social}</span>
                                    <div className="w-5 h-5 bg-current opacity-50" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-6">Quick Links</h3>
                        <ul className="space-y-4">
                            {[
                                { name: 'Home', path: '/' },
                                { name: 'Register Team', path: '/teams' },
                                { name: 'Tournament Bracket', path: '/bracket' },
                                { name: 'Live Dashboard', path: '/dashboard' },
                            ].map((link) => (
                                <li key={link.path}>
                                    <button
                                        onClick={() => navigate(link.path)}
                                        className="text-slate-400 hover:text-indigo-400 text-sm transition-colors duration-200 flex items-center gap-2 group"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/0 group-hover:bg-indigo-500 transition-all duration-200" />
                                        {link.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="text-white font-semibold mb-6">Resources</h3>
                        <ul className="space-y-4">
                            {[
                                { name: 'About Us', path: '/about' },
                                { name: 'Rules & Regulations', path: '#' },
                                { name: 'Privacy Policy', path: '#' },
                                { name: 'Terms of Service', path: '#' },
                            ].map((link) => (
                                <li key={link.name}>
                                    <button
                                        onClick={() => link.path !== '#' && navigate(link.path)}
                                        className="text-slate-400 hover:text-indigo-400 text-sm transition-colors duration-200"
                                    >
                                        {link.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-slate-500 text-xs">
                        <p>© 2025 KickOff Arena. All rights reserved.</p>
                        <span className="hidden md:block text-slate-700">|</span>
                        <p>
                            Designed and developed by{' '}
                            <a
                                href="https://saudeepadhikari.com.np/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
                            >
                                Saudeep Adhikari
                            </a>
                        </p>
                    </div>
                    <div className="flex items-center gap-6">
                        <span className="flex items-center gap-2 text-xs text-slate-500">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            System Operational
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
