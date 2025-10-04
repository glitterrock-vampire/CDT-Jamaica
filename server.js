const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const nodemailer = require('nodemailer');
const mailchimp = require('@mailchimp/mailchimp_marketing');
dotenv.config({ path: ['.env.local', '.env'] });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false,
        error: 'Name, email, and message are required' 
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false,
        error: 'Please enter a valid email address' 
      });
    }

    // Send email
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.SMTP_TO,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    console.log('Message sent: %s', info.messageId);
    
    res.status(200).json({ 
      success: true,
      message: 'Message sent successfully!',
      previewUrl: nodemailer.getTestMessageUrl(info)
    });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to send message',
      details: error.message 
    });
  }
});

// Mailchimp subscription endpoint
app.post('/api/subscribe', async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid email address'
      });
    }

    // Get Mailchimp credentials
    const MAILCHIMP_API_KEY = process.env.REACT_APP_MAILCHIMP_API_KEY;
    const MAILCHIMP_LIST_ID = process.env.REACT_APP_MAILCHIMP_LIST_ID;

    if (!MAILCHIMP_API_KEY || !MAILCHIMP_LIST_ID) {
      console.error('Missing Mailchimp configuration');
      return res.status(500).json({
        success: false,
        error: 'Server configuration error. Please try again later.'
      });
    }

    // Extract datacenter from API key (e.g., 'us1' from 'c68a952c4c309eabf46bc8e2af1d033d-us1')
    const DATACENTER = MAILCHIMP_API_KEY.split('-').pop();

    // Configure Mailchimp
    mailchimp.setConfig({
      apiKey: MAILCHIMP_API_KEY,
      server: DATACENTER,
    });

    console.log('Attempting to subscribe:', { email, listId: MAILCHIMP_LIST_ID });

    // Add subscriber to Mailchimp list
    const response = await mailchimp.lists.addListMember(MAILCHIMP_LIST_ID, {
      email_address: email,
      status: 'subscribed',
    });

    console.log('Mailchimp response:', response);

    return res.status(200).json({
      success: true,
      message: 'Successfully subscribed to newsletter!'
    });

  } catch (error) {
    console.error('Mailchimp API error:', error);

    // Handle specific Mailchimp errors
    if (error.status === 400) {
      const errorTitle = error.response?.body?.title;

      if (errorTitle === 'Member Exists') {
        return res.status(400).json({
          success: false,
          error: 'This email is already subscribed to our newsletter.'
        });
      }

      return res.status(400).json({
        success: false,
        error: error.response?.body?.detail || 'Invalid email address or subscription failed.'
      });
    }

    // Generic error response
    return res.status(500).json({
      success: false,
      error: 'Failed to subscribe. Please try again later.'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
