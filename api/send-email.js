import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.ionos.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, subject, message, consent } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message || !consent) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Format the contact data for email
    const contactData = `
      <h2 style="color: #1f2937; margin-bottom: 20px;">📧 New Contact Form Submission</h2>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 12px 0; font-weight: 600; color: #1f2937; width: 150px;">Name:</td>
          <td style="padding: 12px 0;">${name}</td>
        </tr>
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 12px 0; font-weight: 600; color: #1f2937;">Email:</td>
          <td style="padding: 12px 0;"><a href="mailto:${email}" style="color: #3b82f6; text-decoration: none;">${email}</a></td>
        </tr>
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 12px 0; font-weight: 600; color: #1f2937;">Phone:</td>
          <td style="padding: 12px 0;"><a href="tel:${phone}" style="color: #3b82f6; text-decoration: none;">${phone || 'Not provided'}</a></td>
        </tr>
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 12px 0; font-weight: 600; color: #1f2937;">Subject:</td>
          <td style="padding: 12px 0;">${subject}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; font-weight: 600; color: #1f2937;">Message:</td>
          <td style="padding: 12px 0;">${message.replace(/\n/g, '<br>')}</td>
        </tr>
      </table>

      <p style="color: #6b7280; font-size: 12px; margin-top: 20px;">
        Submitted from: dylansilver.org<br>
        Time: ${new Date().toLocaleString()}
      </p>
    `;

    // Send email to your inboxes
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'dylansilver.tx@gmail.com, dsilver@reliverealty.com',
      subject: `📧 New Contact Form: ${subject} from ${name}`,
      html: contactData,
      replyTo: email,
    });

    // Send confirmation email to the person who submitted
    const confirmationEmail = `
      <h2 style="color: #1f2937;">Thank you for reaching out!</h2>
      <p>Hi ${name},</p>
      <p>We received your message and will get back to you as soon as possible.</p>
      <p>In the meantime, feel free to call us at <strong><a href="tel:2106924695" style="color: #3b82f6; text-decoration: none;">(210) 692-4695</a></strong></p>
      <br>
      <p>Best regards,<br><strong>Dylan Silver</strong><br>Austin Real Estate Specialist</p>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'We received your message - Dylan Silver',
      html: confirmationEmail,
    });

    return res.status(200).json({
      success: true,
      message: 'Email sent successfully'
    });

  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send email. Please try again later.'
    });
  }
}
