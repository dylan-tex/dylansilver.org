// Airtable newsletter subscribe endpoint + notification email.
//
// Required env vars on Vercel:
//   AIRTABLE_API_KEY   - personal access token (airtable.com/create/tokens)
//   AIRTABLE_BASE_ID   - base ID, looks like appXXXXXXXX
//   AIRTABLE_TABLE     - table name (default: "Subscribers")
//   EMAIL_USER         - IONOS SMTP user (also from address)
//   EMAIL_PASSWORD     - IONOS SMTP password
//   SUBSCRIBE_NOTIFY_TO - recipient for new-subscriber notifications (default: EMAIL_USER)
//
// Expected Airtable fields: name (single line), email (single line), submittedAt (single line or date)

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
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method not allowed' });

  try {
    const { name, email } = req.body || {};

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: 'Valid email required' });
    }

    const table = process.env.AIRTABLE_TABLE || 'Subscribers';
    const fields = {
      name: (name || '').trim(),
      email: email.trim(),
      submittedAt: new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' }),
    };

    const airtableRes = await fetch(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${encodeURIComponent(table)}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fields }),
      }
    );

    const data = await airtableRes.json();
    if (!airtableRes.ok) {
      console.error('Airtable error:', JSON.stringify(data));
      return res.status(500).json({ success: false, message: 'Could not save subscription' });
    }

    // Fire-and-forget notification email. Don't fail the subscription if email errors.
    if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
      transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.SUBSCRIBE_NOTIFY_TO || process.env.EMAIL_USER,
        replyTo: fields.email,
        subject: `New Austin Market Updates subscriber: ${fields.name || fields.email}`,
        html: `
          <h2 style="color:#2c1a0e;">New newsletter subscriber</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;font-weight:600;width:120px;">Name:</td><td>${fields.name || '(not provided)'}</td></tr>
            <tr><td style="padding:8px 0;font-weight:600;">Email:</td><td><a href="mailto:${fields.email}">${fields.email}</a></td></tr>
            <tr><td style="padding:8px 0;font-weight:600;">Submitted:</td><td>${fields.submittedAt}</td></tr>
          </table>
          <p style="color:#6b7280;font-size:12px;margin-top:16px;">Saved to Airtable (record ${data.id}) from dylansilver.org</p>
        `,
      }).catch(err => console.error('Subscribe notify-email error:', err));
    }

    return res.status(200).json({ success: true, id: data.id });
  } catch (err) {
    console.error('subscribe error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
}
