const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const Tournament = require('../models/Tournament');
const { protect } = require('../middleware/authMiddleware');

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
        const { tournamentId } = req.body;
        const tournament = await Tournament.findById(tournamentId);

        if (!tournament) {
            return res.status(404).json({ message: 'Tournament not found' });
        }

        // Optional: Check if tournament is still accepting teams
        const teamCount = await Team.countDocuments({ tournamentId });
        if (teamCount >= tournament.teamCount) {
            return res.status(400).json({ message: 'Tournament is full' });
        }

        const team = await Team.create(req.body);
        res.status(201).json(team);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Update team
// @route   PUT /api/teams/:id
router.put('/:id', protect, async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        const tournament = await Tournament.findById(team.tournamentId);
        if (!tournament) {
            return res.status(404).json({ message: 'Tournament not found' });
        }

        // Check if user is owner
        if (tournament.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'User not authorized' });
        }

        const updatedTeam = await Team.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json(updatedTeam);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Delete team
// @route   DELETE /api/teams/:id
router.delete('/:id', protect, async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        const tournament = await Tournament.findById(team.tournamentId);
        if (!tournament) {
            return res.status(404).json({ message: 'Tournament not found' });
        }

        // Check if user is owner
        if (tournament.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await team.deleteOne();
        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
