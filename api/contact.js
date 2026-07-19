require('dotenv').config();
const nodemailer = require('nodemailer');

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { name, organization, email, role, venue, message } = req.body;
    
    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
    }

    // Set up Nodemailer using environment variables (configured in Vercel Dashboard)
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: process.env.EMAIL_PORT || 465,
        secure: true, 
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER, 
        subject: `New SYNAPSE Deployment Request from ${name}`,
        text: `You have received a new deployment request:

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
        // Only attempt to send if credentials exist
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            await transporter.sendMail(mailOptions);
        } else {
            console.warn("Vercel Serverless: Missing EMAIL_USER / EMAIL_PASS environment variables. Email notification skipped.");
        }
        
        // Note: Writing to a local contacts.json won't persist on Vercel Serverless because the filesystem is read-only.
        // To persist contacts in Vercel, you should integrate Vercel Postgres, Vercel KV, or an external database.
        
        res.status(200).json({ success: true, message: 'Request received successfully.' });
    } catch (err) {
        console.error('Error sending email:', err.message);
        res.status(500).json({ error: 'Failed to process submission' });
    }
}
