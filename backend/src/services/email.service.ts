import { Resend } from 'resend';

interface SendReminderParams {
  to: string;
  subject: string;
  message: string;
}

class EmailService {
  private resend: Resend | null = null;
  private fromEmail: string;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    this.fromEmail = process.env.FROM_EMAIL || 'noreply@yourdomain.com';

    if (apiKey) {
      this.resend = new Resend(apiKey);
    } else {
      console.warn('RESEND_API_KEY not configured. Email sending will be simulated.');
    }
  }

  async sendReminder(params: SendReminderParams): Promise<void> {
    const { to, subject, message } = params;

    if (!this.resend) {
      // Simulate email sending in development
      console.log('📧 [SIMULATED EMAIL]');
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`Message:\n${message}`);
      console.log('---');
      return;
    }

    try {
      await this.resend.emails.send({
        from: this.fromEmail,
        to: [to],
        subject: subject,
        html: this.formatEmailHTML(message)
      });

      console.log(`✓ Email sent to ${to}`);
    } catch (error) {
      console.error('Email sending error:', error);
      throw new Error('Failed to send email');
    }
  }

  private formatEmailHTML(message: string): string {
    // Convert plain text to HTML with basic formatting
    const lines = message.split('\n');
    let html = '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">';
    
    lines.forEach(line => {
      if (line.startsWith('Subject:')) {
        // Skip subject line in body
        return;
      } else if (line.trim() === '') {
        html += '<br>';
      } else if (line.includes('[PAYMENT_LINK]') || line.startsWith('http')) {
        html += `<p><a href="${line.trim()}" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 10px 0;">Pay Now</a></p>`;
      } else {
        html += `<p style="line-height: 1.6; color: #333;">${line}</p>`;
      }
    });
    
    html += '</div>';
    return html;
  }

  async sendAlert(to: string, subject: string, message: string): Promise<void> {
    return this.sendReminder({ to, subject, message });
  }
}

export default new EmailService();
