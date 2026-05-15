import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, subject, message, consent } = req.body;

  // Validate required fields
  if (!name || !email || !subject || !message || !consent) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Create transporter for Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD
      }
    });

    // Email content
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: 'dylansilver.tx@gmail.com, dsilver@reliverealty.com',
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><em>This is an automated message from dylansilver.org contact form</em></p>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Also send confirmation to the person who submitted
    const confirmationEmail = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'We received your message - Dylan Silver',
      html: `
        <h2>Thank you for reaching out!</h2>
        <p>Hi ${name},</p>
        <p>We received your message and will get back to you as soon as possible.</p>
        <p>In the meantime, feel free to call us at <strong>(210) 692-4695</strong></p>
        <br>
        <p>Best regards,<br>Dylan Silver<br>Austin Real Estate Specialist</p>
      `
    };

    await transporter.sendMail(confirmationEmail);

    return res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Email error:', error);
    return res.status(500).json({ error: 'Failed to send email', details: error.message });
  }
}
