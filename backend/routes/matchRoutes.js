const express = require('express');
const router = express.Router();
const Match = require('../models/Match');
const Tournament = require('../models/Tournament');
const { protect } = require('../middleware/authMiddleware');

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
router.post('/', protect, async (req, res) => {
    try {
        const { tournamentId } = req.body;
        const tournament = await Tournament.findById(tournamentId);

        if (!tournament) {
            return res.status(404).json({ message: 'Tournament not found' });
        }

        // Check if user is owner
        if (tournament.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'User not authorized' });
        }

        const match = await Match.create(req.body);

        // Emit update event
        const io = req.app.get('io');
        io.emit('matchUpdate', match);

        res.status(201).json(match);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Update match (score, etc)
// @route   PUT /api/matches/:id
router.put('/:id', protect, async (req, res) => {
    try {
        const match = await Match.findById(req.params.id);
        if (!match) {
            return res.status(404).json({ message: 'Match not found' });
        }

        const tournament = await Tournament.findById(match.tournamentId);
        if (!tournament) {
            return res.status(404).json({ message: 'Tournament not found' });
        }

        // Check if user is owner
        if (tournament.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'User not authorized' });
        }

        const updatedMatch = await Match.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        // Emit update event
        const io = req.app.get('io');
        io.emit('matchUpdate', updatedMatch);

        res.status(200).json(updatedMatch);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Delete all matches for a tournament
// @route   DELETE /api/matches?tournamentId=...
router.delete('/', protect, async (req, res) => {
    try {
        const { tournamentId } = req.query;
        if (!tournamentId) {
            return res.status(400).json({ message: 'Tournament ID is required' });
        }

        const tournament = await Tournament.findById(tournamentId);
        if (!tournament) {
            return res.status(404).json({ message: 'Tournament not found' });
        }

        // Check if user is owner
        if (tournament.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await Match.deleteMany({ tournamentId });
        res.status(200).json({ message: 'All matches deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Add match event (goal, card, etc)
// @route   POST /api/matches/:id/events
router.post('/:id/events', protect, async (req, res) => {
    try {
        const { type, playerId, teamId, minute, description } = req.body;
        const MatchEvent = require('../models/MatchEvent');
        const Player = require('../models/Player');
        const Match = require('../models/Match');

        const match = await Match.findById(req.params.id);
        if (!match) {
            return res.status(404).json({ message: 'Match not found' });
        }

        const tournament = await Tournament.findById(match.tournamentId);
        if (!tournament) {
            return res.status(404).json({ message: 'Tournament not found' });
        }

        // Check if user is owner
        if (tournament.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'User not authorized' });
        }

        // 1. Create event
        const event = await MatchEvent.create({
            matchId: req.params.id,
            type,
            playerId,
            teamId,
            minute,
            description
        });

        // 2. Update Player Stats
        const player = await Player.findById(playerId);
        if (player) {
            if (type === 'goal') player.stats.goals += 1;
            if (type === 'assist') player.stats.assists += 1;
            if (type === 'yellowCard') player.stats.yellowCards += 1;
            if (type === 'redCard') player.stats.redCards += 1;
            await player.save();
        }

        // 3. Update Match Score if it's a goal
        if (type === 'goal') {
            if (match.team1.id && match.team1.id.toString() === teamId) {
                match.team1.score += 1;
            } else if (match.team2.id && match.team2.id.toString() === teamId) {
                match.team2.score += 1;
            }
            await match.save();

            // Emit update
            const io = req.app.get('io');
            io.emit('matchUpdate', match);
        }

        res.status(201).json(event);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
