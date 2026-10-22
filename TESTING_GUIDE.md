# Testing Guide - AI Collection Engine

## 🧪 Manual Testing Checklist

### Initial Setup Testing

- [ ] **Installation**
  - [ ] Run `setup.bat` (Windows) or `setup.sh` (Unix)
  - [ ] All dependencies install without errors
  - [ ] Environment files created
  - [ ] Database initialized successfully

- [ ] **Server Startup**
  - [ ] Backend starts on port 5000
  - [ ] Frontend starts on port 3000
  - [ ] No console errors
  - [ ] Health check endpoint responds: `http://localhost:5000/health`

### Authentication Testing

- [ ] **Login**
  - [ ] Login with correct credentials (admin@example.com / admin123)
  - [ ] Redirects to dashboard
  - [ ] Token stored in localStorage
  - [ ] User info displayed in sidebar

- [ ] **Login Errors**
  - [ ] Wrong password shows error
  - [ ] Invalid email shows error
  - [ ] Empty fields show validation errors

- [ ] **Logout**
  - [ ] Logout button works
  - [ ] Redirects to login page
  - [ ] Token removed from localStorage
  - [ ] Cannot access protected routes

- [ ] **Protected Routes**
  - [ ] Cannot access dashboard without login
  - [ ] Redirects to login when token expired
  - [ ] All pages require authentication

### Dashboard Testing

- [ ] **Metrics Display**
  - [ ] Total outstanding amount shows correctly
  - [ ] Collection rate displays
  - [ ] DSO (Days Sales Outstanding) shows
  - [ ] High-value overdue count displays

- [ ] **Charts**
  - [ ] Aging analysis pie chart renders
  - [ ] Shows correct percentages
  - [ ] Cash flow line chart displays
  - [ ] Trend indicator shows (+/- percentage)

- [ ] **High-Value Table**
  - [ ] Lists high-value overdue invoices
  - [ ] Shows correct data (invoice #, customer, amount, days)
  - [ ] Status badges display correctly
  - [ ] "View All" link works

- [ ] **Responsive Design**
  - [ ] Dashboard looks good on desktop
  - [ ] Mobile sidebar works
  - [ ] Charts resize properly
  - [ ] Tables scroll horizontally on mobile

### Invoice Management Testing

- [ ] **Invoice List**
  - [ ] All invoices display
  - [ ] Correct data in each column
  - [ ] Status badges color-coded correctly
  - [ ] Aging buckets show properly

- [ ] **Search & Filter**
  - [ ] Search by invoice number works
  - [ ] Search by customer name works
  - [ ] Filter by status (pending, paid, partial)
  - [ ] Results update immediately

- [ ] **Invoice Details**
  - [ ] Click invoice to view details (if implemented)
  - [ ] Shows customer information
  - [ ] Displays payment history
  - [ ] Shows reminder history

- [ ] **Create Invoice** (if UI implemented)
  - [ ] Form validation works
  - [ ] Creates invoice successfully
  - [ ] Aging calculated correctly
  - [ ] Appears in invoice list

- [ ] **Update Invoice** (if UI implemented)
  - [ ] Can edit amount
  - [ ] Can change due date
  - [ ] Aging recalculates
  - [ ] Changes save successfully

- [ ] **Delete Invoice** (if UI implemented)
  - [ ] Confirmation dialog appears
  - [ ] Invoice deleted successfully
  - [ ] Removed from list

### Customer Management Testing

- [ ] **Customer List**
  - [ ] All customers display
  - [ ] Shows outstanding balance
  - [ ] Invoice count correct
  - [ ] Status badges display

- [ ] **Search**
  - [ ] Search by name works
  - [ ] Search by email works
  - [ ] Search by company works
  - [ ] Results filter correctly

- [ ] **Customer Details**
  - [ ] Click customer to view details
  - [ ] Shows all invoices
  - [ ] Displays contact information
  - [ ] Credit limit shown

- [ ] **Create Customer** (if UI implemented)
  - [ ] Form validation works
  - [ ] Email validation
  - [ ] Creates successfully
  - [ ] Appears in list

### Reminder Testing

- [ ] **Reminder List**
  - [ ] All reminders display
  - [ ] Shows invoice number
  - [ ] Customer name correct
  - [ ] Type badge displays (friendly/firm/escalated)
  - [ ] Status shows (draft/sent/failed)

- [ ] **Generate AI Reminder**
  - [ ] Click generate for an invoice
  - [ ] AI message generates (or fallback template)
  - [ ] Payment link included
  - [ ] Saves as draft
  - [ ] Message looks professional

- [ ] **Send Reminder**
  - [ ] Click send on draft reminder
  - [ ] Status changes to "sent"
  - [ ] Sent date updates
  - [ ] Email logged in console (dev mode)

- [ ] **Reminder Types**
  - [ ] Friendly tone for 7-day overdue
  - [ ] Firm tone for 30-day overdue
  - [ ] Escalated tone for 60+ day overdue
  - [ ] Messages differ appropriately

### Analytics Testing

- [ ] **Metrics Cards**
  - [ ] Average days to payment displays
  - [ ] Monthly payment count shows
  - [ ] Reminder effectiveness displays

- [ ] **Aging Chart**
  - [ ] Bar chart renders
  - [ ] Shows all aging buckets
  - [ ] Amounts correct
  - [ ] Tooltips work

- [ ] **Top Customers Table**
  - [ ] Lists customers by overdue amount
  - [ ] Shows correct data
  - [ ] Sorted by amount descending
  - [ ] Max days overdue shown

### Settings Testing

- [ ] **Reminder Toggles**
  - [ ] 7-day reminder toggle works
  - [ ] 30-day reminder toggle works
  - [ ] 60-day escalation toggle works
  - [ ] Changes save immediately

- [ ] **High-Value Threshold**
  - [ ] Current value displays
  - [ ] Can change value
  - [ ] Save button works
  - [ ] New value persists

- [ ] **Alerts**
  - [ ] Unread alerts display
  - [ ] Can mark as read
  - [ ] Alert details show

### Automation Testing

- [ ] **Scheduled Jobs** (requires waiting or manual trigger)
  - [ ] Aging updates daily
  - [ ] Reminders send at 9 AM
  - [ ] High-value alerts check hourly
  - [ ] Jobs log to console

- [ ] **Trigger Rules**
  - [ ] 7-day overdue triggers friendly reminder
  - [ ] 30-day overdue triggers firm reminder
  - [ ] 60-day overdue triggers escalation + alert
  - [ ] High-value ($10k+) triggers immediate alert

### Payment Testing

- [ ] **Payment Link Creation**
  - [ ] Generate payment link for invoice
  - [ ] Link format correct
  - [ ] Link includes invoice ID

- [ ] **Manual Payment Recording**
  - [ ] Can record payment
  - [ ] Invoice status updates
  - [ ] Payment appears in history
  - [ ] Outstanding balance recalculates

- [ ] **Partial Payments**
  - [ ] Can record partial payment
  - [ ] Status changes to "partial"
  - [ ] Remaining balance correct
  - [ ] Multiple payments tracked

### UI/UX Testing

- [ ] **Navigation**
  - [ ] Sidebar navigation works
  - [ ] Active page highlighted
  - [ ] All links functional
  - [ ] Mobile menu works

- [ ] **Loading States**
  - [ ] Spinners show while loading
  - [ ] No flash of empty content
  - [ ] Smooth transitions

- [ ] **Error Handling**
  - [ ] Toast notifications appear
  - [ ] Error messages clear
  - [ ] User can recover from errors
  - [ ] No console errors

- [ ] **Responsive Design**
  - [ ] Works on desktop (1920x1080)
  - [ ] Works on laptop (1366x768)
  - [ ] Works on tablet (768x1024)
  - [ ] Works on mobile (375x667)

### Data Integrity Testing

- [ ] **Calculations**
  - [ ] Days overdue calculated correctly
  - [ ] Aging buckets assigned properly
  - [ ] Outstanding amounts accurate
  - [ ] Collection rate correct

- [ ] **Relationships**
  - [ ] Invoices linked to customers
  - [ ] Payments linked to invoices
  - [ ] Reminders linked to invoices
  - [ ] Alerts linked to invoices

- [ ] **Cascading Deletes**
  - [ ] Deleting customer deletes invoices
  - [ ] Deleting invoice deletes payments
  - [ ] Deleting invoice deletes reminders

## 🔧 API Testing with Postman/cURL

### Setup
1. Import API collection (if provided)
2. Set base URL: `http://localhost:5000/api`
3. Get JWT token from login

### Test Scenarios

#### 1. Authentication Flow
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","name":"Test User"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'

# Save token from response
TOKEN="your-jwt-token-here"
```

#### 2. Invoice Operations
```bash
# Get all invoices
curl -X GET http://localhost:5000/api/invoices \
  -H "Authorization: Bearer $TOKEN"

# Get single invoice
curl -X GET http://localhost:5000/api/invoices/1 \
  -H "Authorization: Bearer $TOKEN"

# Create invoice
curl -X POST http://localhost:5000/api/invoices \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "invoice_number":"INV-TEST-001",
    "customer_id":1,
    "amount":5000,
    "due_date":"2024-03-15",
    "description":"Test invoice"
  }'

# Update invoice
curl -X PUT http://localhost:5000/api/invoices/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"amount":5500,"status":"partial"}'

# Delete invoice
curl -X DELETE http://localhost:5000/api/invoices/1 \
  -H "Authorization: Bearer $TOKEN"
```

#### 3. Reminder Generation
```bash
# Generate AI reminder
curl -X POST http://localhost:5000/api/reminders/generate/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"reminderType":"friendly"}'

# Send reminder
curl -X POST http://localhost:5000/api/reminders/send/1 \
  -H "Authorization: Bearer $TOKEN"
```

#### 4. Analytics
```bash
# Dashboard metrics
curl -X GET http://localhost:5000/api/analytics/dashboard \
  -H "Authorization: Bearer $TOKEN"

# Cash flow
curl -X GET http://localhost:5000/api/analytics/cash-flow?days=30 \
  -H "Authorization: Bearer $TOKEN"

# Aging analysis
curl -X GET http://localhost:5000/api/analytics/aging \
  -H "Authorization: Bearer $TOKEN"
```

## 🐛 Common Issues & Solutions

### Issue: Cannot login
**Solution:**
- Verify database initialized: `cd backend && npm run init-db`
- Check credentials: admin@example.com / admin123
- Clear browser localStorage
- Check backend console for errors

### Issue: Charts not displaying
**Solution:**
- Check browser console for errors
- Verify data is loading (Network tab)
- Try refreshing the page
- Check if Recharts installed: `cd frontend && npm list recharts`

### Issue: Reminders not generating
**Solution:**
- Check if ANTHROPIC_API_KEY is set (optional)
- Verify fallback templates work
- Check backend console for errors
- Ensure invoice has customer email

### Issue: Scheduled jobs not running
**Solution:**
- Verify backend is running
- Check console for job logs
- Jobs run at specific times (1 AM, 9 AM, hourly)
- Manually trigger by restarting backend

### Issue: Database locked
**Solution:**
- Close all connections
- Delete database.sqlite
- Run `npm run init-db` again

### Issue: Port already in use
**Solution:**
- Change PORT in backend/.env
- Kill process using port: `netstat -ano | findstr :5000`
- Use different port for frontend

## ✅ Test Data Scenarios

### Scenario 1: New Invoice Flow
1. Create customer
2. Create invoice for customer
3. Verify aging calculated
4. Generate reminder
5. Send reminder
6. Record payment
7. Verify status updated

### Scenario 2: Overdue Invoice Flow
1. Find overdue invoice
2. Check aging bucket
3. Generate appropriate reminder
4. Send reminder
5. Check reminder history
6. Verify alert created (if high-value)

### Scenario 3: Payment Flow
1. Find pending invoice
2. Create payment link
3. Record payment
4. Verify invoice status
5. Check payment history
6. Verify outstanding balance

### Scenario 4: Analytics Flow
1. View dashboard
2. Check all metrics
3. View cash flow chart
4. Check aging analysis
5. Review top customers
6. Verify calculations

## 📊 Performance Testing

### Load Testing (Optional)
- Use Apache Bench or similar
- Test API endpoints under load
- Monitor response times
- Check database performance

### Browser Performance
- Check Lighthouse scores
- Monitor bundle size
- Test on slow connections
- Check memory usage

## 🔒 Security Testing

### Authentication
- [ ] Cannot access API without token
- [ ] Token expires appropriately
- [ ] Invalid tokens rejected
- [ ] Password hashing works

### Input Validation
- [ ] SQL injection prevented
- [ ] XSS attacks blocked
- [ ] Invalid data rejected
- [ ] Error messages safe

### CORS
- [ ] Only allowed origins accepted
- [ ] Credentials handled properly
- [ ] Headers configured correctly

## 📝 Test Results Template

```
Test Date: ___________
Tester: ___________
Environment: Development / Production

Authentication: ✅ / ❌
Dashboard: ✅ / ❌
Invoices: ✅ / ❌
Customers: ✅ / ❌
Reminders: ✅ / ❌
Analytics: ✅ / ❌
Settings: ✅ / ❌
Automation: ✅ / ❌
Payments: ✅ / ❌

Issues Found:
1. ___________
2. ___________

Notes:
___________
```

## 🎯 Acceptance Criteria

System is ready for production when:
- [ ] All manual tests pass
- [ ] No console errors
- [ ] All features functional
- [ ] Responsive on all devices
- [ ] Performance acceptable
- [ ] Security measures in place
- [ ] Documentation complete
- [ ] Sample data works
- [ ] Deployment successful
- [ ] Monitoring configured

Happy Testing! 🚀
