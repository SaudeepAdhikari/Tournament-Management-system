const express = require('express');
const router = express.Router();
const Team = require('../models/Team');

// @desc    Initiate payment (Mock)
// @route   POST /api/payments/initiate
router.post('/initiate', async (req, res) => {
    try {
        const { teamId, amount } = req.body;

        // In a real app, we would call Stripe/Khalti API here
        // For now, we just return a mock transaction ID
        const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        res.status(200).json({
            success: true,
            transactionId,
            paymentUrl: `http://localhost:3000/payment/mock-gateway?txn=${transactionId}&team=${teamId}&amount=${amount}`
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Verify payment (Mock Webhook)
// @route   POST /api/payments/verify
router.post('/verify', async (req, res) => {
    try {
        const { teamId, transactionId, status } = req.body;

        if (status === 'success') {
            const team = await Team.findById(teamId);
            if (team) {
                team.paymentStatus = 'paid';
                team.status = 'approved'; // Auto-approve if paid
                team.transactionId = transactionId;
                await team.save();

                return res.status(200).json({ success: true, team });
            }
        }

        res.status(400).json({ success: false, message: 'Payment failed or team not found' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
