import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Invoice } from '../types';
import { Plus, Search, Filter, Eye, Edit, Trash2, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const Invoices: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchInvoices();
  }, [statusFilter]);

  const fetchInvoices = async () => {
    try {
      const params: any = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      
      const response = await api.get('/invoices', { params });
      setInvoices(response.data.invoices);
    } catch (error) {
      toast.error('Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReminder = async (invoiceId: number, invoiceNumber: string) => {
    try {
      toast.loading('Generating AI reminder...', { id: 'reminder' });
      await api.post(`/reminders/generate/${invoiceId}`);
      toast.success(`Reminder generated for ${invoiceNumber}!`, { id: 'reminder' });
    } catch (error) {
      toast.error('Failed to generate reminder', { id: 'reminder' });
    }
  };

  const handleViewInvoice = (invoice: Invoice) => {
    toast.success(`Viewing invoice ${invoice.invoice_number}`);
  };

  const handleEditInvoice = (invoice: Invoice) => {
    toast.success(`Editing invoice ${invoice.invoice_number}`);
  };

  const handleDeleteInvoice = async (invoiceId: number, invoiceNumber: string) => {
    if (window.confirm(`Are you sure you want to delete invoice ${invoiceNumber}?`)) {
      try {
        await api.delete(`/invoices/${invoiceId}`);
        toast.success('Invoice deleted successfully');
        fetchInvoices();
      } catch (error) {
        toast.error('Failed to delete invoice');
      }
    }
  };

  const handleNewInvoice = () => {
    toast.success('Opening new invoice form...');
  };

  const filteredInvoices = invoices.filter(invoice =>
    invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.customer_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'partial': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getAgingColor = (bucket: string) => {
    switch (bucket) {
      case '0-30': return 'bg-green-100 text-green-700';
      case '31-60': return 'bg-yellow-100 text-yellow-700';
      case '61-90': return 'bg-orange-100 text-orange-700';
      case '90+': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
          <p className="text-gray-600 mt-1">Manage and track all invoices</p>
        </div>
        <button 
          onClick={handleNewInvoice}
          className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:scale-95"
        >
          <Plus size={20} />
          <span className="font-medium">New Invoice</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by invoice number or customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white cursor-pointer transition-all"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="partial">Partial</option>
                <option value="paid">Paid</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Invoice #</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Customer</th>
                <th className="text-right py-4 px-6 text-sm font-semibold text-gray-700">Amount</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Due Date</th>
                <th className="text-center py-4 px-6 text-sm font-semibold text-gray-700">Days Overdue</th>
                <th className="text-center py-4 px-6 text-sm font-semibold text-gray-700">Aging</th>
                <th className="text-center py-4 px-6 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-center py-4 px-6 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 text-sm font-medium text-gray-900">
                    {invoice.invoice_number}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    <div>
                      <div className="font-medium text-gray-900">{invoice.customer_name}</div>
                      {invoice.company && <div className="text-xs text-gray-500">{invoice.company}</div>}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-right font-semibold text-gray-900">
                    ${invoice.amount.toLocaleString()}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    {new Date(invoice.due_date).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6 text-sm text-center">
                    {invoice.days_overdue > 0 ? (
                      <span className="text-red-600 font-medium">{invoice.days_overdue} days</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getAgingColor(invoice.aging_bucket)}`}>
                      {invoice.aging_bucket}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleViewInvoice(invoice)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleEditInvoice(invoice)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
                        title="Edit Invoice"
                      >
                        <Edit size={18} />
                      </button>
                      {invoice.days_overdue > 0 && (
                        <button
                          onClick={() => handleGenerateReminder(invoice.id, invoice.invoice_number)}
                          className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
                          title="Generate AI Reminder"
                        >
                          <Send size={18} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteInvoice(invoice.id, invoice.invoice_number)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
                        title="Delete Invoice"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredInvoices.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg font-medium">No invoices found</p>
            <p className="text-sm mt-2">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Invoices;
