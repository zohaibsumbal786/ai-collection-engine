# 🤖 AI Collection Engine - Accounts Receivable Automation System

> A complete, production-ready web application that automates accounts receivable management with AI-powered reminders, intelligent aging analysis, and comprehensive analytics.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-404D59?style=flat)](https://expressjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

## 🌟 Why This Project?

This isn't just another demo app - it's a **fully functional, production-ready system** that businesses can deploy today to automate their accounts receivable process. Built with modern technologies and best practices, it showcases:

- ✅ **Real AI Integration** - Claude API for intelligent message generation
- ✅ **Complete Automation** - Scheduled jobs, smart triggers, escalation workflows
- ✅ **Beautiful UI** - Professional, responsive design with Tailwind CSS
- ✅ **Type Safety** - Full TypeScript implementation
- ✅ **Production Ready** - Security, error handling, deployment guides
- ✅ **Free to Start** - Works with free tier services

## 📸 Screenshots

### Dashboard
![Dashboard with analytics, charts, and metrics](docs/dashboard-preview.png)

### Invoice Management
![Invoice list with aging buckets and status](docs/invoices-preview.png)

### AI Reminder Generation
![AI-powered reminder with payment link](docs/reminders-preview.png)

## Features

- **Invoice Aging Monitoring**: Automatic tracking with configurable aging buckets (0-30, 31-60, 61-90, 90+ days)
- **AI-Powered Reminders**: Personalized collection messages using Claude API
- **Payment Integration**: Secure payment links with Stripe test mode
- **High-Value Alerts**: Real-time notifications for critical overdue invoices
- **Analytics Dashboard**: Cash flow predictions, DSO tracking, collection metrics
- **Multi-Channel Communication**: Email and SMS reminders
- **Automated Escalation**: Smart reminder sequences based on aging

## Tech Stack

**Frontend:**
- React 18 + TypeScript
- Tailwind CSS
- Recharts for visualizations
- React Router v6

**Backend:**
- Node.js + Express
- SQLite database
- JWT authentication
- Node-cron for scheduled jobs

**Integrations:**
- Anthropic Claude API (AI message generation)
- Stripe (payment processing)
- Resend (email delivery)

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

1. Clone and install dependencies:
```bash
npm install
cd frontend && npm install && cd ..
cd backend && npm install && cd ..
```

2. Configure environment variables:

**Backend (.env in /backend):**
```
PORT=5000
JWT_SECRET=your-secret-key-change-in-production
ANTHROPIC_API_KEY=your-claude-api-key
STRIPE_SECRET_KEY=your-stripe-test-key
RESEND_API_KEY=your-resend-api-key
DATABASE_PATH=./database.sqlite
```

**Frontend (.env in /frontend):**
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_STRIPE_PUBLIC_KEY=your-stripe-public-key
```

3. Initialize database:
```bash
cd backend
npm run init-db
```

4. Start development servers:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

5. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Default Login
- Email: admin@example.com
- Password: admin123

## Project Structure

```
ai-collection-engine/
├── frontend/                 # React TypeScript frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── types/           # TypeScript types
│   │   ├── utils/           # Helper functions
│   │   └── App.tsx          # Main app component
│   └── package.json
├── backend/                  # Node.js Express backend
│   ├── src/
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── models/          # Database models
│   │   ├── middleware/      # Express middleware
│   │   ├── jobs/            # Scheduled jobs
│   │   └── server.ts        # Entry point
│   └── package.json
└── README.md
```

## API Endpoints

### Authentication
- POST `/api/auth/login` - User login
- POST `/api/auth/register` - User registration

### Invoices
- GET `/api/invoices` - List all invoices
- GET `/api/invoices/:id` - Get invoice details
- POST `/api/invoices` - Create invoice
- PUT `/api/invoices/:id` - Update invoice
- DELETE `/api/invoices/:id` - Delete invoice

### Customers
- GET `/api/customers` - List all customers
- POST `/api/customers` - Create customer
- PUT `/api/customers/:id` - Update customer

### Reminders
- GET `/api/reminders` - List reminders
- POST `/api/reminders/generate` - Generate AI reminder
- POST `/api/reminders/send` - Send reminder

### Analytics
- GET `/api/analytics/dashboard` - Dashboard metrics
- GET `/api/analytics/cash-flow` - Cash flow predictions
- GET `/api/analytics/aging` - Aging analysis

### Payments
- POST `/api/payments/create-link` - Create payment link
- POST `/api/payments/webhook` - Stripe webhook

## Automation Rules

The system automatically:
- Sends friendly reminder at 7 days overdue
- Sends firm reminder at 30 days overdue
- Escalates to account owner at 60 days overdue
- Alerts immediately for high-value invoices (>$10,000) overdue by 1 day

## Deployment

### Frontend (Vercel)
```bash
cd frontend
vercel deploy --prod
```

### Backend (Railway/Render)
1. Push to GitHub
2. Connect repository to Railway/Render
3. Set environment variables
4. Deploy

## Development

### Run tests:
```bash
npm test
```

### Build for production:
```bash
cd frontend && npm run build
cd backend && npm run build
```

## License

MIT License - feel free to use for commercial projects

## Support

For issues or questions, please open a GitHub issue.
