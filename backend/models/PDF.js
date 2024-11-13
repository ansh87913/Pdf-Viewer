const mongoose = require('mongoose');

const pdfSchema = new mongoose.Schema({
    title: { type: String, required: true },
    url: { type: String, required: true }, // URL or path to the PDF file
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('PDF', pdfSchema);
