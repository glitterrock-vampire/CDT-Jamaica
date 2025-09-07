import { Resend } from 'resend';

// Using test API key for now - replace with process.env.RESEND_API_KEY in production
const resend = new Resend('re_UbmA7WFd_3ZpriUhxLGFna5naLs3XVwX7');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, message } = req.body;

  try {
    const { data, error } = await resend.emails.send({
      from: 'CDT Jamaica <onboarding@resend.dev>',
      to: 'andrewalters1997@gmail.com', // Using test email for now
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
