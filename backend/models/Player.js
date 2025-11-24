const mongoose = require('mongoose');

const playerSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a player name']
    },
    teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: true
    },
    number: {
        type: Number,
        default: 0
    },
    position: {
        type: String,
        default: 'Player'
    },
    stats: {
        goals: { type: Number, default: 0 },
        assists: { type: Number, default: 0 },
        yellowCards: { type: Number, default: 0 },
        redCards: { type: Number, default: 0 },
        matchesPlayed: { type: Number, default: 0 }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Player', playerSchema);
