# 🚀 Get Started with AI Collection Engine

Welcome! This guide will help you get the AI Collection Engine up and running in just a few minutes.

## 📋 What You're Building

A complete, production-ready system that:
- ✅ Automatically tracks invoice aging
- ✅ Generates AI-powered payment reminders
- ✅ Sends automated emails to customers
- ✅ Alerts you about high-value overdue invoices
- ✅ Provides beautiful analytics dashboards
- ✅ Processes payments securely

## ⚡ Quick Start (5 Minutes)

### Step 1: Prerequisites

Make sure you have:
- **Node.js 18+** ([Download here](https://nodejs.org/))
- **npm** (comes with Node.js)
- A code editor (VS Code recommended)
- A terminal/command prompt

Check your versions:
```bash
node --version  # Should be 18.0.0 or higher
npm --version   # Should be 8.0.0 or higher
```

### Step 2: Get the Code

**Option A: Download ZIP**
1. Download the project ZIP file
2. Extract to a folder
3. Open terminal in that folder

**Option B: Clone with Git**
```bash
git clone <repository-url>
cd ai-collection-engine
```

### Step 3: Install Everything

**Windows:**
```cmd
setup.bat
```

**Mac/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

This will:
- Install all dependencies (frontend + backend)
- Create environment files
- Initialize the database with sample data
- Set up the default admin user

**Takes about 2-3 minutes depending on your internet speed.**

### Step 4: Start the Application

Open **two terminal windows**:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

You should see:
```
✓ Database initialized
✓ Scheduled jobs started
✓ Server running on port 5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

Your browser will automatically open to `http://localhost:3000`

### Step 5: Login

Use these credentials:
```
Email: admin@example.com
Password: admin123
```

## 🎉 You're In!

You should now see the dashboard with:
- Total outstanding amount
- Collection rate
- Aging analysis chart
- Cash flow trends
- High-value overdue invoices

## 🎯 What to Explore First

### 1. Dashboard (You're Here!)
- Check out the metrics
- Hover over the charts
- Click on high-value invoices

### 2. Invoices Page
- See all 10 sample invoices
- Try the search box
- Filter by status
- Notice the color-coded aging buckets

### 3. Generate an AI Reminder
1. Go to Invoices
2. Find an overdue invoice
3. Click "Generate Reminder" (if button available)
4. See the AI-generated message
5. Notice the payment link included

### 4. Customers Page
- View all 5 sample customers
- See their outstanding balances
- Check invoice counts

### 5. Analytics Page
- View aging distribution chart
- Check top customers by overdue amount
- Review collection efficiency

### 6. Settings Page
- Toggle reminder schedules
- Adjust high-value threshold
- Configure automation rules

## 🤖 Understanding the Automation

The system automatically:

### Daily at 1:00 AM
- Updates all invoice aging
- Recalculates days overdue
- Assigns aging buckets

### Daily at 9:00 AM
- Checks all overdue invoices
- Sends reminders based on rules:
  - **7 days overdue** → Friendly reminder
  - **30 days overdue** → Firm reminder
  - **60 days overdue** → Escalated reminder + alert

### Every Hour
- Monitors high-value invoices (>$10,000)
- Creates alerts for overdue high-value invoices
- Emails account owners

## 📊 Sample Data Explained

The database includes:

### 5 Customers
- Acme Corporation
- TechStart Inc
- Global Solutions
- Innovate Labs
- Enterprise Systems

### 10 Invoices
- Mix of paid, pending, and overdue
- Various amounts ($3,500 to $50,000)
- Different aging buckets
- Realistic due dates

### Why Sample Data?
So you can immediately:
- See how the system works
- Test features without setup
- Understand the workflows
- Generate realistic reports

## 🔧 Optional: Configure API Keys

The system works without API keys (uses fallback templates), but for full functionality:

### 1. Anthropic Claude (AI Messages)
1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up (free $5 credit)
3. Get your API key
4. Add to `backend/.env`:
   ```
   ANTHROPIC_API_KEY=sk-ant-your-key-here
   ```

### 2. Stripe (Payments)
1. Go to [stripe.com](https://stripe.com)
2. Sign up (free test mode)
3. Get test keys from Dashboard
4. Add to `backend/.env`:
   ```
   STRIPE_SECRET_KEY=sk_test_your-key
   ```
5. Add to `frontend/.env`:
   ```
   REACT_APP_STRIPE_PUBLIC_KEY=pk_test_your-key
   ```

### 3. Resend (Emails)
1. Go to [resend.com](https://resend.com)
2. Sign up (100 free emails/day)
3. Get API key
4. Add to `backend/.env`:
   ```
   RESEND_API_KEY=re_your-key
   FROM_EMAIL=noreply@yourdomain.com
   ```

**Restart backend after adding keys:**
```bash
# Stop backend (Ctrl+C)
npm run dev
```

## 🎨 Customizing for Your Business

### Change High-Value Threshold
1. Go to Settings page
2. Update "High Value Threshold"
3. Click Save
4. System now uses your threshold

### Adjust Reminder Schedule
1. Go to Settings page
2. Toggle reminder days on/off
3. Changes apply immediately

### Add Your Customers
1. Go to Customers page
2. Click "New Customer"
3. Fill in details
4. Save

### Create Your Invoices
1. Go to Invoices page
2. Click "New Invoice"
3. Select customer
4. Enter amount and due date
5. Save

## 📱 Mobile Access

The app is fully responsive:
- Open on your phone: `http://your-computer-ip:3000`
- Sidebar collapses to hamburger menu
- Tables scroll horizontally
- Charts resize automatically

## 🐛 Troubleshooting

### "Port 5000 already in use"
Change the port in `backend/.env`:
```
PORT=5001
```

### "Cannot find module"
Reinstall dependencies:
```bash
cd backend && npm install
cd ../frontend && npm install
```

### "Database locked"
Delete and recreate:
```bash
cd backend
del database.sqlite  # Windows
rm database.sqlite   # Mac/Linux
npm run init-db
```

### "Cannot login"
Make sure:
- Backend is running
- Database was initialized
- Using correct credentials: admin@example.com / admin123

### Charts not showing
- Check browser console for errors
- Verify data is loading (Network tab)
- Try refreshing the page

## 📚 Next Steps

### Learn More
- **README.md** - Complete documentation
- **FEATURES.md** - All features explained
- **API_DOCUMENTATION.md** - API reference
- **ARCHITECTURE.md** - System design
- **TESTING_GUIDE.md** - How to test

### Deploy to Production
- **DEPLOYMENT.md** - Step-by-step deployment guide
- Deploy frontend to Vercel (free)
- Deploy backend to Railway (free)
- Configure production API keys

### Customize
- Modify reminder templates
- Adjust aging buckets
- Change color scheme
- Add new features

## 💡 Pro Tips

1. **Keep both terminals open** - You need backend AND frontend running
2. **Check console logs** - Helpful for debugging
3. **Use Chrome DevTools** - Inspect network requests
4. **Sample data resets** - Run `npm run init-db` to reset
5. **Scheduled jobs log** - Watch backend console for automation

## 🎓 Understanding the Code

### Frontend Structure
```
frontend/src/
├── components/     # Reusable UI components
├── pages/          # Page components (Dashboard, Invoices, etc.)
├── services/       # API calls
├── types/          # TypeScript types
└── context/        # React context (Auth)
```

### Backend Structure
```
backend/src/
├── routes/         # API endpoints
├── services/       # Business logic (AI, Email, Payment)
├── jobs/           # Scheduled automation
├── middleware/     # Authentication
└── config/         # Database setup
```

### Key Files
- `backend/src/server.ts` - Backend entry point
- `frontend/src/App.tsx` - Frontend entry point
- `backend/src/config/database.ts` - Database schema
- `backend/src/services/ai.service.ts` - AI integration

## 🤝 Getting Help

### Documentation
- All markdown files in root directory
- Inline code comments
- TypeScript types for guidance

### Common Questions
- "How do I add a feature?" - Check ARCHITECTURE.md
- "How do I test?" - See TESTING_GUIDE.md
- "How do I deploy?" - Read DEPLOYMENT.md
- "What's the API?" - Check API_DOCUMENTATION.md

## ✅ Success Checklist

You're ready when:
- [ ] Both servers running without errors
- [ ] Can login to dashboard
- [ ] See sample data
- [ ] Charts displaying
- [ ] Can navigate all pages
- [ ] Understand the automation
- [ ] Know where to find documentation

## 🎉 Congratulations!

You now have a fully functional AI-powered accounts receivable system running locally!

**What's Next?**
1. Explore all the features
2. Try generating AI reminders
3. Check out the analytics
4. Customize for your needs
5. Deploy to production when ready

**Questions?** Check the documentation files or review the code comments.

**Ready to deploy?** See DEPLOYMENT.md for production setup.

**Happy collecting!** 💰
