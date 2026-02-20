export const MessagingService = {
  async sendEmail(to: string, subject: string, body: string) {
    // Stub for future SendGrid/SES integration
    console.log('Email ->', { to, subject, body });
    return { ok: true };
  },
  async sendSMS(to: string, body: string) {
    // Stub for Twilio
    console.log('SMS ->', { to, body });
    return { ok: true };
  },
};

