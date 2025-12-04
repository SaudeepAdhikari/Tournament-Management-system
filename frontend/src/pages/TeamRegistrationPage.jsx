import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '../components/Toast';
import LoadingSpinner from '../components/LoadingSpinner';

export default function TeamRegistrationPage() {
    const { tournamentId } = useParams();
    const navigate = useNavigate();
    const toast = useToast();

    const [tournament, setTournament] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        captain: '',
        contact: ''
    });
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        async function loadTournament() {
            try {
                const res = await fetch(`http://localhost:5000/api/tournaments/${tournamentId}`);
                if (!res.ok) throw new Error('Failed to load tournament');
                const data = await res.json();
                setTournament(data);
            } catch (error) {
                toast.error('Failed to load tournament details');
                navigate('/dashboard');
            } finally {
                setLoading(false);
            }
        }
        loadTournament();
    }, [tournamentId, navigate, toast]);

    async function handlePaymentAndRegister(e) {
        e.preventDefault();

        if (!formData.name || !formData.captain || !formData.contact) {
            toast.error('Please fill in all fields');
            return;
        }

        setProcessing(true);
        try {
            // 1. Create Team (Pending Payment)
            const teamRes = await fetch('http://localhost:5000/api/teams', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    tournamentId,
                    status: 'registered',
                    paymentStatus: 'pending'
                })
            });

            if (!teamRes.ok) throw new Error('Failed to register team');
            const team = await teamRes.json();

            // 2. Initiate Payment
            const paymentRes = await fetch('http://localhost:5000/api/payments/initiate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    teamId: team._id,
                    amount: 1000 // Example amount
                })
            });

            if (!paymentRes.ok) throw new Error('Failed to initiate payment');
            const paymentData = await paymentRes.json();

            // 3. Simulate Payment Success (Mock)
            // In real app, we would redirect to paymentData.paymentUrl
            // Here we just call verify directly to simulate success

            const verifyRes = await fetch('http://localhost:5000/api/payments/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    teamId: team._id,
                    transactionId: paymentData.transactionId,
                    status: 'success'
                })
            });

            if (!verifyRes.ok) throw new Error('Payment verification failed');

            toast.success('Registration & Payment Successful!');
            navigate(`/tournament/${tournamentId}`);

        } catch (error) {
            console.error(error);
            toast.error(error.message || 'Registration failed');
        } finally {
            setProcessing(false);
        }
    }

    if (loading) return <LoadingSpinner />;
    if (!tournament) return null;

    return (
        <div className="min-h-screen bg-gradient-dark p-6 flex items-center justify-center">
            <div className="glass-card p-8 max-w-md w-full animate-scale-in">
                <h2 className="text-3xl font-bold text-gradient mb-2">Team Registration</h2>
                <p className="text-slate-400 mb-6">Join {tournament.name}</p>

                <form onSubmit={handlePaymentAndRegister} className="space-y-4">
                    <div>
                        <label className="block text-slate-400 text-sm mb-1">Team Name</label>
                        <input
                            type="text"
                            className="input-glass w-full"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. Thunder FC"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-400 text-sm mb-1">Captain Name</label>
                        <input
                            type="text"
                            className="input-glass w-full"
                            value={formData.captain}
                            onChange={e => setFormData({ ...formData, captain: e.target.value })}
                            placeholder="e.g. John Doe"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-400 text-sm mb-1">Contact Number</label>
                        <input
                            type="tel"
                            className="input-glass w-full"
                            value={formData.contact}
                            onChange={e => setFormData({ ...formData, contact: e.target.value })}
                            placeholder="e.g. 9800000000"
                        />
                    </div>

                    <div className="pt-4 border-t border-white/10">
                        <div className="flex justify-between text-white mb-4">
                            <span>Entry Fee</span>
                            <span className="font-bold text-green-400">Rs. 1000</span>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="btn-primary w-full py-3 text-lg"
                        >
                            {processing ? 'Processing Payment...' : 'Pay & Register'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate(`/tournament/${tournamentId}`)}
                            className="btn-ghost w-full mt-2"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
