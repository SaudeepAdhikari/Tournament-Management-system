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
        enum: ['registered', 'approved', 'rejected'],
        default: 'registered'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending'
    },
    transactionId: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Team', teamSchema);
