// server/utils/mailer.js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"AI Image App" <${process.env.MAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log('✅ Email sent to:', to);
  } catch (error) {
    console.error('❌ Email sending failed:', error.message); // 👈 Shows in console
    throw error; // Let register() catch it
  }
};
