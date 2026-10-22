import { Router, Response } from 'express';
import db from '../config/database';
import { authenticateToken, AuthRequest } from '../middleware/auth.middleware';

const router = Router();
router.use(authenticateToken);

// Dashboard metrics
router.get('/dashboard', (req: AuthRequest, res: Response) => {
  try {
    // Total outstanding
    const outstanding: any = db.prepare(`
      SELECT COALESCE(SUM(amount), 0) as total 
      FROM invoices 
      WHERE status IN ('pending', 'partial')
    `).get();

    // Aging buckets
    const agingBuckets = db.prepare(`
      SELECT 
        aging_bucket,
        COUNT(*) as count,
        COALESCE(SUM(amount), 0) as total_amount
      FROM invoices
      WHERE status IN ('pending', 'partial')
      GROUP BY aging_bucket
    `).all();

    // Recent activity
    const recentActivity = db.prepare(`
      SELECT 
        'payment' as type,
        p.amount,
        p.payment_date as date,
        i.invoice_number,
        c.name as customer_name
      FROM payments p
      LEFT JOIN invoices i ON p.invoice_id = i.id
      LEFT JOIN customers c ON i.customer_id = c.id
      ORDER BY p.payment_date DESC
      LIMIT 10
    `).all();

    // High value overdue
    const highValueThreshold = parseFloat(process.env.HIGH_VALUE_THRESHOLD || '10000');
    const highValueOverdue = db.prepare(`
      SELECT i.*, c.name as customer_name, c.email as customer_email
      FROM invoices i
      LEFT JOIN customers c ON i.customer_id = c.id
      WHERE i.status IN ('pending', 'partial')
        AND i.amount >= ?
        AND i.days_overdue > 0
      ORDER BY i.amount DESC
    `).all(highValueThreshold);

    // Collection rate (last 30 days)
    const collectionStats: any = db.prepare(`
      SELECT 
        COUNT(CASE WHEN status = 'paid' THEN 1 END) as paid_count,
        COUNT(*) as total_count,
        COALESCE(SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END), 0) as paid_amount,
        COALESCE(SUM(amount), 0) as total_amount
      FROM invoices
      WHERE created_at >= date('now', '-30 days')
    `).get();

    const collectionRate = collectionStats.total_count > 0 
      ? (collectionStats.paid_count / collectionStats.total_count * 100).toFixed(2)
      : '0';

    // DSO (Days Sales Outstanding)
    const dso: any = db.prepare(`
      SELECT 
        COALESCE(AVG(julianday('now') - julianday(due_date)), 0) as avg_days
      FROM invoices
      WHERE status IN ('pending', 'partial')
    `).get();

    res.json({
      totalOutstanding: outstanding.total,
      agingBuckets,
      recentActivity,
      highValueOverdue,
      collectionRate: parseFloat(collectionRate),
      dso: Math.round(dso.avg_days),
      stats: {
        totalInvoices: collectionStats.total_count,
        paidInvoices: collectionStats.paid_count,
        paidAmount: collectionStats.paid_amount
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard metrics' });
  }
});

// Cash flow predictions
router.get('/cash-flow', (req: AuthRequest, res: Response) => {
  try {
    const { days = 90 } = req.query;

    // Historical payments (last 90 days)
    const historicalPayments = db.prepare(`
      SELECT 
        DATE(payment_date) as date,
        SUM(amount) as amount
      FROM payments
      WHERE payment_date >= date('now', '-${days} days')
      GROUP BY DATE(payment_date)
      ORDER BY date
    `).all();

    // Expected payments (upcoming invoices)
    const expectedPayments = db.prepare(`
      SELECT 
        DATE(due_date) as date,
        SUM(amount) as amount
      FROM invoices
      WHERE status IN ('pending', 'partial')
        AND due_date <= date('now', '+${days} days')
      GROUP BY DATE(due_date)
      ORDER BY date
    `).all();

    // Calculate trend
    const last30Days: any = db.prepare(`
      SELECT COALESCE(SUM(amount), 0) as total
      FROM payments
      WHERE payment_date >= date('now', '-30 days')
    `).get();

    const previous30Days: any = db.prepare(`
      SELECT COALESCE(SUM(amount), 0) as total
      FROM payments
      WHERE payment_date >= date('now', '-60 days')
        AND payment_date < date('now', '-30 days')
    `).get();

    const trend = previous30Days.total > 0
      ? ((last30Days.total - previous30Days.total) / previous30Days.total * 100).toFixed(2)
      : '0';

    res.json({
      historical: historicalPayments,
      expected: expectedPayments,
      trend: parseFloat(trend),
      summary: {
        last30Days: last30Days.total,
        previous30Days: previous30Days.total
      }
    });
  } catch (error) {
    console.error('Error fetching cash flow data:', error);
    res.status(500).json({ error: 'Failed to fetch cash flow data' });
  }
});

// Aging analysis
router.get('/aging', (req: AuthRequest, res: Response) => {
  try {
    const agingData = db.prepare(`
      SELECT 
        aging_bucket,
        COUNT(*) as invoice_count,
        COALESCE(SUM(amount), 0) as total_amount,
        COALESCE(AVG(amount), 0) as avg_amount,
        MIN(days_overdue) as min_days,
        MAX(days_overdue) as max_days
      FROM invoices
      WHERE status IN ('pending', 'partial')
      GROUP BY aging_bucket
      ORDER BY 
        CASE aging_bucket
          WHEN '0-30' THEN 1
          WHEN '31-60' THEN 2
          WHEN '61-90' THEN 3
          WHEN '90+' THEN 4
        END
    `).all();

    // Customer aging breakdown
    const customerAging = db.prepare(`
      SELECT 
        c.id,
        c.name,
        c.company,
        COUNT(i.id) as overdue_count,
        COALESCE(SUM(i.amount), 0) as overdue_amount,
        MAX(i.days_overdue) as max_days_overdue
      FROM customers c
      LEFT JOIN invoices i ON c.id = i.customer_id 
        AND i.status IN ('pending', 'partial')
        AND i.days_overdue > 0
      GROUP BY c.id
      HAVING overdue_count > 0
      ORDER BY overdue_amount DESC
      LIMIT 20
    `).all();

    res.json({
      agingBuckets: agingData,
      topCustomers: customerAging
    });
  } catch (error) {
    console.error('Error fetching aging analysis:', error);
    res.status(500).json({ error: 'Failed to fetch aging analysis' });
  }
});

// Collection efficiency
router.get('/efficiency', (req: AuthRequest, res: Response) => {
  try {
    // Average days to payment
    const avgDaysToPayment: any = db.prepare(`
      SELECT 
        COALESCE(AVG(julianday(p.payment_date) - julianday(i.issue_date)), 0) as avg_days
      FROM payments p
      LEFT JOIN invoices i ON p.invoice_id = i.id
      WHERE p.payment_date >= date('now', '-90 days')
    `).get();

    // Reminder effectiveness
    const reminderStats = db.prepare(`
      SELECT 
        r.type,
        COUNT(DISTINCT r.invoice_id) as sent_count,
        COUNT(DISTINCT CASE WHEN i.status = 'paid' THEN r.invoice_id END) as paid_count
      FROM reminders r
      LEFT JOIN invoices i ON r.invoice_id = i.id
      WHERE r.status = 'sent'
        AND r.sent_date >= date('now', '-90 days')
      GROUP BY r.type
    `).all();

    // Monthly collection trends
    const monthlyTrends = db.prepare(`
      SELECT 
        strftime('%Y-%m', payment_date) as month,
        COUNT(*) as payment_count,
        COALESCE(SUM(amount), 0) as total_amount
      FROM payments
      WHERE payment_date >= date('now', '-12 months')
      GROUP BY month
      ORDER BY month
    `).all();

    res.json({
      avgDaysToPayment: Math.round(avgDaysToPayment.avg_days),
      reminderEffectiveness: reminderStats,
      monthlyTrends
    });
  } catch (error) {
    console.error('Error fetching efficiency metrics:', error);
    res.status(500).json({ error: 'Failed to fetch efficiency metrics' });
  }
});

export default router;
