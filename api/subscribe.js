const mailchimp = require('@mailchimp/mailchimp_marketing');

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log(' SUBSCRIPTION REQUEST RECEIVED');
  console.log(' Request body:', req.body);

  try {
    const { email } = req.body;
    console.log(' Extracted email:', email);

    // Validate email
    console.log(' Validating email format...');
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      console.log('Email validation failed');
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid email address'
      });
    }
    console.log('Email validation passed');

    // Get Mailchimp credentials
    console.log('Loading Mailchimp credentials...');
    const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
    const MAILCHIMP_LIST_ID = process.env.MAILCHIMP_LIST_ID;

    if (!MAILCHIMP_API_KEY || !MAILCHIMP_LIST_ID) {
      console.error('Missing Mailchimp configuration');
      return res.status(500).json({
        success: false,
        error: 'Server configuration error. Please try again later.'
      });
    }
    console.log('Mailchimp credentials loaded');

    // Extract datacenter from API key
    const DATACENTER = MAILCHIMP_API_KEY.split('-').pop();
    console.log('Extracted datacenter:', DATACENTER);

    // Configure Mailchimp
    console.log('Configuring Mailchimp client...');
    mailchimp.setConfig({
      apiKey: MAILCHIMP_API_KEY,
      server: DATACENTER,
    });
    console.log('Mailchimp client configured');

    console.log('Attempting to subscribe:', { email, listId: MAILCHIMP_LIST_ID });

    // Add subscriber to Mailchimp list
    try {
      console.log('Sending request to Mailchimp API...');
      const response = await mailchimp.lists.addListMember(MAILCHIMP_LIST_ID, {
        email_address: email,
        status: 'subscribed',
      });

      console.log('Mailchimp API success! Response:', {
        id: response.id,
        email: response.email_address,
        status: response.status,
        timestamp: response.timestamp_signup
      });

      return res.status(200).json({
        success: true,
        message: 'Successfully subscribed to newsletter!'
      });

    } catch (mailchimpError) {
      console.error('Mailchimp API Error Details:', {
        message: mailchimpError.message,
        status: mailchimpError.status,
        code: mailchimpError.response?.body?.title,
        details: mailchimpError.response?.body?.detail,
        errors: mailchimpError.response?.body?.errors
      });

      // Handle member already exists (not an error)
      if (mailchimpError.status === 400 && mailchimpError.response?.body?.title === 'Member Exists') {
        console.log('Email already subscribed');
        return res.status(200).json({
          success: true,
          message: 'You are already subscribed to our newsletter!'
        });
      }

      // Handle other errors
      console.error('Mailchimp subscription failed:', mailchimpError.message);
      return res.status(500).json({
        success: false,
        error: 'Failed to subscribe to newsletter. Please try again later.'
      });
    }

  } catch (error) {
    console.error('General subscription error:', error);
    return res.status(500).json({
      success: false,
      error: 'An unexpected error occurred. Please try again later.'
    });
  }
}
