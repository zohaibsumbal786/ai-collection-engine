import db from '../config/database';
import emailService from '../services/email.service';

export const checkHighValueAlerts = async (): Promise<void> => {
  try {
    const highValueThreshold = parseFloat(process.env.HIGH_VALUE_THRESHOLD || '10000');

    // Find high-value invoices that are overdue
    const highValueInvoices: any[] = db.prepare(`
      SELECT i.*, c.name as customer_name, c.email as customer_email
      FROM invoices i
      LEFT JOIN customers c ON i.customer_id = c.id
      WHERE i.status IN ('pending', 'partial')
        AND i.amount >= ?
        AND i.days_overdue > 0
    `).all(highValueThreshold);

    for (const invoice of highValueInvoices) {
      // Check if alert already exists for today
      const existingAlert = db.prepare(`
        SELECT id FROM alerts 
        WHERE invoice_id = ? 
          AND type = 'high_value_overdue'
          AND DATE(created_at) = DATE('now')
      `).get(invoice.id);

      if (existingAlert) {
        continue; // Skip if alert already created today
      }

      // Create alert
      const priority = invoice.days_overdue > 30 ? 'critical' : 
                      invoice.days_overdue > 7 ? 'high' : 'medium';

      db.prepare(`
        INSERT INTO alerts (invoice_id, type, priority, message, status)
        VALUES (?, ?, ?, ?, ?)
      `).run(
        invoice.id,
        'high_value_overdue',
        priority,
        `High-value invoice ${invoice.invoice_number} for ${invoice.customer_name} is ${invoice.days_overdue} days overdue ($${invoice.amount.toFixed(2)})`,
        'unread'
      );

      // Send email notification to account owners
      // In production, you'd get the account owner's email from the database
      const accountOwnerEmail = process.env.ACCOUNT_OWNER_EMAIL || 'admin@example.com';

      await emailService.sendAlert(
        accountOwnerEmail,
        `HIGH VALUE ALERT: Invoice ${invoice.invoice_number} Overdue`,
        `
        URGENT: High-Value Invoice Alert
        
        Invoice: ${invoice.invoice_number}
        Customer: ${invoice.customer_name}
        Amount: $${invoice.amount.toFixed(2)}
        Days Overdue: ${invoice.days_overdue}
        Due Date: ${invoice.due_date}
        
        This invoice exceeds the high-value threshold of $${highValueThreshold.toFixed(2)}.
        Immediate action is recommended.
        
        Please review and take appropriate action.
        `
      );

      console.log(`✓ Created high-value alert for invoice ${invoice.invoice_number}`);
    }

    if (highValueInvoices.length > 0) {
      console.log(`Processed ${highValueInvoices.length} high-value alerts`);
    }
  } catch (error) {
    console.error('Error checking high-value alerts:', error);
    throw error;
  }
};
