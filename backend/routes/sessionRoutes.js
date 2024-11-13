const express = require('express');
const Session = require('../models/Session');
const router = express.Router();

// Start a new session or update existing session
router.post('/start', async (req, res) => {
    const { userId, pdfId, isAdmin } = req.body;
    try {
        let session = await Session.findOne({ userId, pdfId });
        if (session) {
            session.isAdmin = isAdmin;
            await session.save();
        } else {
            session = new Session(req.body);
            await session.save();
        }
        res.json(session);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update current page
router.put('/update-page', async (req, res) => {
    const { userId, pdfId, currentPage } = req.body;
    try {
        const session = await Session.findOneAndUpdate(
            { userId, pdfId },
            { currentPage },
            { new: true }
        );
        res.json(session);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
