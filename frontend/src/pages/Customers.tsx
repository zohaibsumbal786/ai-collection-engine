import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Customer } from '../types';
import { Plus, Search, Eye, Edit, Trash2, Mail, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await api.get('/customers');
      setCustomers(response.data.customers);
    } catch (error) {
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const handleNewCustomer = () => {
    toast.success('Opening new customer form...');
  };

  const handleViewCustomer = (customer: Customer) => {
    toast.success(`Viewing ${customer.name}`);
  };

  const handleEditCustomer = (customer: Customer) => {
    toast.success(`Editing ${customer.name}`);
  };

  const handleDeleteCustomer = async (customerId: number, customerName: string) => {
    if (window.confirm(`Are you sure you want to delete ${customerName}? This will also delete all associated invoices.`)) {
      try {
        await api.delete(`/customers/${customerId}`);
        toast.success('Customer deleted successfully');
        fetchCustomers();
      } catch (error) {
        toast.error('Failed to delete customer');
      }
    }
  };

  const handleEmailCustomer = (email: string, name: string) => {
    window.location.href = `mailto:${email}`;
    toast.success(`Opening email to ${name}`);
  };

  const handleCallCustomer = (phone: string, name: string) => {
    window.location.href = `tel:${phone}`;
    toast.success(`Calling ${name}`);
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600 mt-1">Manage customer information</p>
        </div>
        <button 
          onClick={handleNewCustomer}
          className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:scale-95"
        >
          <Plus size={20} />
          <span className="font-medium">New Customer</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, email, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Name</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Company</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Contact</th>
                <th className="text-right py-4 px-6 text-sm font-semibold text-gray-700">Outstanding</th>
                <th className="text-center py-4 px-6 text-sm font-semibold text-gray-700">Invoices</th>
                <th className="text-center py-4 px-6 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-center py-4 px-6 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 text-sm font-medium text-gray-900">
                    {customer.name}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    {customer.company || '-'}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Mail size={14} className="text-gray-400" />
                        <span>{customer.email}</span>
                      </div>
                      {customer.phone && (
                        <div className="flex items-center gap-2">
                          <Phone size={14} className="text-gray-400" />
                          <span>{customer.phone}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-right font-semibold text-gray-900">
                    ${(customer.outstanding_amount || 0).toLocaleString()}
                  </td>
                  <td className="py-4 px-6 text-sm text-center text-gray-600">
                    <span className="bg-gray-100 px-3 py-1 rounded-full font-medium">
                      {customer.invoice_count || 0}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      customer.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleViewCustomer(customer)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleEditCustomer(customer)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
                        title="Edit Customer"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleEmailCustomer(customer.email, customer.name)}
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
                        title="Send Email"
                      >
                        <Mail size={18} />
                      </button>
                      {customer.phone && (
                        <button
                          onClick={() => handleCallCustomer(customer.phone!, customer.name)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
                          title="Call Customer"
                        >
                          <Phone size={18} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteCustomer(customer.id, customer.name)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
                        title="Delete Customer"
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

        {filteredCustomers.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg font-medium">No customers found</p>
            <p className="text-sm mt-2">Try adjusting your search</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Customers;
