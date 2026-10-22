import { Router, Response } from 'express';
import { body, validationResult } from 'express-validator';
import db from '../config/database';
import { authenticateToken, AuthRequest } from '../middleware/auth.middleware';

const router = Router();
router.use(authenticateToken);

// Get all customers
router.get('/', (req: AuthRequest, res: Response) => {
  try {
    const customers = db.prepare(`
      SELECT c.*, 
             COUNT(i.id) as invoice_count,
             COALESCE(SUM(CASE WHEN i.status = 'pending' THEN i.amount ELSE 0 END), 0) as outstanding_amount
      FROM customers c
      LEFT JOIN invoices i ON c.id = i.customer_id
      GROUP BY c.id
      ORDER BY c.name
    `).all();

    res.json({ customers, count: customers.length });
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// Get single customer
router.get('/:id', (req: AuthRequest, res: Response) => {
  try {
    const customer = db.prepare('SELECT * FROM customers WHERE id = ?').get(req.params.id);
    
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const invoices = db.prepare('SELECT * FROM invoices WHERE customer_id = ? ORDER BY due_date DESC').all(req.params.id);
    
    res.json({ customer, invoices });
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
});

// Create customer
router.post(
  '/',
  [
    body('name').trim().notEmpty(),
    body('email').isEmail().normalizeEmail(),
    body('phone').optional(),
    body('company').optional(),
    body('credit_limit').optional().isFloat({ min: 0 })
  ],
  (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, company, credit_limit, payment_terms } = req.body;

    try {
      const result = db.prepare(`
        INSERT INTO customers (name, email, phone, company, credit_limit, payment_terms)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(name, email, phone || null, company || null, credit_limit || 0, payment_terms || 30);

      const customer = db.prepare('SELECT * FROM customers WHERE id = ?').get(result.lastInsertRowid);

      res.status(201).json({ message: 'Customer created successfully', customer });
    } catch (error) {
      console.error('Error creating customer:', error);
      res.status(500).json({ error: 'Failed to create customer' });
    }
  }
);

// Update customer
router.put('/:id', (req: AuthRequest, res: Response) => {
  try {
    const { name, email, phone, company, credit_limit, payment_terms, status } = req.body;
    const updates: string[] = [];
    const params: any[] = [];

    if (name) {
      updates.push('name = ?');
      params.push(name);
    }
    if (email) {
      updates.push('email = ?');
      params.push(email);
    }
    if (phone !== undefined) {
      updates.push('phone = ?');
      params.push(phone);
    }
    if (company !== undefined) {
      updates.push('company = ?');
      params.push(company);
    }
    if (credit_limit !== undefined) {
      updates.push('credit_limit = ?');
      params.push(credit_limit);
    }
    if (payment_terms !== undefined) {
      updates.push('payment_terms = ?');
      params.push(payment_terms);
    }
    if (status) {
      updates.push('status = ?');
      params.push(status);
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(req.params.id);

    db.prepare(`UPDATE customers SET ${updates.join(', ')} WHERE id = ?`).run(...params);

    const customer = db.prepare('SELECT * FROM customers WHERE id = ?').get(req.params.id);
    res.json({ message: 'Customer updated successfully', customer });
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({ error: 'Failed to update customer' });
  }
});

// Delete customer
router.delete('/:id', (req: AuthRequest, res: Response) => {
  try {
    db.prepare('DELETE FROM customers WHERE id = ?').run(req.params.id);
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({ error: 'Failed to delete customer' });
  }
});

export default router;
