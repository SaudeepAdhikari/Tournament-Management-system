const express = require('express');
const router = express.Router();
const Match = require('../models/Match');

// @desc    Get matches for a tournament
// @route   GET /api/matches?tournamentId=...
router.get('/', async (req, res) => {
    try {
        const { tournamentId } = req.query;
        if (!tournamentId) {
            return res.status(400).json({ message: 'Tournament ID is required' });
        }
        const matches = await Match.find({ tournamentId }).sort({ round: 1, matchNumber: 1 });
        res.status(200).json(matches);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Create match
// @route   POST /api/matches
router.post('/', async (req, res) => {
    try {
        const match = await Match.create(req.body);
        res.status(201).json(match);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Update match (score, etc)
// @route   PUT /api/matches/:id
router.put('/:id', async (req, res) => {
    try {
        const match = await Match.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!match) {
            return res.status(404).json({ message: 'Match not found' });
        }
        res.status(200).json(match);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
