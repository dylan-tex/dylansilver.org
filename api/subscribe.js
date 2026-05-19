// Airtable newsletter subscribe endpoint.
//
// Required env vars on Vercel:
//   AIRTABLE_API_KEY   - personal access token (airtable.com/create/tokens)
//   AIRTABLE_BASE_ID   - base ID, looks like appXXXXXXXX
//   AIRTABLE_TABLE     - table name (default: "Subscribers")
//
// Expected Airtable fields: name (single line), email (single line), submittedAt (single line or date)

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

    return res.status(200).json({ success: true, id: data.id });
  } catch (err) {
    console.error('subscribe error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
}
