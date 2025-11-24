const express = require('express');
const router = express.Router();
const Player = require('../models/Player');

// @desc    Get players for a team
// @route   GET /api/players?teamId=...
router.get('/', async (req, res) => {
    try {
        const { teamId } = req.query;
        let query = {};
        if (teamId) {
            query.teamId = teamId;
        }
        const players = await Player.find(query);
        res.status(200).json(players);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Create player
// @route   POST /api/players
router.post('/', async (req, res) => {
    try {
        const player = await Player.create(req.body);
        res.status(201).json(player);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Update player stats
// @route   PUT /api/players/:id
router.put('/:id', async (req, res) => {
    try {
        const player = await Player.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!player) {
            return res.status(404).json({ message: 'Player not found' });
        }
        res.status(200).json(player);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
