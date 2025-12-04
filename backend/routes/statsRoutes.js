const express = require('express');
const router = express.Router();
const Player = require('../models/Player');
const Team = require('../models/Team');

// @desc    Get top scorers
// @route   GET /api/stats/top-scorers?tournamentId=...
router.get('/top-scorers', async (req, res) => {
    try {
        const { tournamentId, limit = 10 } = req.query;

        // Find all teams in the tournament first
        const teams = await Team.find({ tournamentId });
        const teamIds = teams.map(t => t._id);

        // Find players in those teams and sort by goals
        const players = await Player.find({ teamId: { $in: teamIds } })
            .sort({ 'stats.goals': -1 })
            .limit(parseInt(limit))
            .populate('teamId', 'name');

        res.status(200).json(players);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get top assists
// @route   GET /api/stats/top-assists?tournamentId=...
router.get('/top-assists', async (req, res) => {
    try {
        const { tournamentId, limit = 10 } = req.query;

        const teams = await Team.find({ tournamentId });
        const teamIds = teams.map(t => t._id);

        const players = await Player.find({ teamId: { $in: teamIds } })
            .sort({ 'stats.assists': -1 })
            .limit(parseInt(limit))
            .populate('teamId', 'name');

        res.status(200).json(players);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get fair play (least cards) - simplistic view
// @route   GET /api/stats/fair-play?tournamentId=...
router.get('/fair-play', async (req, res) => {
    try {
        const { tournamentId, limit = 10 } = req.query;

        const teams = await Team.find({ tournamentId });
        const teamIds = teams.map(t => t._id);

        // Sort by red cards then yellow cards (ascending)
        const players = await Player.find({ teamId: { $in: teamIds } })
            .sort({ 'stats.redCards': 1, 'stats.yellowCards': 1 })
            .limit(parseInt(limit))
            .populate('teamId', 'name');

        res.status(200).json(players);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
