import React from 'react';
import { Plus, ScanLine, User, Search, ArrowRight, UserPlus } from 'lucide-react';
import { ViewState } from '../../../../../types';

interface HomeViewProps {
  setView: (view: ViewState) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ setView }) => {
  return (
    <div className="flex-1 p-6 flex flex-col justify-center gap-6 overflow-y-auto bg-gray-50/30">
      <div className="text-center mb-4 md:mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Contact Intake</h2>
        <p className="text-gray-500 mt-2 font-medium">Choose how you want to add or find a contact.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mx-auto">
        {/* Option A: New Contact */}
        <button 
          onClick={() => setView('CAPTURE_MENU')}
          className="group relative flex flex-col items-start p-8 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-brand-500/10 hover:border-brand-200 transition-all duration-300 text-left overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-brand-50 to-transparent rounded-bl-[60px] opacity-50 group-hover:opacity-100 transition-opacity"></div>
          
          <div className="p-4 bg-brand-50 text-brand-600 rounded-2xl mb-6 group-hover:bg-brand-600 group-hover:text-white transition-colors duration-300 shadow-sm relative z-10">
            <UserPlus className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2 relative z-10">New Contact</h3>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed relative z-10 font-medium">
            Capture a business card, scan a QR code, or use NFC to add a new lead instantly.
          </p>
          <div className="mt-auto flex items-center text-brand-600 font-bold text-sm group-hover:translate-x-2 transition-transform relative z-10">
            Start Capture <ArrowRight size={18} className="ml-2" />
          </div>
        </button>

        {/* Option B: Existing Contact */}
        <button 
          onClick={() => setView('SEARCH')}
          className="group relative flex flex-col items-start p-8 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-purple-500/10 hover:border-purple-200 transition-all duration-300 text-left overflow-hidden"
        >
           <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-50 to-transparent rounded-bl-[60px] opacity-50 group-hover:opacity-100 transition-opacity"></div>

           <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl mb-6 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300 shadow-sm relative z-10">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2 relative z-10">Retrieve Contact</h3>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed relative z-10 font-medium">
            Search your existing database by name or company to update details or add notes.
          </p>
          <div className="mt-auto flex items-center text-purple-600 font-bold text-sm group-hover:translate-x-2 transition-transform relative z-10">
            Search Database <ArrowRight size={18} className="ml-2" />
          </div>
        </button>
      </div>
    </div>
  );
};

export default HomeView;