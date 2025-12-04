const mongoose = require('mongoose');

const matchEventSchema = mongoose.Schema({
    matchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Match',
        required: true
    },
    type: {
        type: String,
        enum: ['goal', 'assist', 'yellowCard', 'redCard', 'ownGoal'],
        required: true
    },
    playerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
        required: true
    },
    teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: true
    },
    minute: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('MatchEvent', matchEventSchema);
