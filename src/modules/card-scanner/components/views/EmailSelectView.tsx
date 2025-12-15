import React from 'react';
import { Mail, CheckCircle2 } from 'lucide-react';
import { Contact } from '../../types';

interface EmailSelectViewProps {
  contact: Contact | null;
  onSelect: (emailId: string) => void;
  onCancel: () => void;
}

const EmailSelectView: React.FC<EmailSelectViewProps> = ({ contact, onSelect, onCancel }) => {
  if (!contact) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 backdrop-blur-sm p-0 md:p-4 animate-in fade-in duration-200">
      
      {/* Click outside to cancel */}
      <div className="absolute inset-0" onClick={onCancel}></div>

      <div className="relative w-full md:max-w-md bg-white rounded-t-2xl md:rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-xl font-bold text-gray-900">Select Primary Email</h3>
          <p className="text-gray-500 text-sm mt-1">
            Multiple emails found for <span className="font-semibold text-gray-700">{contact.first_name}</span>. 
            Which one should be used for this action?
          </p>
        </div>

        {/* List */}
        <div className="p-4 space-y-3">
          {contact.contact_emails.map((email) => (
            <button
              key={email.id}
              onClick={() => onSelect(email.id)}
              className="w-full flex items-center p-4 border border-gray-200 rounded-xl hover:border-brand-500 hover:bg-brand-50/30 transition-all group text-left"
            >
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg mr-4 group-hover:bg-blue-100 transition-colors">
                <Mail size={20} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-sm">{email.email_address}</p>
                <div className="flex items-center gap-2 mt-0.5">
                   <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">{email.label}</span>
                   {email.is_primary && (
                     <span className="bg-green-100 text-green-700 text-[10px] px-1.5 py-0.5 rounded font-bold">PRIMARY</span>
                   )}
                </div>
              </div>
              <CheckCircle2 className="text-gray-200 group-hover:text-brand-600 transition-colors" size={20} />
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-800 text-sm font-medium py-2 px-4">
            Cancel Selection
          </button>
        </div>

      </div>
    </div>
  );
};

export default EmailSelectView;