const express = require('express');
const router = express.Router();
const Tournament = require('../models/Tournament');

// @desc    Get all tournaments
// @route   GET /api/tournaments
router.get('/', async (req, res) => {
    try {
        const tournaments = await Tournament.find().sort({ createdAt: -1 });
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
router.post('/', async (req, res) => {
    try {
        const tournament = await Tournament.create(req.body);
        res.status(201).json(tournament);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Update tournament
// @route   PUT /api/tournaments/:id
router.put('/:id', async (req, res) => {
    try {
        const tournament = await Tournament.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!tournament) {
            return res.status(404).json({ message: 'Tournament not found' });
        }
        res.status(200).json(tournament);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Delete tournament
// @route   DELETE /api/tournaments/:id
router.delete('/:id', async (req, res) => {
    try {
        const tournament = await Tournament.findByIdAndDelete(req.params.id);
        if (!tournament) {
            return res.status(404).json({ message: 'Tournament not found' });
        }
        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
