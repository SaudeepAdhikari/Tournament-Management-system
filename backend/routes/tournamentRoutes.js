const express = require('express');
const router = express.Router();
const Tournament = require('../models/Tournament');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get all tournaments
// @route   GET /api/tournaments
// @route   GET /api/tournaments
router.get('/', async (req, res) => {
    try {
        let query = {};
        if (req.query.user) {
            query.createdBy = req.query.user;
        }
        const tournaments = await Tournament.find(query).sort({ createdAt: -1 });
        res.status(200).json(tournaments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get single tournament
// @route   GET /api/tournaments/:id
router.get('/:id', async (req, res) => {
    try {
        const tournament = await Tournament.findById(req.params.id);
        if (!tournament) {
            return res.status(404).json({ message: 'Tournament not found' });
        }
        res.status(200).json(tournament);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Create tournament
// @route   POST /api/tournaments
// @desc    Create tournament
// @route   POST /api/tournaments
router.post('/', protect, async (req, res) => {
    try {
        const tournament = await Tournament.create({
            ...req.body,
            createdBy: req.user._id
        });
        res.status(201).json(tournament);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Update tournament
// @route   PUT /api/tournaments/:id
// @desc    Update tournament
// @route   PUT /api/tournaments/:id
router.put('/:id', protect, async (req, res) => {
    try {
        const tournament = await Tournament.findById(req.params.id);

        if (!tournament) {
            return res.status(404).json({ message: 'Tournament not found' });
        }

        // Check if user is owner
        if (tournament.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'User not authorized' });
        }

        const updatedTournament = await Tournament.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json(updatedTournament);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Delete tournament
// @route   DELETE /api/tournaments/:id
// @desc    Delete tournament
// @route   DELETE /api/tournaments/:id
router.delete('/:id', protect, async (req, res) => {
    try {
        const tournament = await Tournament.findById(req.params.id);

        if (!tournament) {
            return res.status(404).json({ message: 'Tournament not found' });
        }

        // Check if user is owner
        if (tournament.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await tournament.deleteOne();
        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
