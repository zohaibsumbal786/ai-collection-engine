import { Router, Response } from 'express';
import db from '../config/database';
import { authenticateToken, AuthRequest } from '../middleware/auth.middleware';

const router = Router();
router.use(authenticateToken);

// Get all settings
router.get('/', (req: AuthRequest, res: Response) => {
  try {
    const settings = db.prepare('SELECT * FROM settings ORDER BY key').all();
    
    // Convert to key-value object
    const settingsObj: any = {};
    settings.forEach((setting: any) => {
      settingsObj[setting.key] = {
        value: setting.value,
        description: setting.description,
        updated_at: setting.updated_at
      };
    });

    res.json({ settings: settingsObj });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// Update setting
router.put('/:key', (req: AuthRequest, res: Response) => {
  try {
    const { key } = req.params;
    const { value } = req.body;

    if (value === undefined) {
      return res.status(400).json({ error: 'Value is required' });
    }

    db.prepare(`
      UPDATE settings SET value = ?, updated_at = CURRENT_TIMESTAMP WHERE key = ?
    `).run(value, key);

    const setting = db.prepare('SELECT * FROM settings WHERE key = ?').get(key);

    res.json({ message: 'Setting updated successfully', setting });
  } catch (error) {
    console.error('Error updating setting:', error);
    res.status(500).json({ error: 'Failed to update setting' });
  }
});

// Get alerts
router.get('/alerts', (req: AuthRequest, res: Response) => {
  try {
    const { status = 'unread' } = req.query;

    const alerts = db.prepare(`
      SELECT a.*, i.invoice_number, i.amount, c.name as customer_name
      FROM alerts a
      LEFT JOIN invoices i ON a.invoice_id = i.id
      LEFT JOIN customers c ON i.customer_id = c.id
      WHERE a.status = ?
      ORDER BY a.created_at DESC
      LIMIT 50
    `).all(status);

    res.json({ alerts, count: alerts.length });
  } catch (error) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

// Mark alert as read
router.put('/alerts/:id/read', (req: AuthRequest, res: Response) => {
  try {
    db.prepare('UPDATE alerts SET status = ? WHERE id = ?').run('read', req.params.id);
    res.json({ message: 'Alert marked as read' });
  } catch (error) {
    console.error('Error updating alert:', error);
    res.status(500).json({ error: 'Failed to update alert' });
  }
});

export default router;
