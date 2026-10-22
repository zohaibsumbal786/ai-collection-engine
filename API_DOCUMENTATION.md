# API Documentation - AI Collection Engine

Base URL: `http://localhost:5000/api` (Development)

## Authentication

All endpoints except `/auth/login` and `/auth/register` require authentication.

**Authentication Header:**
```
Authorization: Bearer <JWT_TOKEN>
```

---

## 🔐 Authentication Endpoints

### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

### POST /auth/login
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@example.com",
    "name": "Admin User",
    "role": "admin"
  }
}
```

---

## 📄 Invoice Endpoints

### GET /invoices
Get all invoices with optional filters.

**Query Parameters:**
- `status` (optional): Filter by status (pending, partial, paid, cancelled)
- `aging_bucket` (optional): Filter by aging bucket (0-30, 31-60, 61-90, 90+)
- `customer_id` (optional): Filter by customer ID
- `sort` (optional): Sort field (default: due_date)
- `order` (optional): Sort order (ASC, DESC)

**Response (200):**
```json
{
  "invoices": [
    {
      "id": 1,
      "invoice_number": "INV-2024-001",
      "customer_id": 1,
      "customer_name": "Acme Corporation",
      "customer_email": "billing@acme.com",
      "company": "Acme Corp",
      "amount": 15000,
      "due_date": "2024-01-15",
      "issue_date": "2023-12-15",
      "status": "pending",
      "aging_bucket": "31-60",
      "days_overdue": 45,
      "description": "Professional services rendered",
      "created_at": "2023-12-15T00:00:00.000Z",
      "updated_at": "2024-01-30T00:00:00.000Z"
    }
  ],
  "count": 1
}
```

### GET /invoices/:id
Get single invoice with details.

**Response (200):**
```json
{
  "invoice": {
    "id": 1,
    "invoice_number": "INV-2024-001",
    "customer_id": 1,
    "customer_name": "Acme Corporation",
    "customer_email": "billing@acme.com",
    "customer_phone": "+1-555-0101",
    "company": "Acme Corp",
    "amount": 15000,
    "due_date": "2024-01-15",
    "issue_date": "2023-12-15",
    "status": "pending",
    "aging_bucket": "31-60",
    "days_overdue": 45,
    "description": "Professional services rendered"
  },
  "payments": [],
  "reminders": [
    {
      "id": 1,
      "invoice_id": 1,
      "type": "friendly",
      "message": "...",
      "sent_date": "2024-01-22T09:00:00.000Z",
      "status": "sent"
    }
  ]
}
```

### POST /invoices
Create a new invoice.

**Request Body:**
```json
{
  "invoice_number": "INV-2024-010",
  "customer_id": 1,
  "amount": 5000,
  "due_date": "2024-03-15",
  "description": "Consulting services"
}
```

**Response (201):**
```json
{
  "message": "Invoice created successfully",
  "invoice": {
    "id": 10,
    "invoice_number": "INV-2024-010",
    "customer_id": 1,
    "amount": 5000,
    "due_date": "2024-03-15",
    "issue_date": "2024-02-10",
    "status": "pending",
    "aging_bucket": "0-30",
    "days_overdue": 0
  }
}
```

### PUT /invoices/:id
Update an existing invoice.

**Request Body:**
```json
{
  "amount": 5500,
  "due_date": "2024-03-20",
  "status": "partial",
  "description": "Updated description"
}
```

**Response (200):**
```json
{
  "message": "Invoice updated successfully",
  "invoice": { /* updated invoice */ }
}
```

### DELETE /invoices/:id
Delete an invoice.

**Response (200):**
```json
{
  "message": "Invoice deleted successfully"
}
```

---

## 👥 Customer Endpoints

### GET /customers
Get all customers with invoice statistics.

**Response (200):**
```json
{
  "customers": [
    {
      "id": 1,
      "name": "Acme Corporation",
      "email": "billing@acme.com",
      "phone": "+1-555-0101",
      "company": "Acme Corp",
      "credit_limit": 50000,
      "payment_terms": 30,
      "status": "active",
      "invoice_count": 3,
      "outstanding_amount": 25000,
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "count": 1
}
```

### GET /customers/:id
Get single customer with invoice history.

**Response (200):**
```json
{
  "customer": {
    "id": 1,
    "name": "Acme Corporation",
    "email": "billing@acme.com",
    "phone": "+1-555-0101",
    "company": "Acme Corp",
    "credit_limit": 50000,
    "payment_terms": 30,
    "status": "active"
  },
  "invoices": [
    { /* invoice 1 */ },
    { /* invoice 2 */ }
  ]
}
```

### POST /customers
Create a new customer.

**Request Body:**
```json
{
  "name": "New Company Inc",
  "email": "billing@newcompany.com",
  "phone": "+1-555-0199",
  "company": "New Company",
  "credit_limit": 25000,
  "payment_terms": 30
}
```

**Response (201):**
```json
{
  "message": "Customer created successfully",
  "customer": { /* new customer */ }
}
```

### PUT /customers/:id
Update customer information.

**Request Body:**
```json
{
  "name": "Updated Name",
  "credit_limit": 30000,
  "status": "active"
}
```

**Response (200):**
```json
{
  "message": "Customer updated successfully",
  "customer": { /* updated customer */ }
}
```

### DELETE /customers/:id
Delete a customer (cascades to invoices).

**Response (200):**
```json
{
  "message": "Customer deleted successfully"
}
```

---

## 📧 Reminder Endpoints

### GET /reminders
Get all reminders with optional filters.

**Query Parameters:**
- `invoice_id` (optional): Filter by invoice ID
- `status` (optional): Filter by status (draft, sent, failed)

**Response (200):**
```json
{
  "reminders": [
    {
      "id": 1,
      "invoice_id": 1,
      "invoice_number": "INV-2024-001",
      "amount": 15000,
      "customer_name": "Acme Corporation",
      "type": "friendly",
      "channel": "email",
      "message": "Subject: Friendly Reminder...",
      "sent_date": "2024-01-22T09:00:00.000Z",
      "status": "sent",
      "recipient": "billing@acme.com",
      "created_at": "2024-01-22T08:55:00.000Z"
    }
  ],
  "count": 1
}
```

### POST /reminders/generate/:invoiceId
Generate AI-powered reminder for an invoice.

**Request Body:**
```json
{
  "reminderType": "friendly"  // optional: friendly, firm, escalated
}
```

**Response (200):**
```json
{
  "message": "Reminder generated successfully",
  "reminder": {
    "id": 5,
    "invoice_id": 1,
    "type": "friendly",
    "message": "Subject: Friendly Reminder: Invoice INV-2024-001 Payment\n\nDear Acme Corporation...",
    "status": "draft",
    "recipient": "billing@acme.com"
  },
  "paymentLink": "http://localhost:3000/pay/1"
}
```

### POST /reminders/send/:reminderId
Send a generated reminder.

**Response (200):**
```json
{
  "message": "Reminder sent successfully"
}
```

### POST /reminders/send-bulk
Send multiple reminders at once.

**Request Body:**
```json
{
  "reminderIds": [1, 2, 3]
}
```

**Response (200):**
```json
{
  "message": "Bulk send completed",
  "results": {
    "success": 2,
    "failed": 1,
    "errors": ["Reminder 3: Already sent"]
  }
}
```

---

## 📊 Analytics Endpoints

### GET /analytics/dashboard
Get dashboard metrics and statistics.

**Response (200):**
```json
{
  "totalOutstanding": 125000,
  "agingBuckets": [
    {
      "aging_bucket": "0-30",
      "count": 3,
      "total_amount": 25000
    },
    {
      "aging_bucket": "31-60",
      "count": 2,
      "total_amount": 35000
    }
  ],
  "recentActivity": [
    {
      "type": "payment",
      "amount": 5000,
      "date": "2024-02-09T10:30:00.000Z",
      "invoice_number": "INV-2024-008",
      "customer_name": "Global Solutions"
    }
  ],
  "highValueOverdue": [
    {
      "id": 3,
      "invoice_number": "INV-2024-003",
      "customer_name": "Global Solutions",
      "amount": 25000,
      "days_overdue": 70,
      "aging_bucket": "61-90"
    }
  ],
  "collectionRate": 75.5,
  "dso": 42,
  "stats": {
    "totalInvoices": 10,
    "paidInvoices": 3,
    "paidAmount": 45000
  }
}
```

### GET /analytics/cash-flow
Get cash flow analysis and predictions.

**Query Parameters:**
- `days` (optional): Number of days to analyze (default: 90)

**Response (200):**
```json
{
  "historical": [
    {
      "date": "2024-01-15",
      "amount": 5000
    },
    {
      "date": "2024-01-20",
      "amount": 8500
    }
  ],
  "expected": [
    {
      "date": "2024-02-15",
      "amount": 15000
    }
  ],
  "trend": 12.5,
  "summary": {
    "last30Days": 35000,
    "previous30Days": 28000
  }
}
```

### GET /analytics/aging
Get detailed aging analysis.

**Response (200):**
```json
{
  "agingBuckets": [
    {
      "aging_bucket": "0-30",
      "invoice_count": 3,
      "total_amount": 25000,
      "avg_amount": 8333.33,
      "min_days": 5,
      "max_days": 28
    }
  ],
  "topCustomers": [
    {
      "id": 1,
      "name": "Acme Corporation",
      "company": "Acme Corp",
      "overdue_count": 2,
      "overdue_amount": 20000,
      "max_days_overdue": 45
    }
  ]
}
```

### GET /analytics/efficiency
Get collection efficiency metrics.

**Response (200):**
```json
{
  "avgDaysToPayment": 35,
  "reminderEffectiveness": [
    {
      "type": "friendly",
      "sent_count": 15,
      "paid_count": 10
    }
  ],
  "monthlyTrends": [
    {
      "month": "2024-01",
      "payment_count": 8,
      "total_amount": 45000
    }
  ]
}
```

---

## 💳 Payment Endpoints

### POST /payments/create-link
Create a payment link for an invoice.

**Request Body:**
```json
{
  "invoiceId": 1
}
```

**Response (200):**
```json
{
  "paymentLink": "http://localhost:3000/pay/1?payment_intent=pi_xxx"
}
```

### POST /payments/record
Manually record a payment.

**Request Body:**
```json
{
  "invoice_id": 1,
  "amount": 5000,
  "payment_method": "bank_transfer",
  "transaction_id": "TXN-12345"
}
```

**Response (200):**
```json
{
  "message": "Payment recorded successfully"
}
```

### GET /payments/invoice/:invoiceId
Get all payments for an invoice.

**Response (200):**
```json
{
  "payments": [
    {
      "id": 1,
      "invoice_id": 1,
      "amount": 5000,
      "payment_date": "2024-02-01T10:30:00.000Z",
      "payment_method": "stripe",
      "transaction_id": "pi_xxx",
      "status": "completed"
    }
  ],
  "total": 5000
}
```

### POST /payments/webhook
Stripe webhook endpoint (public).

**Headers:**
```
stripe-signature: xxx
```

**Response (200):**
```json
{
  "received": true
}
```

---

## ⚙️ Settings Endpoints

### GET /settings
Get all system settings.

**Response (200):**
```json
{
  "settings": {
    "high_value_threshold": {
      "value": "10000",
      "description": "Threshold for high-value invoice alerts",
      "updated_at": "2024-01-01T00:00:00.000Z"
    },
    "reminder_day_7": {
      "value": "true",
      "description": "Send reminder at 7 days overdue",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### PUT /settings/:key
Update a setting value.

**Request Body:**
```json
{
  "value": "15000"
}
```

**Response (200):**
```json
{
  "message": "Setting updated successfully",
  "setting": {
    "key": "high_value_threshold",
    "value": "15000",
    "description": "Threshold for high-value invoice alerts",
    "updated_at": "2024-02-10T12:00:00.000Z"
  }
}
```

### GET /settings/alerts
Get system alerts.

**Query Parameters:**
- `status` (optional): Filter by status (unread, read)

**Response (200):**
```json
{
  "alerts": [
    {
      "id": 1,
      "invoice_id": 3,
      "invoice_number": "INV-2024-003",
      "amount": 25000,
      "customer_name": "Global Solutions",
      "type": "high_value_overdue",
      "priority": "high",
      "message": "High-value invoice INV-2024-003 for Global Solutions is 70 days overdue ($25000.00)",
      "status": "unread",
      "created_at": "2024-02-10T10:00:00.000Z"
    }
  ],
  "count": 1
}
```

### PUT /settings/alerts/:id/read
Mark an alert as read.

**Response (200):**
```json
{
  "message": "Alert marked as read"
}
```

---

## 🚨 Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid input",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "error": "Access token required"
}
```

### 403 Forbidden
```json
{
  "error": "Invalid or expired token"
}
```

### 404 Not Found
```json
{
  "error": "Invoice not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "message": "Detailed error message (development only)"
}
```

---

## 📝 Notes

### Date Formats
All dates are in ISO 8601 format: `YYYY-MM-DDTHH:mm:ss.sssZ`

### Pagination
Currently not implemented but ready for:
```
?page=1&limit=20
```

### Rate Limiting
Not currently implemented but structure ready for rate limiting middleware.

### CORS
Configured to allow requests from frontend origin.

### Content Type
All requests and responses use `application/json`.
