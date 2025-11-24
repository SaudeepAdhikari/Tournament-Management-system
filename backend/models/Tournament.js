const mongoose = require('mongoose');

const tournamentSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a tournament name']
    },
    date: {
        type: String,
        required: [true, 'Please add a date']
    },
    location: {
        type: String,
        required: [true, 'Please add a location']
    },
    format: {
        type: String,
        required: [true, 'Please select a format'],
        enum: ['single-elimination', 'double-elimination', 'round-robin', 'group-knockout']
    },
    teamCount: {
        type: Number,
        required: [true, 'Please add team count']
    },
    status: {
        type: String,
        enum: ['upcoming', 'active', 'completed'],
        default: 'upcoming'
    },
    winner: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Tournament', tournamentSchema);
