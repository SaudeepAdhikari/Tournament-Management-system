const mongoose = require('mongoose');

const matchSchema = mongoose.Schema({
    tournamentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tournament',
        required: true
    },
    round: {
        type: Number,
        required: true
    },
    matchNumber: {
        type: Number,
        required: true
    },
    team1: {
        id: { type: String, default: null },
        name: { type: String, default: 'TBD' },
        score: { type: Number, default: 0 }
    },
    team2: {
        id: { type: String, default: null },
        name: { type: String, default: 'TBD' },
        score: { type: Number, default: 0 }
    },
    winner: {
        id: { type: String, default: null },
        name: { type: String, default: null }
    },
    status: {
        type: String,
        enum: ['scheduled', 'live', 'completed'],
        default: 'scheduled'
    },
    startTime: {
        type: Date
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Match', matchSchema);
