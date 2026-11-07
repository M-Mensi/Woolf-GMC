const nodemailer = require('nodemailer');

async function sendEmail() {
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

  const info = await transporter.sendMail({
    from: SMTP_USER,
    to: EMAIL_TO,
    subject: 'Hello from Node.js',
    text: 'Hello Node',
  });

  console.log(`Email sent: ${info.response}`);
}

sendEmail().catch((error) => {
  console.error('Failed to send email:', error.message);
  process.exitCode = 1;
});
