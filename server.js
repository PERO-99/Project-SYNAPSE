require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const port = 8080;

const DB_FILE = path.join(__dirname, 'contacts.json');


if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify([]));
}


const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 465,
    secure: true, 
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.static(path.join(__dirname, '')));


app.post('/api/contact', async (req, res) => {
    const { name, organization, email, role, venue, message } = req.body;
    
    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
    }

    try {
        const data = fs.readFileSync(DB_FILE, 'utf8');
        const contacts = JSON.parse(data);
        
        const newContact = {
            id: Date.now(),
            name,
            organization,
            email,
            role,
            venue,
            message,
            created_at: new Date().toISOString()
        };
        
        contacts.push(newContact);
        fs.writeFileSync(DB_FILE, JSON.stringify(contacts, null, 2));
        
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, 
            subject: `New SYNAPSE Deployment Request from ${name}`,
            text: `
You have received a new deployment request:

Name: ${name}
Email: ${email}
Organization: ${organization || 'N/A'}
Role: ${role || 'N/A'}
Venue/City: ${venue || 'N/A'}
Message: 
${message || 'N/A'}
            `
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log('Email notification sent to', process.env.EMAIL_USER);
        } catch (mailErr) {
            console.error('Warning: Failed to send email notification:', mailErr.message);
            
            
        }

        res.json({ success: true, id: newContact.id, message: 'Request received successfully' });
    } catch (err) {
        console.error('Error writing to database:', err.message);
        res.status(500).json({ error: 'Failed to save submission' });
    }
});


app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
