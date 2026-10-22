import express, { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import db from '../config/database';
import { authenticateToken, AuthRequest } from '../middleware/auth.middleware';
import paymentService from '../services/payment.service';

const router = Router();

// Create payment link (authenticated)
router.post('/create-link', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { invoiceId } = req.body;

    const invoice: any = db.prepare('SELECT * FROM invoices WHERE id = ?').get(invoiceId);
    
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    const paymentLink = await paymentService.createPaymentLink(invoiceId, invoice.amount);

    res.json({ paymentLink });
  } catch (error) {
    console.error('Error creating payment link:', error);
    res.status(500).json({ error: 'Failed to create payment link' });
  }
});

// Record manual payment (authenticated)
router.post(
  '/record',
  authenticateToken,
  [
    body('invoice_id').isInt(),
    body('amount').isFloat({ min: 0 }),
    body('payment_method').notEmpty()
  ],
  async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { invoice_id, amount, payment_method, transaction_id } = req.body;

    try {
      await paymentService.processPayment(
        invoice_id,
        amount,
        payment_method,
        transaction_id || `MANUAL-${Date.now()}`
      );

      res.json({ message: 'Payment recorded successfully' });
    } catch (error) {
      console.error('Error recording payment:', error);
      res.status(500).json({ error: 'Failed to record payment' });
    }
  }
);

// Get payments for an invoice
router.get('/invoice/:invoiceId', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const payments = db.prepare(`
      SELECT * FROM payments WHERE invoice_id = ? ORDER BY payment_date DESC
    `).all(req.params.invoiceId);

    const total: any = db.prepare(`
      SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE invoice_id = ?
    `).get(req.params.invoiceId);

    res.json({ payments, total: total.total });
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

// Stripe webhook (public endpoint)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];

  try {
    // In production, verify the webhook signature
    // const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    
    // For now, just parse the body
    const event = req.body;

    await paymentService.handleWebhook(event);

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ error: 'Webhook processing failed' });
  }
});

export default router;
