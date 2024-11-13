const express = require('express');
const PDF = require('../models/PDF');
const router = express.Router();

// Upload a new PDF
router.post('/upload', async (req, res) => {
    try {
        const pdf = new PDF(req.body);
        await pdf.save();
        res.status(201).json(pdf);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all PDFs
router.get('/', async (req, res) => {
    try {
        const pdfs = await PDF.find();
        res.json(pdfs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
