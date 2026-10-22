# System Architecture - AI Collection Engine

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│                    (React + TypeScript)                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │Dashboard │  │ Invoices │  │Customers │  │Analytics │      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                    │
│  │Reminders │  │ Settings │  │  Login   │                    │
│  └──────────┘  └──────────┘  └──────────┘                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS / REST API
                              │
┌─────────────────────────────────────────────────────────────────┐
│                      API LAYER (Express)                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Authentication Middleware (JWT)                         │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │   Auth   │  │ Invoices │  │Customers │  │Analytics │      │
│  │  Routes  │  │  Routes  │  │  Routes  │  │  Routes  │      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                    │
│  │Reminders │  │ Payments │  │ Settings │                    │
│  │  Routes  │  │  Routes  │  │  Routes  │                    │
│  └──────────┘  └──────────┘  └──────────┘                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │
┌─────────────────────────────────────────────────────────────────┐
│                    BUSINESS LOGIC LAYER                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  AI Service  │  │Email Service │  │Payment Service│         │
│  │   (Claude)   │  │   (Resend)   │  │   (Stripe)   │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │
┌─────────────────────────────────────────────────────────────────┐
│                    SCHEDULED JOBS (Cron)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │Update Aging  │  │Send Reminders│  │Check Alerts  │         │
│  │  (Daily 1AM) │  │  (Daily 9AM) │  │   (Hourly)   │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │
┌─────────────────────────────────────────────────────────────────┐
│                      DATA LAYER (SQLite)                        │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐             │
│  │  Users  │ │Customers│ │Invoices │ │Payments │             │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘             │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐                         │
│  │Reminders│ │ Alerts  │ │Settings │                         │
│  └─────────┘ └─────────┘ └─────────┘                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │
┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  Anthropic   │  │    Resend    │  │    Stripe    │         │
│  │  Claude API  │  │  Email API   │  │  Payment API │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow

### 1. User Authentication Flow
```
User → Login Page → POST /api/auth/login → Verify Credentials
                                          → Generate JWT Token
                                          → Return Token + User Data
                                          → Store in LocalStorage
                                          → Redirect to Dashboard
```

### 2. Invoice Aging Update Flow (Automated)
```
Cron Job (1 AM) → updateAging.ts → Get All Pending Invoices
                                  → Calculate Days Overdue
                                  → Determine Aging Bucket
                                  → Update Database
                                  → Log Results
```

### 3. AI Reminder Generation Flow
```
User/Cron → Generate Reminder → Get Invoice Details
                               → Get Customer Info
                               → Call Claude API
                               → Generate Personalized Message
                               → Create Payment Link (Stripe)
                               → Insert Payment Link
                               → Save to Database
                               → Return Reminder
```

### 4. Automated Reminder Sending Flow
```
Cron Job (9 AM) → sendReminders.ts → Get Overdue Invoices
                                    → Check Reminder Rules
                                    → Generate AI Messages
                                    → Create Payment Links
                                    → Send Emails (Resend)
                                    → Update Status
                                    → Create Alerts (if escalated)
                                    → Log Results
```

### 5. High-Value Alert Flow
```
Cron Job (Hourly) → checkAlerts.ts → Get High-Value Invoices
                                    → Check if Overdue
                                    → Create Alert Record
                                    → Send Email to Account Owner
                                    → Log Alert
```

### 6. Payment Processing Flow
```
Customer → Payment Link → Stripe Checkout → Payment Success
                                          → Webhook to Backend
                                          → Record Payment
                                          → Update Invoice Status
                                          → Calculate Remaining Balance
                                          → Update to "Paid" if Full
```

## 🗄️ Database Schema

### Entity Relationship Diagram
```
┌─────────────┐
│    Users    │
│─────────────│
│ id (PK)     │
│ email       │
│ password    │
│ name        │
│ role        │
└─────────────┘

┌─────────────┐         ┌─────────────┐
│  Customers  │         │  Invoices   │
│─────────────│         │─────────────│
│ id (PK)     │◄───────┤│ id (PK)     │
│ name        │  1:N    │ customer_id │
│ email       │         │ amount      │
│ phone       │         │ due_date    │
│ company     │         │ status      │
│ credit_limit│         │ aging_bucket│
└─────────────┘         │ days_overdue│
                        └─────────────┘
                              │
                              │ 1:N
                              │
                    ┌─────────┴─────────┐
                    │                   │
              ┌─────────────┐     ┌─────────────┐
              │  Payments   │     │  Reminders  │
              │─────────────│     │─────────────│
              │ id (PK)     │     │ id (PK)     │
              │ invoice_id  │     │ invoice_id  │
              │ amount      │     │ type        │
              │ payment_date│     │ message     │
              │ method      │     │ status      │
              └─────────────┘     │ sent_date   │
                                  └─────────────┘
                                        │
                                        │ 1:N
                                        │
                                  ┌─────────────┐
                                  │   Alerts    │
                                  │─────────────│
                                  │ id (PK)     │
                                  │ invoice_id  │
                                  │ type        │
                                  │ priority    │
                                  │ message     │
                                  │ status      │
                                  └─────────────┘

┌─────────────┐
│  Settings   │
│─────────────│
│ id (PK)     │
│ key         │
│ value       │
│ description │
└─────────────┘
```

## 🔐 Security Architecture

### Authentication Flow
```
1. User submits credentials
2. Backend validates against database
3. Password verified with bcrypt
4. JWT token generated with user data
5. Token returned to client
6. Client stores token in localStorage
7. Token included in all API requests (Authorization header)
8. Middleware validates token on each request
9. User data extracted from token
10. Request proceeds if valid
```

### Security Layers
```
┌─────────────────────────────────────────┐
│         Frontend Security               │
│  • Input validation                     │
│  • XSS prevention                       │
│  • HTTPS only                           │
│  • Token storage                        │
└─────────────────────────────────────────┘
                  │
┌─────────────────────────────────────────┐
│         API Security                    │
│  • JWT authentication                   │
│  • CORS configuration                   │
│  • Helmet.js headers                    │
│  • Rate limiting ready                  │
│  • Input sanitization                   │
└─────────────────────────────────────────┘
                  │
┌─────────────────────────────────────────┐
│         Database Security               │
│  • Parameterized queries                │
│  • SQL injection prevention             │
│  • Foreign key constraints              │
│  • Password hashing (bcrypt)            │
└─────────────────────────────────────────┘
```

## 📡 API Architecture

### RESTful Endpoints Structure
```
/api
├── /auth
│   ├── POST /login
│   └── POST /register
├── /invoices
│   ├── GET    /
│   ├── GET    /:id
│   ├── POST   /
│   ├── PUT    /:id
│   └── DELETE /:id
├── /customers
│   ├── GET    /
│   ├── GET    /:id
│   ├── POST   /
│   ├── PUT    /:id
│   └── DELETE /:id
├── /reminders
│   ├── GET    /
│   ├── POST   /generate/:invoiceId
│   ├── POST   /send/:reminderId
│   └── POST   /send-bulk
├── /analytics
│   ├── GET    /dashboard
│   ├── GET    /cash-flow
│   ├── GET    /aging
│   └── GET    /efficiency
├── /payments
│   ├── POST   /create-link
│   ├── POST   /record
│   ├── GET    /invoice/:id
│   └── POST   /webhook
└── /settings
    ├── GET    /
    ├── PUT    /:key
    └── GET    /alerts
```

### Request/Response Flow
```
Client Request
    │
    ├─→ Authentication Middleware
    │       │
    │       ├─→ Validate JWT Token
    │       ├─→ Extract User Data
    │       └─→ Attach to Request
    │
    ├─→ Route Handler
    │       │
    │       ├─→ Validate Input
    │       ├─→ Call Service Layer
    │       └─→ Format Response
    │
    ├─→ Service Layer
    │       │
    │       ├─→ Business Logic
    │       ├─→ Database Operations
    │       ├─→ External API Calls
    │       └─→ Return Data
    │
    └─→ Error Handler
            │
            ├─→ Log Error
            ├─→ Format Error Response
            └─→ Return to Client
```

## 🔄 Automation Architecture

### Scheduled Jobs System
```
Node-Cron Scheduler
    │
    ├─→ Update Aging (Daily 1 AM)
    │   │
    │   ├─→ Get All Pending Invoices
    │   ├─→ Calculate Days Overdue
    │   ├─→ Determine Aging Bucket
    │   ├─→ Update Database
    │   └─→ Log Results
    │
    ├─→ Send Reminders (Daily 9 AM)
    │   │
    │   ├─→ Get Overdue Invoices
    │   ├─→ Check Reminder Rules
    │   │   ├─→ 7 days: Friendly
    │   │   ├─→ 30 days: Firm
    │   │   └─→ 60 days: Escalated
    │   ├─→ Generate AI Messages
    │   ├─→ Create Payment Links
    │   ├─→ Send Emails
    │   ├─→ Update Status
    │   └─→ Create Alerts
    │
    └─→ Check High-Value (Hourly)
        │
        ├─→ Get High-Value Invoices
        ├─→ Check if Overdue
        ├─→ Create Alert
        ├─→ Email Account Owner
        └─→ Log Alert
```

## 🎨 Frontend Architecture

### Component Hierarchy
```
App
├── AuthProvider (Context)
│   └── Router
│       ├── Login (Public)
│       └── Layout (Private)
│           ├── Sidebar Navigation
│           ├── Top Bar
│           └── Outlet (Page Content)
│               ├── Dashboard
│               │   ├── Stats Cards
│               │   ├── Aging Chart
│               │   ├── Cash Flow Chart
│               │   └── High-Value Table
│               ├── Invoices
│               │   ├── Search/Filter
│               │   └── Invoice Table
│               ├── Customers
│               │   ├── Search
│               │   └── Customer Table
│               ├── Reminders
│               │   └── Reminder Table
│               ├── Analytics
│               │   ├── Metrics Cards
│               │   ├── Charts
│               │   └── Reports
│               └── Settings
│                   └── Configuration Forms
```

### State Management
```
┌─────────────────────────────────────────┐
│         Global State (Context)          │
│  • Authentication State                 │
│  • User Information                     │
│  • JWT Token                            │
└─────────────────────────────────────────┘
                  │
┌─────────────────────────────────────────┐
│         Component State (useState)      │
│  • Loading states                       │
│  • Form data                            │
│  • Local UI state                       │
│  • Filter/search values                 │
└─────────────────────────────────────────┘
                  │
┌─────────────────────────────────────────┐
│         Server State (API Calls)        │
│  • Invoices data                        │
│  • Customers data                       │
│  • Analytics data                       │
│  • Settings data                        │
└─────────────────────────────────────────┘
```

## 🚀 Deployment Architecture

### Development Environment
```
┌─────────────────┐     ┌─────────────────┐
│   Frontend      │     │    Backend      │
│  localhost:3000 │────▶│ localhost:5000  │
│  (React Dev)    │     │  (Nodemon)      │
└─────────────────┘     └─────────────────┘
                              │
                        ┌─────────────┐
                        │   SQLite    │
                        │ (Local File)│
                        └─────────────┘
```

### Production Environment
```
┌─────────────────┐     ┌─────────────────┐
│     Vercel      │     │    Railway      │
│   (Frontend)    │────▶│   (Backend)     │
│  Static Files   │     │   Node.js App   │
└─────────────────┘     └─────────────────┘
                              │
                        ┌─────────────┐
                        │  Database   │
                        │ SQLite/PG   │
                        └─────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
┌───────────────┐   ┌─────────────────┐   ┌───────────────┐
│   Anthropic   │   │     Resend      │   │    Stripe     │
│  Claude API   │   │   Email API     │   │  Payment API  │
└───────────────┘   └─────────────────┘   └───────────────┘
```

## 📊 Performance Considerations

### Database Optimization
- Indexed columns for frequent queries
- Efficient JOIN operations
- Prepared statements for repeated queries
- Connection pooling ready

### API Optimization
- Minimal data transfer
- Pagination ready
- Caching headers
- Compression ready

### Frontend Optimization
- Code splitting
- Lazy loading
- Optimized images
- Minimal bundle size

## 🔍 Monitoring & Logging

### Backend Logging
```
Morgan (HTTP Logging)
    │
    ├─→ Request Details
    ├─→ Response Status
    ├─→ Response Time
    └─→ Error Stack Traces

Console Logging
    │
    ├─→ Scheduled Job Execution
    ├─→ Database Operations
    ├─→ External API Calls
    └─→ Business Logic Events
```

### Error Handling
```
Try-Catch Blocks
    │
    ├─→ Log Error Details
    ├─→ Return User-Friendly Message
    ├─→ Maintain Application State
    └─→ Continue Operation
```

This architecture provides a solid foundation for a scalable, maintainable, and secure accounts receivable management system.
