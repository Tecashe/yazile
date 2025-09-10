'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface WhatsAppAccountSetup {
  appId: string;
  appSecret: string;
  wabaId: string;
  businessPhoneNumberId: string;
  phoneNumber: string;
  displayName: string;
  accessToken: string;
}

export default function WhatsAppSetupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [formData, setFormData] = useState<WhatsAppAccountSetup>({
    appId: '',
    appSecret: '',
    wabaId: '',
    businessPhoneNumberId: '',
    phoneNumber: '',
    displayName: '',
    accessToken: ''
  });

  // Load existing WhatsApp accounts
  useEffect(() => {
    fetchWhatsAppAccounts();
  }, []);

  const fetchWhatsAppAccounts = async () => {
    try {
      const response = await fetch('/api/whatsapp/accounts');
      if (response.ok) {
        const data = await response.json();
        setAccounts(data.accounts);
      }
    } catch (error) {
      console.error('Error fetching WhatsApp accounts:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateAccessToken = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/whatsapp/validate-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accessToken: formData.accessToken,
          appId: formData.appId
        })
      });

      const data = await response.json();
      if (data.success) {
        setFormData({
          ...formData,
          wabaId: data.wabaId,
          businessPhoneNumberId: data.phoneNumberId,
          phoneNumber: data.phoneNumber,
          displayName: data.displayName
        });
        setStep(3);
        toast.success('Access token validated successfully!');
      } else {
        toast.error(data.error || 'Failed to validate access token');
      }
    } catch (error) {
      toast.error('Error validating access token');
    } finally {
      setLoading(false);
    }
  };

  const setupWebhook = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/whatsapp/setup-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accessToken: formData.accessToken,
          wabaId: formData.wabaId
        })
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Webhook configured successfully!');
        setStep(4);
      } else {
        toast.error(data.error || 'Failed to setup webhook');
      }
    } catch (error) {
      toast.error('Error setting up webhook');
    } finally {
      setLoading(false);
    }
  };

  const saveAccount = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/whatsapp/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        toast.success('WhatsApp account connected successfully!');
        router.push('/dashboard/whatsapp');
      } else {
        toast.error(data.error || 'Failed to save account');
      }
    } catch (error) {
      toast.error('Error saving account');
    } finally {
      setLoading(false);
    }
  };

  const removeAccount = async (accountId: string) => {
    if (!confirm('Are you sure you want to remove this WhatsApp account?')) return;

    try {
      const response = await fetch(`/api/whatsapp/accounts/${accountId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success('Account removed successfully');
        fetchWhatsAppAccounts();
      } else {
        toast.error('Failed to remove account');
      }
    } catch (error) {
      toast.error('Error removing account');
    }
  };

  const testConnection = async (accountId: string) => {
    try {
      const response = await fetch(`/api/whatsapp/test-connection/${accountId}`, {
        method: 'POST'
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Connection test successful!');
      } else {
        toast.error(data.error || 'Connection test failed');
      }
    } catch (error) {
      toast.error('Error testing connection');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6">WhatsApp Business API Setup</h1>

        {/* Existing Accounts */}
        {accounts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Connected Accounts</h2>
            <div className="grid gap-4">
              {accounts.map((account) => (
                <div key={account.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{account.displayName || account.phoneNumber}</h3>
                      <p className="text-gray-600 text-sm">{account.phoneNumber}</p>
                      <p className="text-gray-500 text-xs">Status: {account.status}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => testConnection(account.id)}
                        className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                      >
                        Test
                      </button>
                      <button
                        onClick={() => removeAccount(account.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Setup Steps */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  s <= step ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {s}
                </div>
                {s < 4 && <div className={`w-16 h-1 ${s < step ? 'bg-blue-500' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: App Credentials */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Step 1: Meta App Credentials</h2>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                Get these from your Meta Developer Console → Your App → App Settings → Basic
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">App ID</label>
                <input
                  type="text"
                  name="appId"
                  value={formData.appId}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Enter your App ID"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">App Secret</label>
                <input
                  type="password"
                  name="appSecret"
                  value={formData.appSecret}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Enter your App Secret"
                />
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!formData.appId || !formData.appSecret}
              className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              Next: Access Token
            </button>
          </div>
        )}

        {/* Step 2: Access Token */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Step 2: Access Token</h2>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-yellow-800">
                Generate a permanent access token from Meta Developer Console → Your App → WhatsApp → API Setup
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">System User Access Token</label>
              <textarea
                name="accessToken"
                value={formData.accessToken}
                onChange={(e) => setFormData({...formData, accessToken: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg h-24"
                placeholder="Paste your system user access token here"
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep(1)}
                className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-600"
              >
                Back
              </button>
              <button
                onClick={validateAccessToken}
                disabled={!formData.accessToken || loading}
                className="flex-1 bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? 'Validating...' : 'Validate Token'}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Account Info */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Step 3: Account Information</h2>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-800">
                ✓ Access token validated successfully! Here&apos;s your account information:
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Business Phone Number</label>
                <input
                  type="text"
                  value={formData.phoneNumber}
                  readOnly
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Display Name</label>
                <input
                  type="text"
                  value={formData.displayName}
                  readOnly
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">WABA ID</label>
                <input
                  type="text"
                  value={formData.wabaId}
                  readOnly
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Phone Number ID</label>
                <input
                  type="text"
                  value={formData.businessPhoneNumberId}
                  readOnly
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep(2)}
                className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-600"
              >
                Back
              </button>
              <button
                onClick={setupWebhook}
                disabled={loading}
                className="flex-1 bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? 'Setting up...' : 'Setup Webhook'}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Complete */}
        {step === 4 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Step 4: Complete Setup</h2>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-800">
                ✓ Webhook configured successfully! Your WhatsApp Business account is ready.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Account Summary</h3>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li><strong>Phone:</strong> {formData.phoneNumber}</li>
                  <li><strong>Display Name:</strong> {formData.displayName}</li>
                  <li><strong>WABA ID:</strong> {formData.wabaId}</li>
                  <li><strong>Status:</strong> Ready for automation</li>
                </ul>
              </div>
            </div>

            <button
              onClick={saveAccount}
              disabled={loading}
              className="w-full bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Complete Setup'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}