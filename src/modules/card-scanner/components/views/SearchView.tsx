import React, { useState, useMemo } from 'react';
import { Search, Building2, Briefcase } from 'lucide-react';
import { MOCK_DB } from '../../../../constants';
import { Contact } from '../../../../../types';

interface SearchViewProps {
  onContactSelect: (contact: Contact) => void;
}

const SearchView: React.FC<SearchViewProps> = ({ onContactSelect }) => {
  const [query, setQuery] = useState('');

  const filteredContacts = useMemo(() => {
    if (!query) return MOCK_DB;
    const lowerQ = query.toLowerCase();
    return MOCK_DB.filter(c => 
      c.first_name.toLowerCase().includes(lowerQ) || 
      c.last_name.toLowerCase().includes(lowerQ) ||
      c.company_name.toLowerCase().includes(lowerQ)
    );
  }, [query]);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-gray-50">
      {/* Search Bar */}
      <div className="bg-white p-4 shadow-sm border-b border-gray-100 z-10">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by name or company..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
            autoFocus
          />
        </div>
      </div>

      {/* Results List */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-2xl mx-auto space-y-3">
          {filteredContacts.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p>No contacts found matching "{query}"</p>
            </div>
          ) : (
            filteredContacts.map(contact => (
              <button
                key={contact.id}
                onClick={() => onContactSelect(contact)}
                className="w-full flex items-start gap-4 p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md hover:border-brand-200 transition-all text-left group"
              >
                {/* Avatar Placeholder */}
                <div className="w-12 h-12 bg-gradient-to-br from-brand-100 to-indigo-100 rounded-full flex items-center justify-center text-brand-600 font-bold text-lg">
                  {contact.first_name[0]}{contact.last_name[0]}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-900 truncate group-hover:text-brand-600 transition-colors">
                    {contact.first_name} {contact.last_name}
                  </h4>
                  <div className="flex items-center text-gray-500 text-sm mt-1 truncate">
                    <Building2 size={14} className="mr-1.5 flex-shrink-0" />
                    <span className="truncate">{contact.company_name}</span>
                  </div>
                  {contact.contact_emails.length > 0 && (
                     <div className="flex items-center text-gray-400 text-xs mt-1.5">
                       <Briefcase size={12} className="mr-1.5 flex-shrink-0" />
                       <span className="truncate">{contact.contact_emails[0].email_address}</span>
                       {contact.contact_emails.length > 1 && (
                         <span className="ml-2 bg-gray-100 px-1.5 py-0.5 rounded text-[10px] font-medium text-gray-500">
                           +{contact.contact_emails.length - 1} more
                         </span>
                       )}
                     </div>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchView;