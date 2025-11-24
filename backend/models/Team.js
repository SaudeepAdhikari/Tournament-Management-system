const mongoose = require('mongoose');

const teamSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a team name']
    },
    captain: {
        type: String,
        default: ''
    },
    contact: {
        type: String,
        default: ''
    },
    tournamentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tournament',
        required: true
    },
    status: {
        type: String,
        enum: ['registered', 'paid', 'disqualified'],
        default: 'registered'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Team', teamSchema);
