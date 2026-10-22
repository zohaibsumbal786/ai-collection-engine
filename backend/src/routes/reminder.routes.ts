import { Router, Response } from 'express';
import db from '../config/database';
import { authenticateToken, AuthRequest } from '../middleware/auth.middleware';
import aiService from '../services/ai.service';
import emailService from '../services/email.service';
import paymentService from '../services/payment.service';

const router = Router();
router.use(authenticateToken);

// Get all reminders
router.get('/', (req: AuthRequest, res: Response) => {
  try {
    const { invoice_id, status } = req.query;
    
    let query = `
      SELECT r.*, i.invoice_number, i.amount, c.name as customer_name
      FROM reminders r
      LEFT JOIN invoices i ON r.invoice_id = i.id
      LEFT JOIN customers c ON i.customer_id = c.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (invoice_id) {
      query += ' AND r.invoice_id = ?';
      params.push(invoice_id);
    }

    if (status) {
      query += ' AND r.status = ?';
      params.push(status);
    }

    query += ' ORDER BY r.created_at DESC';

    const reminders = db.prepare(query).all(...params);
    res.json({ reminders, count: reminders.length });
  } catch (error) {
    console.error('Error fetching reminders:', error);
    res.status(500).json({ error: 'Failed to fetch reminders' });
  }
});

// Generate AI reminder for an invoice
router.post('/generate/:invoiceId', async (req: AuthRequest, res: Response) => {
  try {
    const { invoiceId } = req.params;
    const { reminderType } = req.body;

    // Get invoice details
    const invoice: any = db.prepare(`
      SELECT i.*, c.name as customer_name, c.email as customer_email, c.company
      FROM invoices i
      LEFT JOIN customers c ON i.customer_id = c.id
      WHERE i.id = ?
    `).get(invoiceId);

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    // Determine reminder type based on days overdue if not specified
    let type = reminderType;
    if (!type) {
      if (invoice.days_overdue <= 15) type = 'friendly';
      else if (invoice.days_overdue <= 45) type = 'firm';
      else type = 'escalated';
    }

    // Generate AI message
    const message = await aiService.generateReminderMessage({
      customerName: invoice.customer_name,
      companyName: invoice.company,
      invoiceNumber: invoice.invoice_number,
      amount: invoice.amount,
      dueDate: invoice.due_date,
      daysOverdue: invoice.days_overdue,
      reminderType: type
    });

    // Create payment link
    const paymentLink = await paymentService.createPaymentLink(invoice.id, invoice.amount);

    // Replace placeholder with actual payment link
    const finalMessage = message.replace('[PAYMENT_LINK]', paymentLink);

    // Save reminder
    const result = db.prepare(`
      INSERT INTO reminders (invoice_id, type, channel, message, recipient, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(invoiceId, type, 'email', finalMessage, invoice.customer_email, 'draft');

    const reminder = db.prepare('SELECT * FROM reminders WHERE id = ?').get(result.lastInsertRowid);

    res.json({ 
      message: 'Reminder generated successfully', 
      reminder,
      paymentLink 
    });
  } catch (error) {
    console.error('Error generating reminder:', error);
    res.status(500).json({ error: 'Failed to generate reminder' });
  }
});

// Send reminder
router.post('/send/:reminderId', async (req: AuthRequest, res: Response) => {
  try {
    const { reminderId } = req.params;

    const reminder: any = db.prepare(`
      SELECT r.*, i.invoice_number, c.name as customer_name, c.email as customer_email
      FROM reminders r
      LEFT JOIN invoices i ON r.invoice_id = i.id
      LEFT JOIN customers c ON i.customer_id = c.id
      WHERE r.id = ?
    `).get(reminderId);

    if (!reminder) {
      return res.status(404).json({ error: 'Reminder not found' });
    }

    if (reminder.status === 'sent') {
      return res.status(400).json({ error: 'Reminder already sent' });
    }

    // Send email
    await emailService.sendReminder({
      to: reminder.customer_email,
      subject: `Payment Reminder: Invoice ${reminder.invoice_number}`,
      message: reminder.message
    });

    // Update reminder status
    db.prepare(`
      UPDATE reminders SET status = 'sent', sent_date = CURRENT_TIMESTAMP WHERE id = ?
    `).run(reminderId);

    res.json({ message: 'Reminder sent successfully' });
  } catch (error) {
    console.error('Error sending reminder:', error);
    res.status(500).json({ error: 'Failed to send reminder' });
  }
});

// Bulk send reminders
router.post('/send-bulk', async (req: AuthRequest, res: Response) => {
  try {
    const { reminderIds } = req.body;

    if (!Array.isArray(reminderIds) || reminderIds.length === 0) {
      return res.status(400).json({ error: 'Invalid reminder IDs' });
    }

    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[]
    };

    for (const id of reminderIds) {
      try {
        const reminder: any = db.prepare(`
          SELECT r.*, c.email as customer_email, i.invoice_number
          FROM reminders r
          LEFT JOIN invoices i ON r.invoice_id = i.id
          LEFT JOIN customers c ON i.customer_id = c.id
          WHERE r.id = ?
        `).get(id);

        if (reminder && reminder.status !== 'sent') {
          await emailService.sendReminder({
            to: reminder.customer_email,
            subject: `Payment Reminder: Invoice ${reminder.invoice_number}`,
            message: reminder.message
          });

          db.prepare(`
            UPDATE reminders SET status = 'sent', sent_date = CURRENT_TIMESTAMP WHERE id = ?
          `).run(id);

          results.success++;
        }
      } catch (error: any) {
        results.failed++;
        results.errors.push(`Reminder ${id}: ${error.message}`);
      }
    }

    res.json({ 
      message: 'Bulk send completed', 
      results 
    });
  } catch (error) {
    console.error('Error in bulk send:', error);
    res.status(500).json({ error: 'Failed to send reminders' });
  }
});

export default router;
