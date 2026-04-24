import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useToast } from '../components/Toast';
import { ButtonSpinner } from '../components/LoadingSpinner';

export default function ProfilePage() {
    const { user, updateProfile } = useAuth();
    const toast = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
    });

    if (!user) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await updateProfile(formData);
            toast.success('Profile updated successfully');
            setIsEditing(false);
        } catch (error) {
            toast.error(error.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 to-black text-white">
            <Header />
            <main className="flex-grow flex items-center justify-center p-6 pt-28">
                <div className="w-full max-w-lg animate-fade-in">
                    <div className="glass-card p-8 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-indigo-500/20 to-purple-500/20"></div>
                        
                        <div className="relative z-10 flex flex-col items-center mt-8">
                            <div className="w-24 h-24 rounded-full bg-indigo-600 border-4 border-slate-800 text-white flex items-center justify-center text-4xl font-bold shadow-xl mb-4">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            
                            {!isEditing ? (
                                <>
                                    <h1 className="text-3xl font-bold text-white mb-1">{user.name}</h1>
                                    <p className="text-indigo-400 font-medium mb-6 uppercase tracking-wider text-sm">{user.role || 'User'}</p>
                                    
                                    <div className="w-full bg-white/5 rounded-xl p-6 border border-white/10 text-left space-y-5 mb-6">
                                        <div>
                                            <label className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Email Address</label>
                                            <div className="text-slate-200 mt-1.5 font-medium">{user.email}</div>
                                        </div>
                                        <div>
                                            <label className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Phone Number</label>
                                            <div className="text-slate-200 mt-1.5 font-medium">{user.phone || 'Not provided'}</div>
                                        </div>
                                        <div>
                                            <label className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Account Status</label>
                                            <div className="flex items-center gap-2 mt-1.5">
                                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                                <span className="text-green-400 text-sm font-medium">Active</span>
                                            </div>
                                        </div>
                                    </div>

                                    <button 
                                        onClick={() => setIsEditing(true)}
                                        className="btn-secondary w-full py-3"
                                    >
                                        Edit Profile
                                    </button>
                                </>
                            ) : (
                                <form onSubmit={handleSubmit} className="w-full text-left space-y-5">
                                    <h2 className="text-2xl font-bold text-white mb-6 text-center">Edit Profile</h2>
                                    
                                    <div>
                                        <label className="block text-xs text-slate-500 uppercase font-semibold tracking-wider mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs text-slate-500 uppercase font-semibold tracking-wider mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs text-slate-500 uppercase font-semibold tracking-wider mb-2">Phone Number</label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                        />
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(false)}
                                            className="flex-1 px-6 py-3 border border-white/10 rounded-xl hover:bg-white/5 transition-colors font-medium"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="flex-1 btn-primary py-3 flex items-center justify-center gap-2"
                                        >
                                            {loading ? <ButtonSpinner /> : 'Save Changes'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
