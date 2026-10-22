import Stripe from 'stripe';
import db from '../config/database';

class PaymentService {
  private stripe: Stripe | null = null;

  constructor() {
    const apiKey = process.env.STRIPE_SECRET_KEY;
    
    if (apiKey) {
      this.stripe = new Stripe(apiKey, {
        apiVersion: '2023-10-16'
      });
    } else {
      console.warn('STRIPE_SECRET_KEY not configured. Payment links will be simulated.');
    }
  }

  async createPaymentLink(invoiceId: number, amount: number): Promise<string> {
    if (!this.stripe) {
      // Return a mock payment link for development
      return `http://localhost:3000/pay/${invoiceId}`;
    }

    try {
      const invoice: any = db.prepare(`
        SELECT i.*, c.name as customer_name, c.email as customer_email
        FROM invoices i
        LEFT JOIN customers c ON i.customer_id = c.id
        WHERE i.id = ?
      `).get(invoiceId);

      if (!invoice) {
        throw new Error('Invoice not found');
      }

      // Create a payment intent
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: 'usd',
        metadata: {
          invoice_id: invoiceId.toString(),
          invoice_number: invoice.invoice_number,
          customer_name: invoice.customer_name
        },
        description: `Payment for Invoice ${invoice.invoice_number}`
      });

      // In production, you'd create a checkout session or payment link
      // For now, return the payment intent client secret
      return `${process.env.FRONTEND_URL || 'http://localhost:3000'}/pay/${invoiceId}?payment_intent=${paymentIntent.client_secret}`;
    } catch (error) {
      console.error('Payment link creation error:', error);
      throw new Error('Failed to create payment link');
    }
  }

  async processPayment(invoiceId: number, amount: number, paymentMethod: string, transactionId: string): Promise<void> {
    try {
      // Record payment
      const result = db.prepare(`
        INSERT INTO payments (invoice_id, amount, payment_date, payment_method, transaction_id, status)
        VALUES (?, ?, CURRENT_TIMESTAMP, ?, ?, 'completed')
      `).run(invoiceId, amount, paymentMethod, transactionId);

      // Get total paid for this invoice
      const totalPaid: any = db.prepare(`
        SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE invoice_id = ?
      `).get(invoiceId);

      // Get invoice amount
      const invoice: any = db.prepare('SELECT amount FROM invoices WHERE id = ?').get(invoiceId);

      // Update invoice status if fully paid
      if (totalPaid.total >= invoice.amount) {
        db.prepare(`
          UPDATE invoices SET status = 'paid', updated_at = CURRENT_TIMESTAMP WHERE id = ?
        `).run(invoiceId);
      } else {
        db.prepare(`
          UPDATE invoices SET status = 'partial', updated_at = CURRENT_TIMESTAMP WHERE id = ?
        `).run(invoiceId);
      }

      console.log(`✓ Payment processed for invoice ${invoiceId}: $${amount}`);
    } catch (error) {
      console.error('Payment processing error:', error);
      throw new Error('Failed to process payment');
    }
  }

  async handleWebhook(event: any): Promise<void> {
    // Handle Stripe webhook events
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        const invoiceId = parseInt(paymentIntent.metadata.invoice_id);
        
        await this.processPayment(
          invoiceId,
          paymentIntent.amount / 100,
          'stripe',
          paymentIntent.id
        );
        break;

      case 'payment_intent.payment_failed':
        console.error('Payment failed:', event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  }
}

export default new PaymentService();
