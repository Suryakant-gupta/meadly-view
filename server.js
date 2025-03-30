const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const axios = require("axios");

dotenv.config();

const app = express();

dotenv.config();



// Middleware for parsing different types of request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Static files middleware - serve the public directory
app.use(express.static(path.join(__dirname, 'public')));

;

// Middleware to log incoming requests (helpful for debugging)
app.use((req, res, next) => {
  console.log(`Incoming ${req.method} request to ${req.path}`);
  console.log('Request headers:', req.headers);
  console.log('Request body:', req.body);
  next();
});


// Email configuration
const fromUser = "bgmilelomujhse@gmail.com";
const password = "ywhy ioln niwm sxen";

// Create a reusable transporter object
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: fromUser,
    pass: password
  }
});

// Function to send email notification
const sendEmail = (recipients, htmlTemplate, subject) => {
  return new Promise((resolve, reject) => {
    const mailOptions = {
      from: fromUser,
      to: Array.isArray(recipients) ? recipients.join(', ') : recipients,
      subject: subject,
      html: htmlTemplate,
    };
    
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        reject(error);
      } else {
        console.log("Email sent:", info.response);
        resolve(info);
      }
    });
  });
};


// Route for the home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});



// Lead form submission route with multer and comprehensive logging
app.post("/api/lead-form", async (req, res) => {
  console.log("Lead Form Submission Received");
  console.log("Raw Request Body:", req.body);

  try {
    const { name, mobile, email } = req.body;

    // Detailed validation with logging
    if (!name) {
      console.error("Validation Error: Name is missing");
      return res.status(400).json({ 
        success: false, 
        message: "Name is required" 
      });
    }

    if (!mobile) {
      console.error("Validation Error: Mobile is missing");
      return res.status(400).json({ 
        success: false, 
        message: "Mobile number is required" 
      });
    }

    if (!email) {
      console.error("Validation Error: Email is missing");
      return res.status(400).json({ 
        success: false, 
        message: "Email is required" 
      });
    }

    // Email content
    const subject = "New Lead From - Karyan City Walk";
    const htmlContent = `
      <h1>New Lead Registration</h1>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Mobile:</strong> ${mobile}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>From Website:</strong> Karyan City Walk</p>
      <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
    `;

    const recipients = [
      "sales@globalrealtygroup.in",
      "amit.soam@globalrealtygroup.in",
      "crm@globalrealtygroup.in",
    ];
    
    // Send emails
    await sendEmail(recipients, htmlContent, subject);
    await sendEmail(email, htmlContent, "Karyan Streetwalk");
    
    // Successful response
    return res.status(200).json({ 
      success: true, 
      message: "Lead submitted successfully" 
    });

  } catch (error) {
    console.error("Lead form submission error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Internal server error",
      error: error.message 
    });
  }
});

// Price breakup/download brochure form submission
app.post('/api/download-broachur', async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    
    // Validate input
    const errors = [];
    if (!name || !name.trim()) errors.push("Name is required");
    if (!email || !email.trim()) errors.push("Email is required");
    if (!phone || !phone.trim()) errors.push("Phone number is required");
    
    if (errors.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: errors.join(', ') 
      });
    }
    
    const subject = 'New Lead From - Karyan City Walk';
    const htmlContent = `
      <h1>New Lead</h1>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>From Website:</strong> Karyan City walk</p>
      <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
    `;

    const recipients = ['sales@globalrealtygroup.in', 'amit.soam@globalrealtygroup.in', 'crm@globalrealtygroup.in'];
    
    // Send emails
    await sendEmail(recipients, htmlContent, subject);
    await sendEmail(email, htmlContent, "Karyan Streetwalk");
    
    // Return JSON response instead of redirect
    return res.status(200).json({
      success: true,
      message: 'Thank you for your interest we will get back to you soon',
      downloadUrl: '/images/kcB.pdf'
    });
  } catch (error) {
    console.error('Price breakup form submission error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error("ERROR:", err.stack);
  res.status(500).send("Something broke! Check server logs.");
});

// Start server
const PORT = 3100;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));