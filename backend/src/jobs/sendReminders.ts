import db from '../config/database';
import aiService from '../services/ai.service';
import emailService from '../services/email.service';
import paymentService from '../services/payment.service';

export const sendAutomatedReminders = async (): Promise<void> => {
  try {
    // Get settings
    const settings: any = {};
    const settingsRows: any[] = db.prepare('SELECT key, value FROM settings').all();
    settingsRows.forEach(row => {
      settings[row.key] = row.value;
    });

    const remindersToSend: Array<{
      invoice: any;
      type: 'friendly' | 'firm' | 'escalated';
    }> = [];

    // Find invoices that need reminders
    const invoices: any[] = db.prepare(`
      SELECT i.*, c.name as customer_name, c.email as customer_email, c.company
      FROM invoices i
      LEFT JOIN customers c ON i.customer_id = c.id
      WHERE i.status IN ('pending', 'partial')
        AND i.days_overdue > 0
    `).all();

    for (const invoice of invoices) {
      // Check if reminder was already sent today
      const todayReminder = db.prepare(`
        SELECT id FROM reminders 
        WHERE invoice_id = ? 
          AND DATE(sent_date) = DATE('now')
          AND status = 'sent'
      `).get(invoice.id);

      if (todayReminder) {
        continue; // Skip if already sent today
      }

      // Determine reminder type based on days overdue
      let reminderType: 'friendly' | 'firm' | 'escalated' | null = null;

      if (invoice.days_overdue === 7 && settings.reminder_day_7 === 'true') {
        reminderType = 'friendly';
      } else if (invoice.days_overdue === 30 && settings.reminder_day_30 === 'true') {
        reminderType = 'firm';
      } else if (invoice.days_overdue === 60 && settings.reminder_day_60 === 'true') {
        reminderType = 'escalated';
      }

      if (reminderType) {
        remindersToSend.push({ invoice, type: reminderType });
      }
    }

    console.log(`Found ${remindersToSend.length} reminders to send`);

    // Generate and send reminders
    for (const { invoice, type } of remindersToSend) {
      try {
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
          INSERT INTO reminders (invoice_id, type, channel, message, recipient, status, sent_date)
          VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        `).run(invoice.id, type, 'email', finalMessage, invoice.customer_email, 'sent');

        // Send email
        await emailService.sendReminder({
          to: invoice.customer_email,
          subject: `Payment Reminder: Invoice ${invoice.invoice_number}`,
          message: finalMessage
        });

        console.log(`✓ Sent ${type} reminder for invoice ${invoice.invoice_number}`);

        // If escalated, create alert for account owner
        if (type === 'escalated') {
          db.prepare(`
            INSERT INTO alerts (invoice_id, type, priority, message, status)
            VALUES (?, ?, ?, ?, ?)
          `).run(
            invoice.id,
            'escalated_reminder',
            'high',
            `Invoice ${invoice.invoice_number} for ${invoice.customer_name} is 60+ days overdue ($${invoice.amount})`,
            'unread'
          );
        }
      } catch (error) {
        console.error(`Error sending reminder for invoice ${invoice.id}:`, error);
      }
    }

    console.log(`Sent ${remindersToSend.length} automated reminders`);
  } catch (error) {
    console.error('Error in sendAutomatedReminders:', error);
    throw error;
  }
};
