import React, { useEffect, useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Save, Bell, DollarSign, Calendar, CheckCircle } from 'lucide-react';

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [highValueThreshold, setHighValueThreshold] = useState('10000');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/settings');
      setSettings(response.data.settings);
      if (response.data.settings.high_value_threshold) {
        setHighValueThreshold(response.data.settings.high_value_threshold.value);
      }
    } catch (error) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: string, value: string) => {
    setSaving(true);
    try {
      await api.put(`/settings/${key}`, { value });
      toast.success('Setting updated successfully!');
      fetchSettings();
    } catch (error) {
      toast.error('Failed to update setting');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = (key: string, currentValue: string) => {
    const newValue = currentValue === 'true' ? 'false' : 'true';
    updateSetting(key, newValue);
  };

  const handleSaveThreshold = () => {
    updateSetting('high_value_threshold', highValueThreshold);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Configure system preferences</p>
      </div>

      {/* Reminder Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
            <Bell className="text-primary-600" size={20} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Reminder Settings</h2>
            <p className="text-sm text-gray-600">Configure automated reminder schedules</p>
          </div>
        </div>
        
        <div className="space-y-4">
          {/* 7-Day Reminder */}
          <div className="flex items-center justify-between py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="text-green-600" size={16} />
              </div>
              <div>
                <p className="font-medium text-gray-900">7-Day Reminder</p>
                <p className="text-sm text-gray-600">Send friendly reminder at 7 days overdue</p>
              </div>
            </div>
            <button
              onClick={() => handleToggle('reminder_day_7', settings.reminder_day_7?.value)}
              disabled={saving}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                settings.reminder_day_7?.value === 'true' ? 'bg-primary-600' : 'bg-gray-200'
              } ${saving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                  settings.reminder_day_7?.value === 'true' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* 30-Day Reminder */}
          <div className="flex items-center justify-between py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Calendar className="text-yellow-600" size={16} />
              </div>
              <div>
                <p className="font-medium text-gray-900">30-Day Reminder</p>
                <p className="text-sm text-gray-600">Send firm reminder at 30 days overdue</p>
              </div>
            </div>
            <button
              onClick={() => handleToggle('reminder_day_30', settings.reminder_day_30?.value)}
              disabled={saving}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                settings.reminder_day_30?.value === 'true' ? 'bg-primary-600' : 'bg-gray-200'
              } ${saving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                  settings.reminder_day_30?.value === 'true' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* 60-Day Escalation */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <Calendar className="text-red-600" size={16} />
              </div>
              <div>
                <p className="font-medium text-gray-900">60-Day Escalation</p>
                <p className="text-sm text-gray-600">Send escalated reminder at 60 days overdue</p>
              </div>
            </div>
            <button
              onClick={() => handleToggle('reminder_day_60', settings.reminder_day_60?.value)}
              disabled={saving}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                settings.reminder_day_60?.value === 'true' ? 'bg-primary-600' : 'bg-gray-200'
              } ${saving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                  settings.reminder_day_60?.value === 'true' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* High Value Threshold */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <DollarSign className="text-orange-600" size={20} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">High Value Threshold</h2>
            <p className="text-sm text-gray-600">Alert threshold for high-value invoices (in dollars)</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">$</span>
              <input
                type="number"
                value={highValueThreshold}
                onChange={(e) => setHighValueThreshold(e.target.value)}
                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-lg font-semibold"
                placeholder="10000"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">Invoices above this amount will trigger immediate alerts when overdue</p>
          </div>
          <button
            onClick={handleSaveThreshold}
            disabled={saving}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span className="font-medium">Saving...</span>
              </>
            ) : (
              <>
                <Save size={20} />
                <span className="font-medium">Save</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Status Indicator */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
        <CheckCircle className="text-green-600" size={24} />
        <div>
          <p className="font-medium text-green-900">All systems operational</p>
          <p className="text-sm text-green-700">Automated reminders and alerts are active</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
