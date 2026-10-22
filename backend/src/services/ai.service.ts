import axios from 'axios';

interface GenerateReminderParams {
  customerName: string;
  companyName?: string;
  invoiceNumber: string;
  amount: number;
  dueDate: string;
  daysOverdue: number;
  paymentHistory?: string;
  reminderType: 'friendly' | 'firm' | 'escalated';
}

export class AIService {
  private apiKey: string;
  private apiUrl = 'https://api.anthropic.com/v1/messages';

  constructor() {
    this.apiKey = process.env.ANTHROPIC_API_KEY || '';
  }

  async generateReminderMessage(params: GenerateReminderParams): Promise<string> {
    const {
      customerName,
      companyName,
      invoiceNumber,
      amount,
      dueDate,
      daysOverdue,
      paymentHistory,
      reminderType
    } = params;

    const toneInstructions = {
      friendly: 'Use a friendly, professional tone. Be understanding and helpful.',
      firm: 'Use a firm but professional tone. Be direct about the overdue payment.',
      escalated: 'Use a serious, urgent tone. Emphasize the importance of immediate payment and potential consequences.'
    };

    const prompt = `Generate a professional payment reminder email for the following situation:

Customer: ${customerName}${companyName ? ` (${companyName})` : ''}
Invoice Number: ${invoiceNumber}
Amount Due: $${amount.toFixed(2)}
Original Due Date: ${dueDate}
Days Overdue: ${daysOverdue}
${paymentHistory ? `Payment History: ${paymentHistory}` : ''}

Reminder Type: ${reminderType}
Tone: ${toneInstructions[reminderType]}

Requirements:
1. Keep it concise (150-200 words)
2. Include the invoice details
3. ${reminderType === 'friendly' ? 'Offer to help if there are any issues' : ''}
4. ${reminderType === 'escalated' ? 'Mention potential next steps if payment is not received' : ''}
5. End with a clear call to action
6. Include a placeholder [PAYMENT_LINK] where the payment link should go
7. Use a professional email format with subject line

Generate only the email content, no additional commentary.`;

    try {
      const response = await axios.post(
        this.apiUrl,
        {
          model: 'claude-3-haiku-20240307',
          max_tokens: 1024,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': this.apiKey,
            'anthropic-version': '2023-06-01'
          }
        }
      );

      return response.data.content[0].text;
    } catch (error: any) {
      console.error('AI generation error:', error.response?.data || error.message);
      
      // Fallback to template if AI fails
      return this.getFallbackTemplate(params);
    }
  }

  private getFallbackTemplate(params: GenerateReminderParams): string {
    const { customerName, invoiceNumber, amount, dueDate, daysOverdue, reminderType } = params;

    const templates = {
      friendly: `Subject: Friendly Reminder: Invoice ${invoiceNumber} Payment

Dear ${customerName},

I hope this message finds you well. This is a friendly reminder that invoice ${invoiceNumber} for $${amount.toFixed(2)} was due on ${dueDate} and is now ${daysOverdue} days overdue.

We understand that oversights happen. If you've already sent the payment, please disregard this message. If you're experiencing any issues or have questions about this invoice, please don't hesitate to reach out.

You can make a secure payment using the link below:
[PAYMENT_LINK]

Thank you for your prompt attention to this matter.

Best regards,
Accounts Receivable Team`,

      firm: `Subject: Payment Required: Invoice ${invoiceNumber}

Dear ${customerName},

This is a reminder that invoice ${invoiceNumber} for $${amount.toFixed(2)} is now ${daysOverdue} days overdue. The original due date was ${dueDate}.

We request immediate payment to bring your account current. Please process this payment at your earliest convenience.

Pay securely online:
[PAYMENT_LINK]

If you have any questions or concerns, please contact us immediately.

Regards,
Accounts Receivable Team`,

      escalated: `Subject: URGENT: Overdue Invoice ${invoiceNumber} - Immediate Action Required

Dear ${customerName},

This is an urgent notice regarding invoice ${invoiceNumber} for $${amount.toFixed(2)}, which is now ${daysOverdue} days overdue.

Despite previous reminders, this invoice remains unpaid. We require immediate payment to avoid further action, which may include:
- Late payment fees
- Suspension of services
- Referral to collections

Please make payment immediately:
[PAYMENT_LINK]

If there are extenuating circumstances, contact us within 48 hours to discuss payment arrangements.

Urgently,
Accounts Receivable Team`
    };

    return templates[reminderType];
  }

  async analyzepaymentPattern(customerId: number): Promise<string> {
    // This would analyze payment history and return insights
    // For now, return a simple analysis
    return 'Customer has a good payment history with occasional delays.';
  }
}

export default new AIService();
