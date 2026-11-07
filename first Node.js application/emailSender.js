const nodemailer = require('nodemailer');

const { SMTP_USER, SMTP_PASSWORD, EMAIL_TO } = process.env;

if (!SMTP_USER || !SMTP_PASSWORD || !EMAIL_TO) {
  throw new Error('Set SMTP_USER, SMTP_PASSWORD, and EMAIL_TO environment variables before sending email.');
}

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
});

const mailOptions = {
  from: SMTP_USER,
  to: EMAIL_TO,
  subject: 'Test email from Node.js',
  text: 'Hello! This email was sent using Nodemailer.',
};

transporter.sendMail(mailOptions)
  .then((info) => {
    console.log(`Email sent: ${info.response}`);
  })
  .catch((error) => {
    console.error('Failed to send email:', error);
    process.exitCode = 1;
  });