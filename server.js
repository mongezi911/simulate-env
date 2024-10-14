const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;

// Multer setup for file storage in CIP
const storage = multer.diskStorage({
    destination: 'cip/',
    filename: function (req, file, cb) {
        // Use the original file name when storing the file
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

// Create directory if it doesn't exist
if (!fs.existsSync('cip')) {
    fs.mkdirSync('cip');
}
if (!fs.existsSync('s3')) {
    fs.mkdirSync('s3');
}

// Simulate CIP file storage
app.post('/api/cip/store', upload.single('file'), (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).send('No file uploaded');
    }

    // Simulate storing the file
    console.log(`File ${file.originalname} stored in CIP.`);
    res.status(200).send(`File ${file.originalname} stored in CIP`);
});

// Simulate bulk upload to S3
app.post('/api/s3/upload', (req, res) => {
    // Simulate retrieving files from CIP and uploading to S3
    const cipFiles = fs.readdirSync('cip');

    if (cipFiles.length === 0) {
        return res.status(400).send('No files in CIP to upload');
    }

    cipFiles.forEach((file) => {
        const filePath = path.join('cip', file);
        const s3FilePath = path.join('s3', file);

        // Simulate moving the file to S3 directory
        fs.renameSync(filePath, s3FilePath);
        console.log(`File ${file} uploaded to S3.`);
    });

    res.status(200).send('Files uploaded to S3');
});

// Simulate sending acknowledgment
app.post('/api/notify', (req, res) => {
    console.log('Batch completed. Sending acknowledgment...');
    res.status(200).send('Batch completed and acknowledgment sent');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
