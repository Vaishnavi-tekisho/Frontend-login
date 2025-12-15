import React, { useState } from 'react';
import { Card, Toggle, Button, Input, TextArea, Select } from '../UIComponents';
import { FcFeedback, FcComments, FcExport, FcCheckmark as FcSent, FcQuestions, FcDown, FcUp, FcAlarmClock, FcClock, FcHighPriority, FcAbout, FcFlashOn, FcPlus } from 'react-icons/fc';
import { Pencil, Trash2 } from 'lucide-react';

// --- Notifications Section ---
export const NotificationsSection: React.FC = () => {
  // Master Toggle State
  const [pushEnabled, setPushEnabled] = useState(true);

  // Notification Types State
  const [notifySettings, setNotifySettings] = useState({
    meetingReminders: true,
    accountAlerts: false,
    systemAnnouncements: false,
    productUpdates: true,
  });

  // Meeting Timers State
  const [timers, setTimers] = useState<number[]>([15, 60]);
  const [newTimerVal, setNewTimerVal] = useState('');

  const handleAddTimer = () => {
    const val = parseInt(newTimerVal);
    if (!isNaN(val) && val > 0 && !timers.includes(val)) {
      setTimers([...timers, val].sort((a, b) => a - b));
      setNewTimerVal('');
    }
  };

  const removeTimer = (val: number) => {
    setTimers(timers.filter(t => t !== val));
  };


  return (
    <div className="space-y-6 animate-fade-in">
      {/* Push Notifications Card */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-50 p-3 rounded-full">
              <FcAlarmClock size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Push Notifications</h2>
              <p className="text-sm text-gray-500">Receive alerts on your device.</p>
            </div>
          </div>
          {/* Master Toggle */}
          <div
            onClick={() => setPushEnabled(!pushEnabled)}
            className={`w-14 h-7 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer transition-colors duration-300 ${pushEnabled ? 'bg-blue-600' : ''}`}
          >
            <div className={`bg-white w-5 h-5 rounded-full shadow-md transform duration-300 ${pushEnabled ? 'translate-x-7' : ''}`}></div>
          </div>
        </div>

        {pushEnabled && (
          <div className="mt-8 space-y-2 animate-fade-in">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Notify Me About</p>

            {/* Notification Options */}
            <div
              className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all border ${notifySettings.meetingReminders ? 'bg-blue-50 border-blue-100' : 'bg-white border-transparent hover:bg-gray-50'}`}
              onClick={() => setNotifySettings(p => ({ ...p, meetingReminders: !p.meetingReminders }))}
            >
              <div className="flex items-center gap-3">
                <FcClock size={18} />
                <span className={`text-sm font-medium ${notifySettings.meetingReminders ? "text-blue-900" : "text-gray-700"}`}>Meeting reminders</span>
              </div>
              {notifySettings.meetingReminders && <div className="text-blue-600">✓</div>}
            </div>

            <div
              className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all border ${notifySettings.accountAlerts ? 'bg-blue-50 border-blue-100' : 'bg-white border-transparent hover:bg-gray-50'}`}
              onClick={() => setNotifySettings(p => ({ ...p, accountAlerts: !p.accountAlerts }))}
            >
              <div className="flex items-center gap-3">
                <FcHighPriority size={18} />
                <span className={`text-sm font-medium ${notifySettings.accountAlerts ? "text-blue-900" : "text-gray-700"}`}>Account alerts</span>
              </div>
              {notifySettings.accountAlerts && <div className="text-blue-600">✓</div>}
            </div>

            <div
              className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all border ${notifySettings.systemAnnouncements ? 'bg-blue-50 border-blue-100' : 'bg-white border-transparent hover:bg-gray-50'}`}
              onClick={() => setNotifySettings(p => ({ ...p, systemAnnouncements: !p.systemAnnouncements }))}
            >
              <div className="flex items-center gap-3">
                <FcAbout size={18} />
                <span className={`text-sm font-medium ${notifySettings.systemAnnouncements ? "text-blue-900" : "text-gray-700"}`}>System announcements</span>
              </div>
              {notifySettings.systemAnnouncements && <div className="text-blue-600">✓</div>}
            </div>

            <div
              className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all border ${notifySettings.productUpdates ? 'bg-blue-50 border-blue-100' : 'bg-white border-transparent hover:bg-gray-50'}`}
              onClick={() => setNotifySettings(p => ({ ...p, productUpdates: !p.productUpdates }))}
            >
              <div className="flex items-center gap-3">
                <FcFlashOn size={18} />
                <span className={`text-sm font-medium ${notifySettings.productUpdates ? "text-blue-900" : "text-gray-700"}`}>Product updates</span>
              </div>
              {notifySettings.productUpdates && <div className="text-blue-600">✓</div>}
            </div>
          </div>
        )}
      </Card>

      {/* Meeting Timer Configuration */}
      <Card title="Meeting Timer Configuration" description="Customize when you receive your meeting alerts.">
        <div className="space-y-3 mt-2">
          {timers.map((time) => (
            <div key={time} className="group flex items-center justify-between p-4 bg-blue-50/50 border border-blue-100 rounded-lg hover:bg-blue-50 transition-colors">
              <span className="text-sm font-semibold text-blue-900">
                {time} minutes before meeting
              </span>
              <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {/* Note: Edit functionality is tricky for simple numbers, usually you delete and re-add, but we will show the icon as requested */}
                <button className="p-1.5 text-blue-400 hover:text-blue-600 transition-colors" title="Edit">
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => removeTimer(time)}
                  className="p-1.5 text-red-400 hover:text-red-600 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}

          {/* Add Custom Timer */}
          <div className="flex items-center justify-between bg-slate-900 p-4 rounded-lg mt-4">
            <span className="text-sm font-bold text-white uppercase tracking-wider">Add Custom Timer</span>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  value={newTimerVal}
                  onChange={(e) => setNewTimerVal(e.target.value)}
                  className="w-16 bg-slate-800 text-white border-slate-700 rounded px-2 py-1 text-center font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="00"
                />
              </div>
              <span className="text-xs font-bold text-slate-400">MINS</span>
              <button
                onClick={handleAddTimer}
                className="w-8 h-8 flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors"
              >
                <FcPlus size={18} />
              </button>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex justify-end pt-4">
        <Button onClick={() => alert("Preferences Saved")}>Save Preferences</Button>
      </div>
    </div>
  );
};

// --- FAQ Item Component ---
const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-4 text-left focus:outline-none group"
      >
        <span className={`text-sm font-medium transition-colors ${isOpen ? 'text-blue-600' : 'text-gray-900 group-hover:text-blue-600'}`}>
          {question}
        </span>
        {isOpen ? (
          <FcUp size={16} />
        ) : (
          <FcDown size={16} />
        )}
      </button>
      {isOpen && (
        <div className="pb-4 text-sm text-gray-600 leading-relaxed animate-fade-in">
          {answer}
        </div>
      )}
    </div>
  );
};

// --- About Section (Help & Support) ---
export const AboutSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'contact' | 'email' | 'faq'>('faq');
  const [supportForm, setSupportForm] = useState({ category: 'Technical', priority: 'Medium', subject: '', desc: '' });

  const faqs = [
    {
      question: "How do I reset my password?",
      answer: "You can reset your password by going to the Security tab and clicking on 'Set Password'. If you cannot log in, use the 'Forgot Password' link on the login page."
    },
    {
      question: "Where can I find my invoices?",
      answer: "Invoices are available in the Plans & Billing tab under the 'Billing History' section. You can download PDF copies of all past transactions."
    },
    {
      question: "How do I add a new user to my team?",
      answer: "To add a new user, navigate to the Team Management section (available for Admin roles). Click 'Add Member' and enter their email address to send an invitation."
    },
    {
      question: "Can I change my subscription plan?",
      answer: "Yes, go to Plans & Billing > Pricing Plans. You can upgrade or downgrade your plan at any time. Changes typically take effect immediately."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, Mastercard, Amex) and UPI payments. You can manage your payment methods in the Billing Settings tab."
    }
  ];

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* FAQ Tab */}
        <div
          onClick={() => setActiveTab('faq')}
          className={`cursor-pointer rounded-xl p-6 border-2 transition-all duration-200 flex items-center space-x-4 ${activeTab === 'faq' ? 'border-blue-600 bg-blue-50 shadow-sm' : 'border-gray-200 bg-white hover:border-blue-300'
            }`}
        >
          <div className={`p-3 rounded-full flex-shrink-0 ${activeTab === 'faq' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
            <FcQuestions size={24} />
          </div>
          <div>
            <h3 className={`text-lg font-bold ${activeTab === 'faq' ? 'text-blue-900' : 'text-gray-900'}`}>FAQs</h3>
            <p className="text-sm text-gray-500">Common questions.</p>
          </div>
        </div>

        {/* Contact Support Tab */}
        <div
          onClick={() => setActiveTab('contact')}
          className={`cursor-pointer rounded-xl p-6 border-2 transition-all duration-200 flex items-center space-x-4 ${activeTab === 'contact' ? 'border-blue-600 bg-blue-50 shadow-sm' : 'border-gray-200 bg-white hover:border-blue-300'
            }`}
        >
          <div className={`p-3 rounded-full flex-shrink-0 ${activeTab === 'contact' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
            <FcComments size={24} />
          </div>
          <div>
            <h3 className={`text-lg font-bold ${activeTab === 'contact' ? 'text-blue-900' : 'text-gray-900'}`}>Contact Support</h3>
            <p className="text-sm text-gray-500">Submit a ticket.</p>
          </div>
        </div>

        {/* Email Support Tab */}
        <div
          onClick={() => setActiveTab('email')}
          className={`cursor-pointer rounded-xl p-6 border-2 transition-all duration-200 flex items-center space-x-4 ${activeTab === 'email' ? 'border-blue-600 bg-blue-50 shadow-sm' : 'border-gray-200 bg-white hover:border-blue-300'
            }`}
        >
          <div className={`p-3 rounded-full flex-shrink-0 ${activeTab === 'email' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
            <FcFeedback size={24} />
          </div>
          <div>
            <h3 className={`text-lg font-bold ${activeTab === 'email' ? 'text-blue-900' : 'text-gray-900'}`}>Email Support</h3>
            <p className="text-sm text-gray-500">Direct email.</p>
          </div>
        </div>
      </div>

      {/* Dynamic Content */}
      <Card className="animate-fade-in min-h-[400px]">
        {activeTab === 'faq' && (
          <div className="max-w-2xl mx-auto py-2">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h3>
              <p className="text-gray-500 mt-2">Find answers to the most common questions about our platform.</p>
            </div>
            <div className="space-y-1">
              {faqs.map((faq, index) => (
                <FAQItem key={index} question={faq.question} answer={faq.answer} />
              ))}
            </div>
            <div className="mt-8 p-4 bg-blue-50 rounded-lg text-center">
              <p className="text-sm text-blue-800">Can't find what you're looking for?</p>
              <button onClick={() => setActiveTab('contact')} className="text-blue-600 font-bold text-sm hover:underline mt-1">Contact Support</button>
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="max-w-2xl mx-auto py-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Submit a Ticket</h3>
              <span className="text-sm text-gray-500">Response time: ~4 hours</span>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Category"
                  options={[{ value: 'Technical', label: 'Technical Issue' }, { value: 'Billing', label: 'Billing Issue' }, { value: 'Feature', label: 'Feature Request' }]}
                  value={supportForm.category}
                  onChange={(e) => setSupportForm({ ...supportForm, category: e.target.value })}
                />
                <Select
                  label="Priority"
                  options={[{ value: 'Low', label: 'Low' }, { value: 'Medium', label: 'Medium' }, { value: 'High', label: 'High' }, { value: 'Urgent', label: 'Urgent' }]}
                  value={supportForm.priority}
                  onChange={(e) => setSupportForm({ ...supportForm, priority: e.target.value })}
                />
              </div>
              <Input
                label="Subject"
                value={supportForm.subject}
                onChange={e => setSupportForm({ ...supportForm, subject: e.target.value })}
                placeholder="Brief summary of the issue"
              />
              <TextArea
                label="Description"
                rows={5}
                value={supportForm.desc}
                onChange={e => setSupportForm({ ...supportForm, desc: e.target.value })}
                placeholder="Detailed explanation..."
              />

              <div className="flex justify-end pt-4">
                <Button onClick={() => alert("Ticket Created! Reference #9921")} className="w-full sm:w-auto flex items-center">
                  <span className="mr-2"><FcSent size={16} /></span> Submit Ticket
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'email' && (
          <div className="max-w-xl mx-auto py-12 text-center">
            <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <FcFeedback size={48} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Email Us Directly</h3>
            <p className="text-gray-500 mb-8 leading-relaxed">
              For general inquiries, partnership opportunities, or if you simply prefer email, our team is ready to help. We aim to respond to all emails within 24 hours.
            </p>

            <div className="bg-gray-50 px-8 py-4 rounded-xl border border-gray-200 inline-flex flex-col items-center mb-8">
              <span className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Support Email</span>
              <span className="font-mono text-xl font-medium text-gray-900 select-all">support@nexus.com</span>
            </div>

            <div className="flex justify-center">
              <Button onClick={() => window.open('mailto:support@nexus.com')} className="flex items-center px-8 py-3">
                <span className="mr-2"><FcExport size={18} /></span>
                Open Email Client
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
