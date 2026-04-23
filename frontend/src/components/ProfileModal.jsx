import React, { useState, useEffect } from 'react';
import { updateProfile, updatePassword } from '../backend/firebase/database';
import { useToast } from './Toast';
// Updated: 2025-12-04 22:42:00 - Fixed centering and click-to-close

export default function ProfileModal({ isOpen, onClose, user, onUpdate }) {
    const [activeTab, setActiveTab] = useState('profile');
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        avatar: user?.avatar || '',
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    // Sync form data with user prop whenever modal opens or user changes
    useEffect(() => {
        if (isOpen && user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                avatar: user.avatar || '',
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        }
    }, [isOpen, user]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const updatedUser = await updateProfile({
                name: formData.name,
                email: formData.email,
                avatar: formData.avatar
            }, user.token);
            onUpdate(updatedUser);
            toast.success('Profile updated successfully');
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        setLoading(true);
        try {
            await updatePassword({
                oldPassword: formData.oldPassword,
                newPassword: formData.newPassword
            }, user.token);
            toast.success('Password updated successfully');
            setFormData({ ...formData, oldPassword: '', newPassword: '', confirmPassword: '' });
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Backdrop - clicking this closes the modal */}
            <div
                className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />

            {/* Modal Content - centered and above backdrop */}
            <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
                <div
                    className="w-full max-w-md p-6 rounded-3xl border border-white/20 shadow-2xl animate-scale-in pointer-events-auto"
                    style={{
                        background: 'linear-gradient(to bottom right, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.95))',
                        backdropFilter: 'blur(20px)'
                    }}
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-white">
                            {activeTab === 'profile' ? 'Edit Profile' : 'Change Password'}
                        </h2>
                        <button onClick={onClose} className="text-slate-400 hover:text-white">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex mb-6 bg-white/5 rounded-lg p-1">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'profile' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                        >
                            Profile Details
                        </button>
                        <button
                            onClick={() => setActiveTab('password')}
                            className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'password' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                        >
                            Security
                        </button>
                    </div>

                    {activeTab === 'profile' ? (
                        <form onSubmit={handleProfileUpdate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="input-glass"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="input-glass"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Avatar URL</label>
                                <input
                                    type="url"
                                    name="avatar"
                                    value={formData.avatar}
                                    onChange={handleChange}
                                    className="input-glass"
                                    placeholder="https://example.com/avatar.jpg"
                                />
                            </div>
                            <button type="submit" disabled={loading} className="btn-primary w-full mt-4">
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handlePasswordUpdate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Current Password</label>
                                <input
                                    type="password"
                                    name="oldPassword"
                                    value={formData.oldPassword}
                                    onChange={handleChange}
                                    className="input-glass"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">New Password</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    className="input-glass"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Confirm New Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="input-glass"
                                    required
                                />
                            </div>
                            <button type="submit" disabled={loading} className="btn-primary w-full mt-4">
                                {loading ? 'Updating...' : 'Update Password'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </>
    );
}
