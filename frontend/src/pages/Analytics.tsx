import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import toast from 'react-hot-toast';

const Analytics: React.FC = () => {
  const [agingData, setAgingData] = useState<any>(null);
  const [efficiency, setEfficiency] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [agingRes, efficiencyRes] = await Promise.all([
        api.get('/analytics/aging'),
        api.get('/analytics/efficiency')
      ]);
      
      setAgingData(agingRes.data);
      setEfficiency(efficiencyRes.data);
    } catch (error) {
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>;
  }

  const agingChartData = agingData?.agingBuckets.map((bucket: any) => ({
    name: bucket.aging_bucket,
    amount: bucket.total_amount,
    count: bucket.invoice_count
  })) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-1">Detailed insights and reports</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-sm font-medium text-gray-600">Avg Days to Payment</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {efficiency?.avgDaysToPayment || 0} days
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-sm font-medium text-gray-600">Monthly Payments</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {efficiency?.monthlyTrends?.length || 0}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-sm font-medium text-gray-600">Reminder Effectiveness</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {efficiency?.reminderEffectiveness?.length || 0}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Aging Bucket Distribution</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={agingChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value: any) => `$${value.toLocaleString()}`} />
              <Bar dataKey="amount" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Customers by Overdue Amount</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Customer</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Overdue Amount</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Invoices</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Max Days Overdue</th>
              </tr>
            </thead>
            <tbody>
              {agingData?.topCustomers?.slice(0, 10).map((customer: any) => (
                <tr key={customer.id} className="border-b border-gray-100">
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">
                    {customer.name}
                    {customer.company && <span className="text-gray-500 text-xs ml-2">({customer.company})</span>}
                  </td>
                  <td className="py-3 px-4 text-sm text-right font-semibold text-gray-900">
                    ${customer.overdue_amount.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-sm text-center text-gray-600">
                    {customer.overdue_count}
                  </td>
                  <td className="py-3 px-4 text-sm text-center text-red-600 font-medium">
                    {customer.max_days_overdue} days
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
