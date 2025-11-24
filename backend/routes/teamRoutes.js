const express = require('express');
const router = express.Router();
const Team = require('../models/Team');

// @desc    Get teams for a tournament
// @route   GET /api/teams?tournamentId=...
router.get('/', async (req, res) => {
    try {
        const { tournamentId } = req.query;
        if (!tournamentId) {
            return res.status(400).json({ message: 'Tournament ID is required' });
        }
        const teams = await Team.find({ tournamentId });
        res.status(200).json(teams);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Create team
// @route   POST /api/teams
router.post('/', async (req, res) => {
    try {
        const team = await Team.create(req.body);
        res.status(201).json(team);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Update team
// @route   PUT /api/teams/:id
router.put('/:id', async (req, res) => {
    try {
        const team = await Team.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }
        res.status(200).json(team);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Delete team
// @route   DELETE /api/teams/:id
router.delete('/:id', async (req, res) => {
    try {
        const team = await Team.findByIdAndDelete(req.params.id);
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }
        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
