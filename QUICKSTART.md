# Quick Start Guide - AI Collection Engine

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Node.js 18+ installed
- npm or yarn
- Git (optional)

### Step 1: Install Dependencies

**Windows:**
```cmd
setup.bat
```

**Mac/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

**Manual Installation:**
```bash
# Install all dependencies
npm install
cd backend && npm install
cd ../frontend && npm install
```

### Step 2: Configure Environment

1. Copy environment files:
```bash
# Backend
copy backend\.env.example backend\.env

# Frontend  
copy frontend\.env.example frontend\.env
```

2. Edit `backend/.env` with your API keys (optional for testing):
```env
ANTHROPIC_API_KEY=your-key-here
STRIPE_SECRET_KEY=sk_test_your-key
RESEND_API_KEY=re_your-key
```

**Note:** The app works without API keys in development mode (simulated emails/payments)

### Step 3: Initialize Database

```bash
cd backend
npm run init-db
```

This creates sample data:
- 5 customers
- 10 invoices
- Default admin user

### Step 4: Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend runs on: http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```
Frontend opens at: http://localhost:3000

### Step 5: Login

```
Email: admin@example.com
Password: admin123
```

## 🎯 What to Try First

### 1. Explore Dashboard
- View total outstanding amount
- Check aging analysis chart
- See cash flow trends
- Review high-value overdue invoices

### 2. Manage Invoices
- Go to Invoices page
- Filter by status or aging bucket
- Click on an invoice to see details

### 3. Generate AI Reminder
- Select an overdue invoice
- Click "Generate Reminder"
- AI creates personalized message
- Send via email (simulated in dev mode)

### 4. View Analytics
- Check collection efficiency
- Analyze aging buckets
- Review top customers by overdue amount

### 5. Configure Settings
- Adjust reminder schedules
- Set high-value threshold
- Enable/disable automation rules

## 📊 Sample Data Included

The database comes pre-loaded with:
- **5 Customers**: Various companies with different payment histories
- **10 Invoices**: Mix of paid, pending, and overdue
- **Aging Buckets**: 0-30, 31-60, 61-90, 90+ days
- **Payment History**: Sample payments for analytics

## 🔧 Common Tasks

### Create New Invoice
1. Go to Invoices → New Invoice
2. Select customer
3. Enter amount and due date
4. Save

### Send Reminder
1. Go to Reminders
2. Click "Generate" for an invoice
3. AI creates personalized message
4. Review and send

### View Customer Details
1. Go to Customers
2. Click on a customer
3. See all invoices and payment history

### Check Alerts
1. Dashboard shows high-value overdue
2. Settings → Alerts for notifications
3. Configure alert thresholds

## 🤖 Automation Features

The system automatically:
- **Updates aging daily** (1 AM)
- **Sends reminders** (9 AM):
  - Day 7: Friendly reminder
  - Day 30: Firm reminder
  - Day 60: Escalated + alert
- **Checks high-value invoices** (hourly)
- **Generates payment links**

## 🔑 API Keys (Optional)

### For Full Functionality:

**Anthropic Claude (AI Messages):**
1. Sign up at console.anthropic.com
2. Get API key ($5 free credit)
3. Add to backend/.env

**Stripe (Payments):**
1. Sign up at stripe.com
2. Get test mode keys
3. Add to both .env files

**Resend (Emails):**
1. Sign up at resend.com
2. Get API key (100 free emails/day)
3. Add to backend/.env

**Without API keys:** System uses fallback templates and simulated services

## 📱 Mobile Responsive

The app works on:
- Desktop (optimized)
- Tablet
- Mobile phones

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Change port in backend/.env
PORT=5001
```

### Database Locked
```bash
# Delete and recreate
cd backend
del database.sqlite
npm run init-db
```

### Dependencies Error
```bash
# Clear and reinstall
rmdir /s /q node_modules
npm install
```

### Can't Login
- Verify database was initialized
- Check backend is running
- Use: admin@example.com / admin123

## 📚 Next Steps

1. **Customize**: Modify aging buckets and thresholds
2. **Add Data**: Create your own customers and invoices
3. **Test AI**: Generate reminders with different tones
4. **Deploy**: Follow DEPLOYMENT.md for production
5. **Integrate**: Connect real payment gateway

## 💡 Tips

- Use Chrome DevTools to inspect API calls
- Check backend console for logs
- Sample data resets on `npm run init-db`
- Scheduled jobs run automatically in background

## 🆘 Need Help?

- Check README.md for detailed documentation
- Review DEPLOYMENT.md for production setup
- Inspect browser console for frontend errors
- Check backend terminal for API errors

## 🎉 You're Ready!

Start managing your accounts receivable with AI-powered automation!
