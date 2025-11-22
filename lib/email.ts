import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'localhost',
  port: Number(process.env.SMTP_PORT) || 1025,
  secure: false,
  auth: process.env.SMTP_USER
    ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    : undefined
});

export async function sendEmail(to: string, subject: string, html: string) {
  try {
    await transporter.sendMail({
      from: 'noreply@bookitzzz.com',
      to,
      subject,
      html
    });
    console.log(`Email sent to ${to}`);
  } catch (err) {
    console.error('Email send error:', err);
  }
}

export async function sendOverdueNotification(email: string, bookTitle: string, dueDate: Date) {
  const subject = 'Book Overdue Reminder';
  const html = `
    <h2>BookItzzz Overdue Notice</h2>
    <p>Your borrowed book <strong>${bookTitle}</strong> was due on ${dueDate.toDateString()}.</p>
    <p>Please return it as soon as possible to avoid fines.</p>
  `;
  await sendEmail(email, subject, html);
}

export async function sendDueSoonReminder(email: string, bookTitle: string, dueDate: Date) {
  const subject = 'Book Due Soon';
  const html = `
    <h2>BookItzzz Due Soon Reminder</h2>
    <p>Your borrowed book <strong>${bookTitle}</strong> is due on ${dueDate.toDateString()}.</p>
    <p>Please return or renew it before the due date.</p>
  `;
  await sendEmail(email, subject, html);
}
