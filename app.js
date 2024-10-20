// app.js

const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');
const mammoth = require('mammoth');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static('public'));
app.use(express.json());

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit
    fileFilter: (req, file, cb) => {
        const fileTypes = /pdf|doc|docx/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb('Error: File type not supported!');
    },
});

// GET route to serve the HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});


// Route to handle file upload
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    let text = '';

    if (req.file.mimetype === 'application/pdf') {
        pdf(req.file.buffer).then(data => {
            text = data.text;
            res.json({ text });
        });
    } else if (req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        mammoth.extractRawText({ buffer: req.file.buffer })
            .then(result => {
                text = result.value;
                res.json({ text });
            })
            .catch(err => res.status(500).send(err));
    } else if (req.file.mimetype === 'application/msword') {
        mammoth.extractRawText({ buffer: req.file.buffer })
            .then(result => {
                text = result.value;
                res.json({ text });
            })
            .catch(err => res.status(500).send(err));
    } else {
        res.status(400).send('Unsupported file type.');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
