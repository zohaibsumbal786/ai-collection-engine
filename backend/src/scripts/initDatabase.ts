import bcrypt from 'bcryptjs';
import db, { initializeDatabase } from '../config/database';

const seedData = async () => {
  console.log('Initializing database...');
  
  await initializeDatabase();

  // Create default admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  try {
    db.prepare(`
      INSERT OR IGNORE INTO users (email, password, name, role) 
      VALUES (?, ?, ?, ?)
    `).run('admin@example.com', hashedPassword, 'Admin User', 'admin');
    console.log('✓ Default admin user created (admin@example.com / admin123)');
  } catch (error) {
    console.log('Admin user already exists');
  }

  // Create sample customers
  const customers = [
    { name: 'Acme Corporation', email: 'billing@acme.com', phone: '+1-555-0101', company: 'Acme Corp', credit_limit: 50000 },
    { name: 'TechStart Inc', email: 'accounts@techstart.com', phone: '+1-555-0102', company: 'TechStart', credit_limit: 25000 },
    { name: 'Global Solutions', email: 'finance@globalsol.com', phone: '+1-555-0103', company: 'Global Solutions Ltd', credit_limit: 75000 },
    { name: 'Innovate Labs', email: 'billing@innovatelabs.com', phone: '+1-555-0104', company: 'Innovate Labs', credit_limit: 30000 },
    { name: 'Enterprise Systems', email: 'ap@entsys.com', phone: '+1-555-0105', company: 'Enterprise Systems', credit_limit: 100000 }
  ];

  customers.forEach(customer => {
    try {
      db.prepare(`
        INSERT INTO customers (name, email, phone, company, credit_limit, payment_terms)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(customer.name, customer.email, customer.phone, customer.company, customer.credit_limit, 30);
    } catch (error) {
      // Customer might already exist
    }
  });
  console.log('✓ Sample customers created');

  // Create sample invoices
  const today = new Date();
  const invoices = [
    { invoice_number: 'INV-2024-001', customer_id: 1, amount: 15000, days_ago: 45, status: 'pending' },
    { invoice_number: 'INV-2024-002', customer_id: 2, amount: 8500, days_ago: 15, status: 'pending' },
    { invoice_number: 'INV-2024-003', customer_id: 3, amount: 25000, days_ago: 70, status: 'pending' },
    { invoice_number: 'INV-2024-004', customer_id: 1, amount: 5000, days_ago: 5, status: 'pending' },
    { invoice_number: 'INV-2024-005', customer_id: 4, amount: 12000, days_ago: 35, status: 'pending' },
    { invoice_number: 'INV-2024-006', customer_id: 5, amount: 50000, days_ago: 2, status: 'pending' },
    { invoice_number: 'INV-2024-007', customer_id: 2, amount: 3500, days_ago: 95, status: 'pending' },
    { invoice_number: 'INV-2024-008', customer_id: 3, amount: 18000, days_ago: 20, status: 'paid' },
    { invoice_number: 'INV-2024-009', customer_id: 4, amount: 7500, days_ago: 10, status: 'pending' },
    { invoice_number: 'INV-2024-010', customer_id: 5, amount: 32000, days_ago: 55, status: 'pending' }
  ];

  invoices.forEach(inv => {
    try {
      const issueDate = new Date(today);
      issueDate.setDate(issueDate.getDate() - inv.days_ago - 30);
      
      const dueDate = new Date(today);
      dueDate.setDate(dueDate.getDate() - inv.days_ago);

      const daysOverdue = Math.max(0, inv.days_ago);
      const agingBucket = daysOverdue <= 30 ? '0-30' : 
                         daysOverdue <= 60 ? '31-60' : 
                         daysOverdue <= 90 ? '61-90' : '90+';

      db.prepare(`
        INSERT INTO invoices (invoice_number, customer_id, amount, due_date, issue_date, 
                             days_overdue, aging_bucket, status, description)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        inv.invoice_number,
        inv.customer_id,
        inv.amount,
        dueDate.toISOString().split('T')[0],
        issueDate.toISOString().split('T')[0],
        daysOverdue,
        agingBucket,
        inv.status,
        'Professional services rendered'
      );

      // Add payment for paid invoices
      if (inv.status === 'paid') {
        const paymentDate = new Date(today);
        paymentDate.setDate(paymentDate.getDate() - Math.floor(inv.days_ago / 2));

        db.prepare(`
          INSERT INTO payments (invoice_id, amount, payment_date, payment_method, transaction_id, status)
          VALUES (last_insert_rowid(), ?, ?, ?, ?, ?)
        `).run(inv.amount, paymentDate.toISOString(), 'bank_transfer', `TXN-${Date.now()}`, 'completed');
      }
    } catch (error) {
      // Invoice might already exist
    }
  });
  console.log('✓ Sample invoices created');

  console.log('\n✓ Database initialization complete!');
  console.log('\nYou can now start the server with: npm run dev');
  console.log('\nDefault login credentials:');
  console.log('  Email: admin@example.com');
  console.log('  Password: admin123\n');
};

seedData().catch(console.error);
