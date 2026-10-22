import { Router, Response } from 'express';
import { body, validationResult } from 'express-validator';
import db from '../config/database';
import { authenticateToken, AuthRequest } from '../middleware/auth.middleware';
import { calculateAgingBucket, calculateDaysOverdue } from '../utils/dateUtils';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Get all invoices with filters
router.get('/', (req: AuthRequest, res: Response) => {
  try {
    const { status, aging_bucket, customer_id, sort = 'due_date', order = 'ASC' } = req.query;

    let query = `
      SELECT i.*, c.name as customer_name, c.email as customer_email, c.company
      FROM invoices i
      LEFT JOIN customers c ON i.customer_id = c.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (status) {
      query += ' AND i.status = ?';
      params.push(status);
    }

    if (aging_bucket) {
      query += ' AND i.aging_bucket = ?';
      params.push(aging_bucket);
    }

    if (customer_id) {
      query += ' AND i.customer_id = ?';
      params.push(customer_id);
    }

    query += ` ORDER BY i.${sort} ${order}`;

    const invoices = db.prepare(query).all(...params);
    res.json({ invoices, count: invoices.length });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
});

// Get single invoice
router.get('/:id', (req: AuthRequest, res: Response) => {
  try {
    const invoice: any = db.prepare(`
      SELECT i.*, c.name as customer_name, c.email as customer_email, 
             c.phone as customer_phone, c.company
      FROM invoices i
      LEFT JOIN customers c ON i.customer_id = c.id
      WHERE i.id = ?
    `).get(req.params.id);

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    // Get payments for this invoice
    const payments = db.prepare('SELECT * FROM payments WHERE invoice_id = ?').all(req.params.id);

    // Get reminders for this invoice
    const reminders = db.prepare('SELECT * FROM reminders WHERE invoice_id = ?').all(req.params.id);

    res.json({ invoice, payments, reminders });
  } catch (error) {
    console.error('Error fetching invoice:', error);
    res.status(500).json({ error: 'Failed to fetch invoice' });
  }
});

// Create invoice
router.post(
  '/',
  [
    body('customer_id').isInt(),
    body('amount').isFloat({ min: 0 }),
    body('due_date').isISO8601(),
    body('invoice_number').notEmpty()
  ],
  (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { customer_id, amount, due_date, invoice_number, description } = req.body;
    const issue_date = new Date().toISOString().split('T')[0];

    try {
      const daysOverdue = calculateDaysOverdue(due_date);
      const agingBucket = calculateAgingBucket(daysOverdue);

      const result = db.prepare(`
        INSERT INTO invoices (invoice_number, customer_id, amount, due_date, issue_date, 
                             days_overdue, aging_bucket, description, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(invoice_number, customer_id, amount, due_date, issue_date, daysOverdue, agingBucket, description || '', 'pending');

      const invoice = db.prepare('SELECT * FROM invoices WHERE id = ?').get(result.lastInsertRowid);

      res.status(201).json({ message: 'Invoice created successfully', invoice });
    } catch (error) {
      console.error('Error creating invoice:', error);
      res.status(500).json({ error: 'Failed to create invoice' });
    }
  }
);

// Update invoice
router.put('/:id', (req: AuthRequest, res: Response) => {
  try {
    const { amount, due_date, status, description } = req.body;
    const updates: string[] = [];
    const params: any[] = [];

    if (amount !== undefined) {
      updates.push('amount = ?');
      params.push(amount);
    }
    if (due_date !== undefined) {
      updates.push('due_date = ?');
      params.push(due_date);
      
      const daysOverdue = calculateDaysOverdue(due_date);
      const agingBucket = calculateAgingBucket(daysOverdue);
      updates.push('days_overdue = ?', 'aging_bucket = ?');
      params.push(daysOverdue, agingBucket);
    }
    if (status !== undefined) {
      updates.push('status = ?');
      params.push(status);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      params.push(description);
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(req.params.id);

    db.prepare(`UPDATE invoices SET ${updates.join(', ')} WHERE id = ?`).run(...params);

    const invoice = db.prepare('SELECT * FROM invoices WHERE id = ?').get(req.params.id);
    res.json({ message: 'Invoice updated successfully', invoice });
  } catch (error) {
    console.error('Error updating invoice:', error);
    res.status(500).json({ error: 'Failed to update invoice' });
  }
});

// Delete invoice
router.delete('/:id', (req: AuthRequest, res: Response) => {
  try {
    db.prepare('DELETE FROM invoices WHERE id = ?').run(req.params.id);
    res.json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    console.error('Error deleting invoice:', error);
    res.status(500).json({ error: 'Failed to delete invoice' });
  }
});

export default router;
