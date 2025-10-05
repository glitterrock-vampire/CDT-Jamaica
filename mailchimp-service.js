const mailchimp = require('@mailchimp/mailchimp_marketing');

class MailchimpService {
  constructor() {
    this.apiKey = process.env.MAILCHIMP_API_KEY;
    this.listId = process.env.MAILCHIMP_LIST_ID;
    this.isConfigured = false;
  }

  configure() {
    if (!this.apiKey || !this.listId) {
      throw new Error('Mailchimp credentials not configured');
    }

    const datacenter = this.apiKey.split('-').pop();
    mailchimp.setConfig({
      apiKey: this.apiKey,
      server: datacenter,
    });

    this.isConfigured = true;
    console.log('✅ Mailchimp service configured');
  }

  async addSubscriber(email) {
    if (!this.isConfigured) {
      this.configure();
    }

    try {
      console.log(`📧 Adding subscriber: ${email}`);

      const response = await mailchimp.lists.addListMember(this.listId, {
        email_address: email,
        status: 'subscribed',
      });

      console.log(`✅ Subscriber added successfully: ${response.email_address}`);
      return {
        success: true,
        email: response.email_address,
        memberId: response.id,
        status: response.status,
      };

    } catch (error) {
      console.error(`❌ Failed to add subscriber: ${error.message}`);

      // Handle specific error cases
      if (error.status === 400 && error.response?.body?.title === 'Member Exists') {
        return {
          success: true,
          email: email,
          status: 'already_subscribed',
          message: 'Email is already subscribed to our newsletter',
        };
      }

      throw error;
    }
  }

  async getAudienceInfo() {
    if (!this.isConfigured) {
      this.configure();
    }

    try {
      const response = await mailchimp.lists.getList(this.listId);
      return {
        id: response.id,
        name: response.name,
        memberCount: response.stats?.member_count || 0,
        unsubscribeCount: response.stats?.unsubscribe_count || 0,
      };
    } catch (error) {
      console.error('Failed to get audience info:', error.message);
      throw error;
    }
  }
}

module.exports = new MailchimpService();
