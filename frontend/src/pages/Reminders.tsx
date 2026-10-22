import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Reminder } from '../types';
import { Send, Sparkles, Eye, RefreshCw, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Reminders: React.FC = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      const response = await api.get('/reminders');
      setReminders(response.data.reminders);
    } catch (error) {
      toast.error('Failed to load reminders');
    } finally {
      setLoading(false);
    }
  };

  const sendReminder = async (id: number, invoiceNumber: string) => {
    try {
      toast.loading('Sending reminder...', { id: 'send' });
      await api.post(`/reminders/send/${id}`);
      toast.success(`Reminder sent for ${invoiceNumber}!`, { id: 'send' });
      fetchReminders();
    } catch (error) {
      toast.error('Failed to send reminder', { id: 'send' });
    }
  };

  const viewReminderDetails = (reminder: Reminder) => {
    toast.success(`Viewing reminder for ${reminder.invoice_number}`);
  };

  const regenerateReminder = async (invoiceId: number, invoiceNumber: string) => {
    try {
      toast.loading('Regenerating reminder...', { id: 'regen' });
      await api.post(`/reminders/generate/${invoiceId}`);
      toast.success(`New reminder generated for ${invoiceNumber}!`, { id: 'regen' });
      fetchReminders();
    } catch (error) {
      toast.error('Failed to regenerate reminder', { id: 'regen' });
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'friendly': return 'bg-green-100 text-green-700';
      case 'firm': return 'bg-yellow-100 text-yellow-700';
      case 'escalated': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-green-100 text-green-700';
      case 'draft': return 'bg-gray-100 text-gray-700';
      case 'failed': return 'bg-red-100 text-red-700';
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
          <h1 className="text-3xl font-bold text-gray-900">Reminders</h1>
          <p className="text-gray-600 mt-1">AI-powered payment reminders</p>
        </div>
        <button 
          onClick={fetchReminders}
          className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:scale-95"
        >
          <RefreshCw size={20} />
          <span className="font-medium">Refresh</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Invoice</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Customer</th>
                <th className="text-center py-4 px-6 text-sm font-semibold text-gray-700">Type</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Recipient</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Date</th>
                <th className="text-center py-4 px-6 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-center py-4 px-6 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reminders.map((reminder) => (
                <tr key={reminder.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 text-sm font-medium text-gray-900">
                    {reminder.invoice_number}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    {reminder.customer_name}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${getTypeColor(reminder.type)}`}>
                      <Sparkles size={12} />
                      {reminder.type}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    {reminder.recipient}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    {reminder.sent_date ? new Date(reminder.sent_date).toLocaleDateString() : '-'}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${getStatusColor(reminder.status)}`}>
                      {reminder.status === 'sent' && <CheckCircle size={12} />}
                      {reminder.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => viewReminderDetails(reminder)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      {reminder.status === 'draft' && (
                        <>
                          <button
                            onClick={() => sendReminder(reminder.id, reminder.invoice_number || '')}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
                            title="Send Reminder"
                          >
                            <Send size={18} />
                          </button>
                          <button
                            onClick={() => regenerateReminder(reminder.invoice_id, reminder.invoice_number || '')}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
                            title="Regenerate with AI"
                          >
                            <RefreshCw size={18} />
                          </button>
                        </>
                      )}
                      {reminder.status === 'sent' && (
                        <button
                          onClick={() => regenerateReminder(reminder.invoice_id, reminder.invoice_number || '')}
                          className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
                          title="Generate New Reminder"
                        >
                          <Sparkles size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {reminders.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Sparkles size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">No reminders found</p>
            <p className="text-sm mt-2">Generate reminders from overdue invoices</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reminders;
