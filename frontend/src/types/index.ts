export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  credit_limit: number;
  payment_terms: number;
  status: string;
  created_at: string;
  updated_at: string;
  invoice_count?: number;
  outstanding_amount?: number;
}

export interface Invoice {
  id: number;
  invoice_number: string;
  customer_id: number;
  amount: number;
  due_date: string;
  issue_date: string;
  status: 'pending' | 'partial' | 'paid' | 'cancelled';
  aging_bucket: string;
  days_overdue: number;
  description?: string;
  created_at: string;
  updated_at: string;
  customer_name?: string;
  customer_email?: string;
  company?: string;
}

export interface Payment {
  id: number;
  invoice_id: number;
  amount: number;
  payment_date: string;
  payment_method: string;
  transaction_id: string;
  status: string;
  created_at: string;
}

export interface Reminder {
  id: number;
  invoice_id: number;
  type: 'friendly' | 'firm' | 'escalated';
  channel: 'email' | 'sms';
  message: string;
  sent_date?: string;
  status: 'draft' | 'sent' | 'failed';
  recipient: string;
  created_at: string;
  invoice_number?: string;
  amount?: number;
  customer_name?: string;
}

export interface Alert {
  id: number;
  invoice_id: number;
  type: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  status: 'unread' | 'read';
  created_at: string;
  invoice_number?: string;
  amount?: number;
  customer_name?: string;
}

export interface DashboardMetrics {
  totalOutstanding: number;
  agingBuckets: Array<{
    aging_bucket: string;
    count: number;
    total_amount: number;
  }>;
  recentActivity: Array<any>;
  highValueOverdue: Invoice[];
  collectionRate: number;
  dso: number;
  stats: {
    totalInvoices: number;
    paidInvoices: number;
    paidAmount: number;
  };
}

export interface CashFlowData {
  historical: Array<{ date: string; amount: number }>;
  expected: Array<{ date: string; amount: number }>;
  trend: number;
  summary: {
    last30Days: number;
    previous30Days: number;
  };
}
