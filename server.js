const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API Endpoint for downloading video
app.post('/download-video', (req, res) => {
    const { url, savePath } = req.body;

    const ytDlpPath = 'C:/yt-dlp/yt-dlp.exe';  // Full path to yt-dlp.exe

    const command = `"${ytDlpPath}" --get-description "${url}"`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({ error: `Error: ${error.message}` });
        }

        let caption = stdout.trim();
        if (caption.length > 25) {
            caption = caption.substring(0, 25);  // Limit to 25 characters
        }

        caption = caption.replace(/[^a-zA-Z0-9_\-]/g, '_'); // Sanitize caption

        const fileExtension = path.extname(savePath);
        const folderPath = path.dirname(savePath);
        const filePathWithCaption = path.join(folderPath, `${caption}${fileExtension}`);

        const downloadCommand = `"${ytDlpPath}" -o "${filePathWithCaption}" "${url}"`;

        exec(downloadCommand, (error, stdout, stderr) => {
            if (error) {
                return res.status(500).json({ error: `Error: ${error.message}` });
            }
            return res.status(200).json({ message: 'Download completed successfully!' });
        });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
