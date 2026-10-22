# 📁 Project Structure

Complete file and folder organization of the AI Collection Engine.

## 🌳 Full Directory Tree

```
ai-collection-engine/
│
├── 📄 README.md                      # Main project documentation
├── 📄 QUICKSTART.md                  # 5-minute setup guide
├── 📄 GET_STARTED.md                 # Beginner-friendly guide
├── 📄 DEPLOYMENT.md                  # Production deployment guide
├── 📄 FEATURES.md                    # Complete feature list
├── 📄 ARCHITECTURE.md                # System architecture diagrams
├── 📄 API_DOCUMENTATION.md           # API endpoint reference
├── 📄 TESTING_GUIDE.md               # Testing instructions
├── 📄 PROJECT_SUMMARY.md             # Project overview
├── 📄 CHANGELOG.md                   # Version history
├── 📄 LICENSE                        # MIT License
├── 📄 .gitignore                     # Git ignore rules
├── 📄 package.json                   # Root package file
├── 🔧 setup.bat                      # Windows setup script
├── 🔧 setup.sh                       # Unix setup script
│
├── 📁 frontend/                      # React frontend application
│   ├── 📁 public/
│   │   └── 📄 index.html             # HTML template
│   │
│   ├── 📁 src/
│   │   ├── 📁 components/            # Reusable UI components
│   │   │   └── 📄 Layout.tsx         # Main layout with sidebar
│   │   │
│   │   ├── 📁 context/               # React context providers
│   │   │   └── 📄 AuthContext.tsx    # Authentication state
│   │   │
│   │   ├── 📁 pages/                 # Page components
│   │   │   ├── 📄 Login.tsx          # Login page
│   │   │   ├── 📄 Dashboard.tsx      # Main dashboard
│   │   │   ├── 📄 Invoices.tsx       # Invoice management
│   │   │   ├── 📄 Customers.tsx      # Customer management
│   │   │   ├── 📄 Reminders.tsx      # Reminder history
│   │   │   ├── 📄 Analytics.tsx      # Analytics & reports
│   │   │   └── 📄 Settings.tsx       # Configuration
│   │   │
│   │   ├── 📁 services/              # API services
│   │   │   └── 📄 api.ts             # Axios configuration
│   │   │
│   │   ├── 📁 types/                 # TypeScript definitions
│   │   │   └── 📄 index.ts           # All type definitions
│   │   │
│   │   ├── 📄 App.tsx                # Main app component
│   │   ├── 📄 index.tsx              # Entry point
│   │   └── 📄 index.css              # Global styles
│   │
│   ├── 📄 package.json               # Frontend dependencies
│   ├── 📄 tsconfig.json              # TypeScript config
│   ├── 📄 tailwind.config.js         # Tailwind CSS config
│   ├── 📄 postcss.config.js          # PostCSS config
│   └── 📄 .env.example               # Environment template
│
└── 📁 backend/                       # Node.js backend API
    ├── 📁 src/
    │   ├── 📁 config/                # Configuration files
    │   │   └── 📄 database.ts        # Database setup & schema
    │   │
    │   ├── 📁 middleware/            # Express middleware
    │   │   └── 📄 auth.middleware.ts # JWT authentication
    │   │
    │   ├── 📁 routes/                # API route handlers
    │   │   ├── 📄 auth.routes.ts     # Authentication endpoints
    │   │   ├── 📄 invoice.routes.ts  # Invoice CRUD
    │   │   ├── 📄 customer.routes.ts # Customer CRUD
    │   │   ├── 📄 reminder.routes.ts # Reminder generation
    │   │   ├── 📄 analytics.routes.ts# Analytics endpoints
    │   │   ├── 📄 payment.routes.ts  # Payment processing
    │   │   └── 📄 settings.routes.ts # Settings management
    │   │
    │   ├── 📁 services/              # Business logic
    │   │   ├── 📄 ai.service.ts      # Claude AI integration
    │   │   ├── 📄 email.service.ts   # Email sending (Resend)
    │   │   └── 📄 payment.service.ts # Payment processing (Stripe)
    │   │
    │   ├── 📁 jobs/                  # Scheduled automation
    │   │   ├── 📄 scheduler.ts       # Cron job configuration
    │   │   ├── 📄 updateAging.ts     # Update invoice aging
    │   │   ├── 📄 sendReminders.ts   # Send automated reminders
    │   │   └── 📄 checkAlerts.ts     # Check high-value alerts
    │   │
    │   ├── 📁 utils/                 # Utility functions
    │   │   └── 📄 dateUtils.ts       # Date calculations
    │   │
    │   ├── 📁 scripts/               # Setup scripts
    │   │   └── 📄 initDatabase.ts    # Database initialization
    │   │
    │   └── 📄 server.ts              # Express server entry point
    │
    ├── 📄 package.json               # Backend dependencies
    ├── 📄 tsconfig.json              # TypeScript config
    ├── 📄 .env.example               # Environment template
    └── 📄 database.sqlite            # SQLite database (created on init)
```

## 📂 Directory Explanations

### Root Level
- **Documentation files** - All `.md` files provide comprehensive guides
- **Setup scripts** - Automated installation for Windows and Unix
- **Configuration** - Package.json for monorepo management

### Frontend (`/frontend`)

#### `/public`
- Static files served directly
- HTML template with meta tags

#### `/src/components`
- **Layout.tsx** - Main application shell with sidebar navigation
- Reusable UI components (can add more here)

#### `/src/context`
- **AuthContext.tsx** - Global authentication state
- User information and JWT token management

#### `/src/pages`
Each file is a complete page:
- **Login.tsx** - Authentication page
- **Dashboard.tsx** - Main overview with charts
- **Invoices.tsx** - Invoice list and management
- **Customers.tsx** - Customer list and management
- **Reminders.tsx** - Reminder history and sending
- **Analytics.tsx** - Detailed reports and charts
- **Settings.tsx** - System configuration

#### `/src/services`
- **api.ts** - Axios instance with interceptors
- Centralized API communication

#### `/src/types`
- **index.ts** - All TypeScript interfaces
- Type definitions for data models

### Backend (`/backend`)

#### `/src/config`
- **database.ts** - SQLite setup, schema, initialization
- Database connection and table creation

#### `/src/middleware`
- **auth.middleware.ts** - JWT verification
- Request authentication and authorization

#### `/src/routes`
Each file handles specific endpoints:
- **auth.routes.ts** - Login, register
- **invoice.routes.ts** - Invoice CRUD operations
- **customer.routes.ts** - Customer CRUD operations
- **reminder.routes.ts** - Reminder generation and sending
- **analytics.routes.ts** - Dashboard metrics and reports
- **payment.routes.ts** - Payment links and recording
- **settings.routes.ts** - Configuration management

#### `/src/services`
Business logic layer:
- **ai.service.ts** - Claude API integration for AI messages
- **email.service.ts** - Resend integration for emails
- **payment.service.ts** - Stripe integration for payments

#### `/src/jobs`
Automated background tasks:
- **scheduler.ts** - Cron job setup and configuration
- **updateAging.ts** - Daily aging calculation
- **sendReminders.ts** - Daily reminder sending
- **checkAlerts.ts** - Hourly high-value monitoring

#### `/src/utils`
Helper functions:
- **dateUtils.ts** - Date calculations and formatting

#### `/src/scripts`
Setup and maintenance:
- **initDatabase.ts** - Database initialization with sample data

## 🔍 Key Files Deep Dive

### Frontend Entry Point Flow
```
index.tsx
  └─> App.tsx
      └─> AuthProvider (context)
          └─> Router
              ├─> Login (public)
              └─> Layout (private)
                  └─> Pages (Dashboard, Invoices, etc.)
```

### Backend Entry Point Flow
```
server.ts
  ├─> Initialize Database
  ├─> Start Scheduled Jobs
  ├─> Configure Middleware
  ├─> Register Routes
  └─> Start Express Server
```

### API Request Flow
```
Client Request
  └─> Express Server (server.ts)
      └─> Authentication Middleware (auth.middleware.ts)
          └─> Route Handler (*.routes.ts)
              └─> Service Layer (*.service.ts)
                  └─> Database (database.ts)
```

### Scheduled Job Flow
```
Cron Scheduler (scheduler.ts)
  ├─> Update Aging (updateAging.ts)
  ├─> Send Reminders (sendReminders.ts)
  └─> Check Alerts (checkAlerts.ts)
```

## 📦 Package Dependencies

### Frontend Dependencies
```json
{
  "react": "UI framework",
  "react-router-dom": "Routing",
  "axios": "HTTP client",
  "recharts": "Charts",
  "tailwindcss": "Styling",
  "typescript": "Type safety",
  "react-hot-toast": "Notifications",
  "lucide-react": "Icons"
}
```

### Backend Dependencies
```json
{
  "express": "Web framework",
  "better-sqlite3": "Database",
  "jsonwebtoken": "Authentication",
  "bcryptjs": "Password hashing",
  "node-cron": "Scheduled jobs",
  "stripe": "Payments",
  "resend": "Email",
  "axios": "HTTP client",
  "typescript": "Type safety",
  "helmet": "Security",
  "cors": "CORS handling"
}
```

## 🗄️ Database Structure

### Tables Created
1. **users** - Authentication
2. **customers** - Customer information
3. **invoices** - Invoice records
4. **payments** - Payment transactions
5. **reminders** - Communication history
6. **alerts** - System notifications
7. **settings** - Configuration

### Relationships
```
customers (1) ──< (N) invoices
invoices (1) ──< (N) payments
invoices (1) ──< (N) reminders
invoices (1) ──< (N) alerts
```

## 🔧 Configuration Files

### Frontend
- **tsconfig.json** - TypeScript compiler options
- **tailwind.config.js** - Tailwind CSS customization
- **postcss.config.js** - PostCSS plugins
- **.env** - Environment variables

### Backend
- **tsconfig.json** - TypeScript compiler options
- **.env** - Environment variables (API keys, database path)

## 📝 Documentation Files

### Getting Started
- **GET_STARTED.md** - Beginner guide
- **QUICKSTART.md** - 5-minute setup
- **README.md** - Complete documentation

### Technical
- **ARCHITECTURE.md** - System design
- **API_DOCUMENTATION.md** - API reference
- **PROJECT_STRUCTURE.md** - This file

### Guides
- **DEPLOYMENT.md** - Production deployment
- **TESTING_GUIDE.md** - Testing instructions
- **FEATURES.md** - Feature list

### Reference
- **PROJECT_SUMMARY.md** - Overview
- **CHANGELOG.md** - Version history
- **LICENSE** - MIT License

## 🎯 Where to Find Things

### "I want to..."

**...add a new page**
→ Create file in `frontend/src/pages/`
→ Add route in `frontend/src/App.tsx`

**...add a new API endpoint**
→ Add route in `backend/src/routes/`
→ Register in `backend/src/server.ts`

**...modify the database**
→ Edit `backend/src/config/database.ts`
→ Run `npm run init-db` to recreate

**...change the UI styling**
→ Edit Tailwind classes in components
→ Modify `frontend/tailwind.config.js` for theme

**...add a scheduled job**
→ Create file in `backend/src/jobs/`
→ Register in `backend/src/jobs/scheduler.ts`

**...integrate a new service**
→ Create service in `backend/src/services/`
→ Use in routes or jobs

**...add authentication to a route**
→ Import `authenticateToken` middleware
→ Add to route: `router.use(authenticateToken)`

**...modify AI message generation**
→ Edit `backend/src/services/ai.service.ts`
→ Adjust prompts or fallback templates

**...change email templates**
→ Edit `backend/src/services/email.service.ts`
→ Modify HTML formatting

**...customize the dashboard**
→ Edit `frontend/src/pages/Dashboard.tsx`
→ Add/remove metrics or charts

## 🔐 Environment Files

### Backend `.env`
```
PORT=5000
JWT_SECRET=your-secret
DATABASE_PATH=./database.sqlite
ANTHROPIC_API_KEY=your-key
STRIPE_SECRET_KEY=your-key
RESEND_API_KEY=your-key
FROM_EMAIL=noreply@yourdomain.com
HIGH_VALUE_THRESHOLD=10000
```

### Frontend `.env`
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_STRIPE_PUBLIC_KEY=your-key
```

## 📊 File Size Overview

### Frontend
- Total: ~50 files
- Components: ~10 files
- Pages: 6 files
- Services: 1 file
- Types: 1 file

### Backend
- Total: ~20 files
- Routes: 7 files
- Services: 3 files
- Jobs: 4 files
- Config: 1 file

### Documentation
- Total: 12 markdown files
- Comprehensive guides
- API reference
- Architecture diagrams

## 🎨 Code Organization Principles

1. **Separation of Concerns** - Routes, services, and data access separated
2. **Type Safety** - TypeScript throughout
3. **Modularity** - Small, focused files
4. **Reusability** - Shared components and utilities
5. **Documentation** - Inline comments and external docs
6. **Consistency** - Naming conventions and structure

## 🚀 Build Output

### Frontend Build
```
frontend/build/
├── static/
│   ├── css/
│   ├── js/
│   └── media/
└── index.html
```

### Backend Build
```
backend/dist/
├── config/
├── routes/
├── services/
├── jobs/
└── server.js
```

This structure provides a solid foundation for a scalable, maintainable application!
