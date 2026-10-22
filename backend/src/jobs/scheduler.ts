import cron from 'node-cron';
import { updateInvoiceAging } from './updateAging';
import { sendAutomatedReminders } from './sendReminders';
import { checkHighValueAlerts } from './checkAlerts';

export const startScheduledJobs = (): void => {
  // Update invoice aging daily at 1 AM
  cron.schedule('0 1 * * *', async () => {
    console.log('Running scheduled job: Update invoice aging');
    try {
      await updateInvoiceAging();
      console.log('✓ Invoice aging updated');
    } catch (error) {
      console.error('Error updating invoice aging:', error);
    }
  });

  // Send automated reminders daily at 9 AM
  cron.schedule('0 9 * * *', async () => {
    console.log('Running scheduled job: Send automated reminders');
    try {
      await sendAutomatedReminders();
      console.log('✓ Automated reminders sent');
    } catch (error) {
      console.error('Error sending reminders:', error);
    }
  });

  // Check for high-value alerts every hour
  cron.schedule('0 * * * *', async () => {
    console.log('Running scheduled job: Check high-value alerts');
    try {
      await checkHighValueAlerts();
      console.log('✓ High-value alerts checked');
    } catch (error) {
      console.error('Error checking alerts:', error);
    }
  });

  console.log('Scheduled jobs configured:');
  console.log('  - Update aging: Daily at 1:00 AM');
  console.log('  - Send reminders: Daily at 9:00 AM');
  console.log('  - Check alerts: Every hour');
};
