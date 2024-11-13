const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    pdfId: { type: mongoose.Schema.Types.ObjectId, ref: 'PDF', required: true },
    currentPage: { type: Number, default: 1 },
    isAdmin: { type: Boolean, default: false }, // Tracks if user is controlling the session
});

module.exports = mongoose.model('Session', sessionSchema);
