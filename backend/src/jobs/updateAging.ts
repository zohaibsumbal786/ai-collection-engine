import db from '../config/database';
import { calculateDaysOverdue, calculateAgingBucket } from '../utils/dateUtils';

export const updateInvoiceAging = async (): Promise<void> => {
  try {
    // Get all pending and partial invoices
    const invoices: any[] = db.prepare(`
      SELECT id, due_date FROM invoices WHERE status IN ('pending', 'partial')
    `).all();

    const updateStmt = db.prepare(`
      UPDATE invoices 
      SET days_overdue = ?, aging_bucket = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `);

    let updated = 0;

    invoices.forEach(invoice => {
      const daysOverdue = calculateDaysOverdue(invoice.due_date);
      const agingBucket = calculateAgingBucket(daysOverdue);
      
      updateStmt.run(daysOverdue, agingBucket, invoice.id);
      updated++;
    });

    console.log(`Updated aging for ${updated} invoices`);
  } catch (error) {
    console.error('Error updating invoice aging:', error);
    throw error;
  }
};
